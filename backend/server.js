const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const io = require('socket.io')()
const validateRoute = require('express-joi-validation').createValidator({})
const accounts = require('./accountsQueries.js')
const auth = require('./auth.js')
const friends = require('./friendsQueries.js')
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
// uncomment below once front-end is set up
// app.use(auth.decodeJWT)
// app.use(auth.isAuthenticated)

// if development mode, allow self-signed ssl
if (app.get('env') === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

// Accounts table
// app
//   .route('/accounts')
//   .get(accounts.getAllAccounts)
//   .post(schema.checkCreateAccounts, accounts.createAccount)

app
  .route('/accounts/search/:text')
  .get(validateRoute.params(schema.textSchema), accounts.searchAccounts)

app
  .route('/accounts')
  .get(auth.authenticate, accounts.getAccountByUID)
  .post(schema.checkCreateAccounts, auth.authenticate, accounts.createAccount)
  .put(schema.checkUpdateAccount, auth.authenticate, accounts.updateAccount)
  .delete(auth.authenticate, accounts.deleteAccount)

app
  .route('/username/:username')
  .get(validateRoute.params(schema.usernameSchema), accounts.checkUsername)

// TODO: unauthenticated
app
  .route('/phoneNumber/:phone_number')
  .get(validateRoute.params(schema.phoneNumberSchema), accounts.checkPhoneNumber)
// TODO: unauthenticated
app.route('/email/:email').get(validateRoute.params(schema.emailSchema), accounts.checkEmail)

// Friendships table
// app.route('/friendships/:uid').get(validateRoute.params(schema.uidSchema), friends.getFriends)

// app
//   .route('/friendships/:main/:friend')
//   .post(validateRoute.params(schema.friendshipSchema), friends.createFriends)
//   .delete(validateRoute.params(schema.friendshipSchema), friends.deleteFriendship)
//   .put(validateRoute.params(schema.friendshipSchema), friends.acceptRequest)
app.route('/friendships').get(friends.getFriends)

app
  .route('/friendships/:uid')
  .post(validateRoute.params(schema.uidSchema), auth.authenticate, friends.createFriends)
  .delete(validateRoute.params(schema.uidSchema), auth.authenticate, friends.deleteFriendship)
  .put(validateRoute.params(schema.uidSchema), auth.authenticate, friends.acceptRequest)
// TODO: unauthenticated
// Notifications table
app
  .route('/notifications')
  .get(notifications.getNotifs)

app
  .route('/notifications/:id')
  .delete(validateRoute.params(schema.idSchema), auth.authenticate, notifications.deleteNotif)

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})
