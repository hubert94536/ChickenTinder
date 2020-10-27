const express = require('express')
const io = require('socket.io')()
const bodyParser = require('body-parser')
const accounts = require('./accountsQueries.js')
const friends = require('./friendsQueries.js')
const Joi = require('joi')
const http = require('http')

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
  const { value, error } = schema.validate(req.body, validationOptions)
  if (error) {
    next(`Validation error: ${error.details.map((x) => x.message).join(', ')}`)
  } else {
    req.body = value
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
    id: Joi.number().integer().required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.email().required(),
    photo: Joi.string().required(),
    phone_number: Joi.string().min(7).max(15),
  })
  validateRequest(req, next, createAccountsSchema)
}

app.route('/accounts/search/:text').get(accounts.searchAccounts)

app
  .route('/accounts/:id')
  .get(accounts.getAccountById)
  .put(accounts.updateAccount)
  .delete(accounts.deleteAccount)

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
    .with('main', 'friend')
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
