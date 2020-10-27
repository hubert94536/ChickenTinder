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
  .get(checkGetAllAccountsSchema, accounts.getAllAccounts)
  .post(checkCreateAccountsSchema, accounts.createAccount)
function checkGetAllAccountsSchema(req, res, next) {
  const getAllAccountsSchema = Joi.object().keys({
    users: Joi.array().min(0).items(Joi.string(), Joi.number().integer()),
  })
  validateRequest(req, next, getAllAccountsSchema)
}
function checkCreateAccountsSchema(req, res, next) {
  const createAccountsSchema = Joi.object().keys({
    id: Joi.number().integer().required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.email(),
    photo: Joi.string(),
    phone_number: Joi.string().min(7).max(15),
  })
  validateRequest(req, next, createAccountsSchema)
}

app.route('/accounts/search/:text').get(checkSearchAccountsSchema, accounts.searchAccounts)
function checkSearchAccountsSchema(req, res, next) {
  const searchAccountsSchema = Joi.object().keys({
    text: Joi.array().min(0).items(Joi.string()),
  })
  validateRequest(req, next, searchAccountsSchema)
}

app
  .route('/accounts/:id')
  .get(checkGetAccountsByIdSchema, accounts.getAccountById)
  .put(checkUpdateAccountSchema, accounts.updateAccount)
  .delete(checkDeleteAccountSchema, accounts.deleteAccount)
function checkGetAccountsByIdSchema(req, res, next) {
  const getAccountsByIdSchema = Joi.object().keys({
    id: Joi.number().integer().required(),
  })
  validateRequest(req, next, getAccountsByIdSchema)
}
function checkUpdateAccountSchema(req, res, next) {
  const updateAccountSchema = Joi.object().keys({
    id: Joi.number().integer().required(),
  })
  validateRequest(req, next, updateAccountSchema)
}
function checkDeleteAccountSchema(req, res, next) {
  const deleteAccountSchema = Joi.object().keys({
    id: Joi.number().integer().required(),
  })
  validateRequest(req, next, deleteAccountSchema)
}

app.route('/username/:username').get(checkCheckUsernameSchema, accounts.checkUsername)
function checkCheckUsernameSchema(req, res, next) {
  const checkUsernameSchema = Joi.object().keys({
    username: Joi.string().required(),
  })
  validateRequest(req, next, checkUsernameSchema)
}

app.route('/phoneNumber/:phone_number').get(checkCheckPhoneNumberSchema, accounts.checkPhoneNumber)
function checkCheckPhoneNumberSchema(req, res, next) {
  const phoneNumberSchema = Joi.object().keys({
    phone_number: Joi.string().min(7).max(15),
  })
  validateRequest(req, next, phoneNumberSchema)
}

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

app.route('/friendships/friends/:user').get(checkGetFriendsSchema, friends.getFriends)
function checkGetFriendsSchema(req, res, next) {
  const getFriendsSchema = Joi.object().keys({
    m_id: Joi.number().integer().required(),
  })
  validateRequest(req, next, getFriendsSchema)
}

app
  .route('/friendships/friends/:user/:friend')
  .delete(checkDeleteFriendshipSchema, friends.deleteFriendship)
  .put(checkAcceptRequestSchema, friends.acceptRequest)
function checkDeleteFriendshipSchema(req, res, next) {
  const deleteFriendshipSchema = Joi.object()
    .keys({
      main: Joi.number().integer().required(),
      friend: Joi.number().integer().required(),
    })
    .with('main', 'friend')
  validateRequest(req, next, deleteFriendshipSchema)
}
function checkAcceptRequestSchema(req, res, next) {
  const acceptRequestSchema = Joi.object()
    .keys({
      main: Joi.number().integer().required(),
      friend: Joi.number().integer().required(),
    })
    .with(main, friend)
  validateRequest(req, next, acceptRequestSchema)
}

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})
