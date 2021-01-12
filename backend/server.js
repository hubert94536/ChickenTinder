const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const io = require('socket.io')()
const socketAuth = require('socketio-auth')
const _ = require('underscore')
const accounts = require('./accountsQueries.js')
const auth = require('./auth.js')
const { hmset } = require('./config.js')
const friends = require('./friendsQueries.js')
const notifications = require('./notifsQueries.js')
const schema = require('./schema.js')
const pushNotif = require('./pushNotif.js')

const app = express()
const server = http.createServer(app)

io.attach(server)
require('./socketEvents.js')(io)

// removes socket client from each namespace until authentication
_.each(io.nsps, function (nsp) {
  nsp.on('connect', function (socket) {
    delete nsp.connected[socket.id]
  })
})

socketAuth(io, {
  authenticate: async (socket, data, callback) => {
    const { token } = data
    try {
      // verify token passed in authentication
      const user = await auth.verifySocket(token)
      socket.user = user
      return callback(null, true)
    } catch (err) {
      return callback({ message: 'UNAUTHORIZED' })
    }
  },
  postAuthenticate: async (socket) => {
    try {
      // reconnect socket client to each namespace
      _.each(io.nsps, function (nsp) {
        if (_.findWhere(nsp.sockets, { id: socket.id })) {
          nsp.connected[socket.id] = socket
        }
      })
      // associate uid to socket id
      await hmset(`users:${socket.user.uid}`, 'client', socket.id)
    } catch (err) {
      console.log(err)
    }
  },
})

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
app.route('/test/accounts').get(accounts.getAllAccounts).post(accounts.createTestAccount)

app
  .route('/test/friendships')
  .get(friends.getAllFriends)
  .post(friends.createTestFriends)
  .put(friends.acceptTestRequest)

app.route('/test/notifs').get(notifications.getAllNotifs)
/*------------------------- */

// Accounts table
app.route('/accounts/search').post(schema.checkSearch, accounts.searchAccounts)

app
  .route('/accounts')
  .get(auth.authenticate, accounts.getAccountByUID)
  .post(schema.checkCreateAccounts, auth.authenticate, accounts.createAccount)
  .put(schema.checkUpdateAccount, auth.authenticate, accounts.updateAccount)
  .delete(auth.authenticate, accounts.deleteAccount)

app.route('/username').post(schema.checkUsername, accounts.checkUsername)

app.route('/phone_number').post(schema.checkPhoneNumber, accounts.checkPhoneNumber)

app.route('/email').post(schema.checkEmail, accounts.checkEmail)

// Friendships table
app
  .route('/friendships')
  .get(auth.authenticate, friends.getFriends)
  .post(schema.checkFriendship, auth.authenticate, friends.createFriends)
  .delete(schema.checkFriendship, auth.authenticate, friends.deleteFriendship)
  .put(schema.checkFriendship, auth.authenticate, friends.acceptRequest)

// Notifications table
app
  .route('/notifications')
  .get(auth.authenticate, notifications.getNotifs)
  .delete(schema.checkNotif, auth.authenticate, notifications.deleteNotif)

// TODO: validate params
app
  .route('/notifications/token')
  .post(pushNotif.linkToken)
  .delete(pushNotif.unlinkToken)

app
  .route('/notifications/test')
  .post(pushNotif.testNotif)

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})
