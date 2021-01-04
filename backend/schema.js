const joi = require('joi')

// Accounts table schema
// Check request body for creating account
function checkCreateAccounts(req, res, next) {
  const createAccountsSchema = joi.object().keys({
    uid: joi.string().required(),
    name: joi.string().required(),
    username: joi.string().required(),
    email: joi.string().email().required(),
    photo: joi.string().allow('', null).required(),
    phone_number: joi.string().min(7).max(15),
  })
  validateRequest(req, next, createAccountsSchema)
}

// Check request body for updating account
function checkUpdateAccount(req, res, next) {
  const updateAccountSchema = joi
    .object()
    .keys({
      name: joi.string(),
      username: joi.string(),
      email: joi.string().email(),
      photo: joi.string(),
      phone_number: joi.string().min(7).max(15),
    })
    .or('name', 'username', 'email', 'photo', 'phone_number')
  validateRequest(req, next, updateAccountSchema)
}

// Check email is passed in route
const emailSchema = joi.object().keys({
  email: joi.string().email().required(),
})

// Check phone number is passed in route
const phoneNumberSchema = joi.object().keys({
  phone_number: joi.string().min(7).max(15).required(),
})

// Check string text is passed in route
const textSchema = joi.object().keys({
  text: joi.string().required(),
})

// Check username is passed in route
const usernameSchema = joi.object().keys({
  username: joi.string().required(),
})

// Friendship table schema
// Check friend uid is passed in
const uidSchema = joi.object().keys({
  uid: joi.string().required(),
})

// Check notification id is passed in route
const idSchema = joi.object().keys({
  id: joi.number().required(),
})

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
  checkUpdateAccount,
  emailSchema,
  uidSchema,
  idSchema,
  phoneNumberSchema,
  textSchema,
  usernameSchema,
}
