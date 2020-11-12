const express = require('express')
const io = require('socket.io')()
const bodyParser = require('body-parser')
const accounts = require('./accountsQueries.js')
const friends = require('./friendsQueries.js')
const auth = require('./auth.js')
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
// uncomment below once front-end is set up
// app.use(auth.decodeJWT)
// app.use(auth.isAuthenticated)

// if development mode, allow self-signed ssl
if (app.get('env') === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

// accounts table
// TODO: Unauthenticated
app.route('/accounts').get(accounts.getAllAccounts).post(accounts.createAccount)

app.route('/accounts/search/:text').get(accounts.searchAccounts)

app
  .route('/accounts/:id')
  .get(accounts.getAccountById)
  .put(accounts.updateAccount)
  .delete(accounts.deleteAccount)

// TODO: Unauthenticated
app.route('/username/:username').get(accounts.checkUsername)

// TODO: Unauthenticated
app.route('/phoneNumber/:phone_number').get(accounts.checkPhoneNumber)

// friendships table
app.route('/friendships').post(friends.createFriends)

app.route('/friendships/friends/:user').get(friends.getFriends)

app
  .route('/friendships/friends/:user/:friend')
  .delete(friends.deleteFriendship)
  .put(friends.acceptRequest)

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})

// auth services
app.route('/auth/access')
app.route('/auth/refresh') // TODO: FIND how to make secure