const express = require('express')
const io = require('socket.io')()
const bodyParser = require('body-parser')
const accounts = require('./accountsQueries.js')
const friends = require('./friendsQueries.js')
const Joi = require('joi')
const http = require('http')

//  For validating param passed through route
const validateRoute = require('express-joi-validation').createValidator({})

const app = express()
const server = http.createServer(app)
io.attach(server)
require('./socketEvents.js')(io)

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

//General helper fx for validating schema
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
  const createAccountsSchema = Joi.object().keys({
    id: Joi.number().positive().unsafe().required(), //ids are BigInts, which can be outside of the safe range
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    photo: Joi.string().required(),
    phone_number: Joi.string().min(7).max(15),
  })
  validateRequest(req, next, createAccountsSchema)
}

//Check that string text is passed in through the route
const searchAccountSchema = Joi.object().keys({
  text: Joi.string().required(),
})
app
  .route('/accounts/search/:text')
  .get(validateRoute.params(searchAccountSchema), accounts.searchAccounts)

//Check that number id is passed in for GET and DELETE
const accountByIdSchema = Joi.object().keys({
  id: Joi.number().positive().unsafe().required(),
})
app
  .route('/accounts/:id')
  .get(validateRoute.params(accountByIdSchema), accounts.getAccountById)
  .put(checkUpdateAccountSchema, accounts.updateAccount)
  .delete(validateRoute.params(accountByIdSchema), accounts.deleteAccount)

//Check that some prop to be updated is passed in
function checkUpdateAccountSchema(req, res, next) {
  const updateAccountSchema = Joi.object()
    .keys({
      id: Joi.number().positive().unsafe(), //ids are BigInts, which can be outside of the safe range
      name: Joi.string(),
      username: Joi.string(),
      email: Joi.string().email(),
      photo: Joi.string(),
      phone_number: Joi.string().min(7).max(15),
    })
    //.or(peer1, peer2, ...) ==> at least 1 peer is required, there can be more than 1
    .or('name', 'username', 'email', 'photo', 'phone_number')
  validateRequest(req, next, updateAccountSchema)
}

const usernameSchema = Joi.object().keys({
  username: Joi.string().required(),
})
app.route('/username/:username').get(validateRoute.params(usernameSchema), accounts.checkUsername)

const phoneNumberSchema = Joi.object().keys({
  phone_number: Joi.string().min(7).max(15).required(),
})
app
  .route('/phoneNumber/:phone_number')
  .get(validateRoute.params(phoneNumberSchema), accounts.checkPhoneNumber)

// friendships table
app.route('/friendships').post(checkCreateFriendsSchema, friends.createFriends)
function checkCreateFriendsSchema(req, res, next) {
  const createFriendsSchema = Joi.object()
    .keys({
      main: Joi.number().integer().positive().unsafe().required(),
      friend: Joi.number().integer().positive().unsafe().required(),
    })
    .with('main', 'friend') //every main must have a friend
  validateRequest(req, next, createFriendsSchema)
}

const getFriendsSchema = Joi.object().keys({
  user: Joi.number().positive().unsafe().required(),
})
app
  .route('/friendships/friends/:user')
  .get(validateRoute.params(getFriendsSchema), friends.getFriends)

const friendshipSchema = Joi.object().keys({
  user: Joi.number().positive().unsafe().required(),
  friend: Joi.number().positive().unsafe().required(),
})
app
  .route('/friendships/friends/:user/:friend')
  .delete(validateRoute.params(friendshipSchema), friends.deleteFriendship)
  .put(validateRoute.params(friendshipSchema), friends.acceptRequest)

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})
