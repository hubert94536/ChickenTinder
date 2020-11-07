const express = require('express')
const io = require('socket.io')()
const bodyParser = require('body-parser')
const accounts = require('./accountsQueries.js')
const friends = require('./friendsQueries.js')
const Joi = require('joi')
const http = require('http')
const { valid } = require('joi')

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
//.post(accounts.createAccount);

function checkCreateAccountsSchema(req, res, next) {
  console.log(' in create accounts schema handler!!')
  console.log(req.body)

  const createAccountsSchema = Joi.object().keys({
    id: Joi.number().unsafe().required(), //ids are BigInts, which can be outside of the safe range
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    photo: Joi.string().required(),
    phone_number: Joi.string().min(7).max(15),
  })
  validateRequest(req, next, createAccountsSchema)
}

app.route('/accounts/search/:text').get(accounts.searchAccounts)

app
  .route('/accounts/:id')
  .get(accounts.getAccountById)
  .put(checkUpdateAccountSchema, accounts.updateAccount)
  .delete(accounts.deleteAccount)
function checkUpdateAccountSchema(req, res, next) {
  const updateAccountSchema = Joi.object()
    .keys({
      id: Joi.number().unsafe(), //ids are BigInts, which can be outside of the safe range
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

app.route('/username/:username').get(accounts.checkUsername)

app.route('/phoneNumber/:phone_number').get(accounts.checkPhoneNumber)

// friendships table
app.route('/friendships').post(checkCreateFriendsSchema, friends.createFriends)
function checkCreateFriendsSchema(req, res, next) {
  const createFriendsSchema = Joi.object()
    .keys({
      main: Joi.number().integer().required(),
      friend: Joi.number().integer().required(),
    })
    .with('main', 'friend') //every main must have a friend
  validateRequest(req, next, createFriendsSchema)
}

app.route('/friendships/friends/:user').get(friends.getFriends)

app
  .route('/friendships/friends/:user/:friend')
  .delete(friends.deleteFriendship)
  .put(friends.acceptRequest)

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})
