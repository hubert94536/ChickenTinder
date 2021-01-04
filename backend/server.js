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
// if development mode, allow self-signed ssl
if (app.get('env') === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}
/*-----TESTING ENDPTS------ */
app
  .route('/test/accounts')
  .get(accounts.getAllAccounts)
  .post(accounts.createTestAccount)

app
  .route('/test/friendships/:uid')
  .post(friends.createTestFriends)
  .put(friends.acceptTestRequest)

app.route('/test/friendships')
  .get(friends.getAllFriends)

app.route('/test/notifs')
  .get(notifications.getAllNotifs)
/*------------------------- */

// Accounts table
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

app
  .route('/phoneNumber/:phone_number')
  .get(validateRoute.params(schema.phoneNumberSchema), accounts.checkPhoneNumber)

app.route('/email/:email').get(validateRoute.params(schema.emailSchema), accounts.checkEmail)

// Friendships table
app.route('/friendships').get(auth.authenticate, friends.getFriends)

app
  .route('/friendships/:uid')
  .post(validateRoute.params(schema.uidSchema), auth.authenticate, friends.createFriends)
  .delete(validateRoute.params(schema.uidSchema), auth.authenticate, friends.deleteFriendship)
  .put(validateRoute.params(schema.uidSchema), auth.authenticate, friends.acceptRequest)

// Notifications table
app
  .route('/notifications')
  .get(auth.authenticate, notifications.getNotifs)

app
  .route('/notifications/:id')
  .delete(validateRoute.params(schema.idSchema), auth.authenticate, notifications.deleteNotif)

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})
