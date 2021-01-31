const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const io = require('socket.io')()
const accounts = require('./accountsQueries.js')
const auth = require('./auth.js')
const friends = require('./friendsQueries.js')
const notifications = require('./notifsQueries.js')
const schema = require('./schema.js')
const pushNotif = require('./pushNotif.js')
const rateLimit = require('./rateLimit.js')

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
/*-----TESTING ENDPTS------ */
app
  .route('/test/accounts')
  .get(accounts.getAllAccounts)
  .post(accounts.createTestAccount)
  .delete(accounts.deleteTestAccount)

app
  .route('/test/friendships')
  .get(friends.getAllFriends)
  .post(friends.createTestFriends)
  .put(friends.acceptTestRequest)

app.route('/test/notifs').get(notifications.getAllNotifs)
app.route('/notifications/test').post(pushNotif.testNotif)
/*------------------------- */

// TODO: Decide which limiters to use

// Accounts table
app.route('/accounts/search').post(rateLimit.frequentLimiter, schema.checkSearch, accounts.searchAccounts)

app
  .route('/accounts')
  .get(rateLimit.accountsLimiter. auth.authenticate, accounts.getAccountByUID)
  .post(rateLimit.accountsLimiter, schema.checkCreateAccounts, auth.authenticate, accounts.createAccount)
  .put(rateLimit.accountsLimiter, schema.checkUpdateAccount, auth.authenticate, accounts.updateAccount)
  .delete(rateLimit.accountsLimiter, auth.authenticate, accounts.deleteAccount)

app.route('/username').post(rateLimit.accountsLimiter, schema.checkUsername, accounts.checkUsername)

app.route('/phone_number').post(rateLimit.accountsLimiter, schema.checkPhoneNumber, accounts.checkPhoneNumber)

app.route('/email').post(rateLimit.accountsLimiter, schema.checkEmail, accounts.checkEmail)

// Friendships table
app
  .route('/friendships')
  .get(rateLimit.defaultLimiter, auth.authenticate, friends.getFriends)
  .post(rateLimit.defaultLimiter, schema.checkFriendship, auth.authenticate, friends.createFriends)
  .delete(rateLimit.defaultLimiter, schema.checkFriendship, auth.authenticate, friends.deleteFriendship)
  .put(rateLimit.defaultLimiter, schema.checkFriendship, auth.authenticate, friends.acceptRequest)

// Notifications table
app
  .route('/notifications')
  .get(rateLimit.defaultLimiter, auth.authenticate, notifications.getNotifs)
  .delete(rateLimit.frequentLimiter, schema.checkNotif, auth.authenticate, notifications.deleteNotif)

// TODO: validate params
app
  .route('/notifications/token')
  .post(auth.authenticate, pushNotif.linkToken)
  .delete(auth.authenticate, pushNotif.unlinkToken)

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})
