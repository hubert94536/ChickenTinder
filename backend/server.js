const express = require('express')
const io = require('socket.io')()
const bodyParser = require('body-parser')
const accounts = require('./accountsQueries.js')
const friends = require('./friendsQueries.js')
const images = require('./images')
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
// if development mode, allow self-signed ssl
if (app.get('env') === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

//image uploads
app.route('/images').post(images.upload,images.uploadHandler);

// accounts table
app.route('/accounts').get(accounts.getAllAccounts).post(accounts.createAccount)

app.route('/accounts/search/:text').get(accounts.searchAccounts)

app
  .route('/accounts/:id')
  .get(accounts.getAccountById)
  .put(accounts.updateAccount)
  .delete(accounts.deleteAccount)

app.route('/username/:username').get(accounts.checkUsername)

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
