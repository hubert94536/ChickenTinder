const joi = require('joi')

// Accounts table schema
// Check request body for creating account
function checkCreateAccounts(req, res, next) {
  const createAccountsSchema = joi
    .object()
    .keys({
      name: joi.string().max(15).required(),
      username: joi.string().max(15).required(),
      email: joi.string().email(),
      photo: joi.string().max(3).required(),
      phone_number: joi.string().min(7).max(15),
    })
    .or('email', 'phone_number')
  validateRequest(req, next, createAccountsSchema)
}

// Check request body for updating account
function checkUpdateAccount(req, res, next) {
  const updateAccountSchema = joi
    .object()
    .keys({
      name: joi.string().max(15),
      username: joi.string().max(15),
      email: joi.string().email(),
      photo: joi.string().max(3),
      phone_number: joi.string().min(7).max(15),
    })
    .or('name', 'username', 'email', 'photo', 'phone_number')
  validateRequest(req, next, updateAccountSchema)
}

// Check request body for email
function checkEmail(req, res, next) {
  const emailSchema = joi.object().keys({
    email: joi.string().email().required(),
  })
  validateRequest(req, next, emailSchema)
}

// Check request body for phone number
function checkPhoneNumber(req, res, next) {
  const phoneNumberSchema = joi.object().keys({
    phone_number: joi.string().min(7).max(15).required(),
  })
  validateRequest(req, next, phoneNumberSchema)
}

// Check request body for search string
function checkSearch(req, res, next) {
  const searchSchema = joi.object().keys({
    text: joi.string().max(15).required(),
  })
  validateRequest(req, next, searchSchema)
}

// Check username is passed in route
function checkUsername(req, res, next) {
  const usernameSchema = joi.object().keys({
    username: joi.string().max(15).required(),
  })
  validateRequest(req, next, usernameSchema)
}
// Friendship table schema
// Check friend uid is passed in
function checkFriendship(req, res, next) {
  const friendshipSchema = joi.object().keys({
    friend: joi.string().required(),
  })
  validateRequest(req, next, friendshipSchema)
}

function checkManyNotifs(req, res, next) {
  const manyNotifSchema = joi.object().keys({
    ids: joi.array().items(joi.number()).required(),
  })
  validateRequest(req, next, manyNotifSchema)
}

// Check notification id is passed in
function checkNotif(req, res, next) {
  const notifSchema = joi.object().keys({
    id: joi.number().required(),
  })
  validateRequest(req, next, notifSchema)
}

//General helper function for validating schema
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
    next(`Validation error: ${error.details.map((err) => err.message).join(', ')}`)
  } else {
    req.body = value
    next()
  }
}

module.exports = {
  checkCreateAccounts,
  checkEmail,
  checkFriendship,
  checkManyNotifs,
  checkNotif,
  checkPhoneNumber,
  checkSearch,
  checkUpdateAccount,
  checkUsername,
}
