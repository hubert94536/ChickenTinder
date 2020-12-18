const joi = require('joi')

//  For validating param passed through route
const validateRoute = require('express-joi-validation').createValidator({})

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

function checkCreateAccountsSchema(req, res, next) {
  const createAccountsSchema = joi.object().keys({
    id: joi.number().positive().unsafe().required(), //ids are BigInts, which can be outside of the safe range
    name: joi.string().required(),
    username: joi.string().required(),
    email: joi.string().email().required(),
    photo: joi.string().allow('', null).required(),
    phone_number: joi.string().min(7).max(15),
  })
  validateRequest(req, next, createAccountsSchema)
}

//Check that string text is passed in through the route
const searchAccountSchema = joi.object().keys({
  text: joi.string().required(),
})

//Check that number id is passed in for GET and DELETE
const accountByIdSchema = joi.object().keys({
  id: joi.number().positive().unsafe().required(),
})

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

const phoneNumberSchema = joi.object().keys({
  phone_number: joi.string().min(7).max(15).required(),
})

const getFriendsSchema = joi.object().keys({
  user: joi.number().positive().unsafe().required(),
})

const friendshipSchema = joi.object().keys({
  user: joi.number().positive().unsafe().required(),
  friend: joi.number().positive().unsafe().required(),
})

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

//Notification schema
//Check that number id is passed in for notifications GET and DELETE
const notifsSchema = joi.object().keys({
  id: joi.number().positive().unsafe().required(),
})

module.exports = {
  validateRoute,
  validateRequest,
  checkCreateAccountsSchema,
  searchAccountSchema,
  accountByIdSchema,
  checkUpdateAccountSchema,
  usernameSchema,
  phoneNumberSchema,
  getFriendsSchema,
  friendshipSchema,
  checkCreateFriendsSchema,
  notifsSchema,
}
