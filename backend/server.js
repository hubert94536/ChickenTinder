const bodyParser = require('body-parser')
const express = require('express')
const joi = require('joi')
const http = require('http')
const io = require('socket.io')()
const accounts = require('./accountsQueries.js')
const friends = require('./friendsQueries.js')
const images = require('./images')
const notifications = require('./notificationsQueries.js')

const app = express()
const server = http.createServer(app)

// io.attach(server)
// require('./socketEvents.js')(io)

//  For validating param passed through route
const validateRoute = require('express-joi-validation').createValidator({})

var PORT = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

// if development mode, allow self-signed ssl
if (app.get('env') === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

//image uploads
app.route('/images').post(images.upload, images.uploadHandler);

//General helper function for validating schema
function validateRequest(req, next, schema) {
  const validationOptions = {
    abortEarly: false, //returns all errors found
    allowUnknown: true, //allow obj to have unknown key (props)
    stripUnknown: true, //remove unknown elem from objs/arrays
  }
  // schema.validate(val, options) ==> validates val using current schema and options
  // Returns obj w keys value (validated, normalised val) and error (any validation errors)
  const { value, error } = schema.validate(req.body.params, validationOptions)
  if (error) {
    next(`Validation error: ${error.details.map((x) => x.message).join(', ')}`)
  } else {
    req.body.params = value
    next()
  }
}

// accounts table
app
  .route('/accounts')
  .get(accounts.getAllAccounts)
  .post(checkCreateAccountsSchema, accounts.createAccount)

function checkCreateAccountsSchema(req, res, next) {
  const createAccountsSchema = joi.object().keys({
    id: joi.number().positive().unsafe().required(), //ids are BigInts, which can be outside of the safe range
    name: joi.string().required(),
    username: joi.string().required(),
    email: joi.string().email().required(),
    photo: joi.string().required(),
    phone_number: joi.string().min(7).max(15),
  })
  validateRequest(req, next, createAccountsSchema)
}

//Check that string text is passed in through the route
const searchAccountSchema = joi.object().keys({
  text: joi.string().required(),
})
app
  .route('/accounts/search/:text')
  .get(validateRoute.params(searchAccountSchema), accounts.searchAccounts)

//Check that number id is passed in for GET and DELETE
const accountByIdSchema = joi.object().keys({
  id: joi.number().positive().unsafe().required(),
})
app
  .route('/accounts/:id')
  .get(validateRoute.params(accountByIdSchema), accounts.getAccountById)
  .put(checkUpdateAccountSchema, validateRoute.params(accountByIdSchema), accounts.updateAccount)
  .delete(validateRoute.params(accountByIdSchema), accounts.deleteAccount)

//Check that some prop to be updated is passed in
function checkUpdateAccountSchema(req, res, next) {
  const updateAccountSchema = joi
    .object()
    .keys({
      id: joi.number().positive().unsafe(), //ids are BigInts, which can be outside of the safe range
      name: joi.string(),
      username: joi.string(),
      email: joi.string().email(),
      photo: joi.string(),
      phone_number: joi.string().min(7).max(15),
    })
    //.or(peer1, peer2, ...) ==> at least 1 peer is required, there can be more than 1
    .or('name', 'username', 'email', 'photo', 'phone_number')
  validateRequest(req, next, updateAccountSchema)
}

const usernameSchema = joi.object().keys({
  username: joi.string().required(),
})
app.route('/username/:username').get(validateRoute.params(usernameSchema), accounts.checkUsername)

const phoneNumberSchema = joi.object().keys({
  phone_number: joi.string().min(7).max(15).required(),
})
app
  .route('/phoneNumber/:phone_number')
  .get(validateRoute.params(phoneNumberSchema), accounts.checkPhoneNumber)

app.route('/email/:email').get(accounts.checkEmail)

// friendships table
app.route('/friendships').post(checkCreateFriendsSchema, friends.createFriends)
function checkCreateFriendsSchema(req, res, next) {
  const createFriendsSchema = joi
    .object()
    .keys({
      main: joi.number().integer().positive().unsafe().required(),
      friend: joi.number().integer().positive().unsafe().required(),
    })
    .with('main', 'friend') //every main must have a friend
  validateRequest(req, next, createFriendsSchema)
}

const getFriendsSchema = joi.object().keys({
  user: joi.number().positive().unsafe().required(),
})
app.route('/friendships/:user').get(validateRoute.params(getFriendsSchema), friends.getFriends)

const friendshipSchema = joi.object().keys({
  user: joi.number().positive().unsafe().required(),
  friend: joi.number().positive().unsafe().required(),
})
app
  .route('/friendships/:user/:friend')
  .delete(validateRoute.params(friendshipSchema), friends.deleteFriendship)
  .put(validateRoute.params(friendshipSchema), friends.acceptRequest)

// notifications table
app.route('/notifications/user/:id').get(notifications.getNotifs)

app.route('/notifications/:id').delete(notifications.deleteNotif)

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})
