const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const io = require('socket.io')()
const validateRoute = require('express-joi-validation').createValidator({})
const accounts = require('./accountsQueries.js')
const friends = require('./friendsQueries.js')
const images = require('./images')
const notifications = require('./notifsQueries.js')
const schema = require('./schema.js')

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

// TODO: add schema validation for images
//image uploads
app.route('/images').post(images.upload, images.uploadHandler)

// Accounts table
app
  .route('/accounts')
  .get(accounts.getAllAccounts)
  .post(schema.checkCreateAccounts, accounts.createAccount)

app
  .route('/accounts/search/:text')
  .get(
    validateRoute.params(schema.textSchema),
    accounts.searchAccounts,
  )

app
  .route('/accounts/:id')
  .get(
    validateRoute.params(schema.idSchema),
    accounts.getAccountById,
  )
  .put(
    schema.checkUpdateAccount,
    validateRoute.params(schema.idSchema),
    accounts.updateAccount,
  )
  .delete(
    validateRoute.params(schema.idSchema),
    accounts.deleteAccount,
  )

app
  .route('/username/:username')
  .get(
    validateRoute.params(schema.usernameSchema),
    accounts.checkUsername,
  )

app
  .route('/phoneNumber/:phone_number')
  .get(
    validateRoute.params(schema.phoneNumberSchema),
    accounts.checkPhoneNumber,
  )

app.route('/email/:email').get(
  validateRoute.params(schema.emailSchema),
  accounts.checkEmail
  )

// Friendships table
app
  .route('/friendships/:id')
  .get(validateRoute.params(schema.idSchema), friends.getFriends)

app
  .route('/friendships/:main/:friend')
  .post(validateRoute.params(schema.friendshipSchema), friends.createFriends)
  .delete(
    validateRoute.params(schema.friendshipSchema),
    friends.deleteFriendship,
  )
  .put(
    validateRoute.params(schema.friendshipSchema),
    friends.acceptRequest,
  )

// Notifications table
app
  .route('/notifications/user/:id')
  .get(
    validateRoute.params(schema.idSchema),
    notifications.getNotifs,
  )

app
  .route('/notifications/:id')
  .delete(
    validateRoute.params(schema.idSchema),
    notifications.deleteNotif,
  )

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})
