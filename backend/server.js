const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const io = require('socket.io')()
const accounts = require('./accountsQueries.js')
const friends = require('./friendsQueries.js')
const images = require('./images')
const notifications = require('./notificationsQueries.js')
const schemaValidation = require('./schemaValidation.js')

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

//image uploads
app.route('/images').post(images.upload, images.uploadHandler)

// accounts table
app
  .route('/accounts')
  .get(accounts.getAllAccounts)
  .post(schemaValidation.checkCreateAccountsSchema, accounts.createAccount)

app
  .route('/accounts/search/:text')
  .get(
    schemaValidation.validateRoute.params(schemaValidation.searchAccountSchema),
    accounts.searchAccounts,
  )
app
  .route('/accounts/:id')
  .get(
    schemaValidation.validateRoute.params(schemaValidation.accountByIdSchema),
    accounts.getAccountById,
  )
  .put(
    schemaValidation.checkUpdateAccountSchema,
    schemaValidation.validateRoute.params(schemaValidation.accountByIdSchema),
    accounts.updateAccount,
  )
  .delete(
    schemaValidation.validateRoute.params(schemaValidation.accountByIdSchema),
    accounts.deleteAccount,
  )

app
  .route('/username/:username')
  .get(
    schemaValidation.validateRoute.params(schemaValidation.usernameSchema),
    accounts.checkUsername,
  )

app
  .route('/phoneNumber/:phone_number')
  .get(
    schemaValidation.validateRoute.params(schemaValidation.phoneNumberSchema),
    accounts.checkPhoneNumber,
  )

app.route('/email/:email').get(accounts.checkEmail)

// friendships table
app.route('/friendships').post(schemaValidation.checkCreateFriendsSchema, friends.createFriends)

app
  .route('/friendships/:user')
  .get(schemaValidation.validateRoute.params(schemaValidation.getFriendsSchema), friends.getFriends)

app
  .route('/friendships/:user/:friend')
  .delete(
    schemaValidation.validateRoute.params(schemaValidation.friendshipSchema),
    friends.deleteFriendship,
  )
  .put(
    schemaValidation.validateRoute.params(schemaValidation.friendshipSchema),
    friends.acceptRequest,
  )

// notifications table
app.route('/notifications/user/:id').get(notifications.getNotifs)

app.route('/notifications/:id').delete(notifications.deleteNotif)

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})
