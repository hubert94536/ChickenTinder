
const express = require('express')
const io = require('socket.io')()
const bodyParser = require('body-parser')
const accounts = require('./accountsQueries.js')
const friends = require('./friendsQueries.js')
const http = require('http')

const app = express()
const server = http.createServer(app)
io.attach(server)
require('./socketEvents.js')(io)

var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//if development mode, allow self-signed ssl
if ("development" == app.get("env")) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

//accounts accounts
app.route("/accounts")
  .get(accounts.getAllAccounts)
  .post(accounts.createAccount);

app.route("/accounts/:id")
  .get(accounts.getAccountById)
  .put(accounts.updateAccounts)
  .delete(accounts.deleteAccount);

app.route("/username/:username")
  .get(accounts.checkUsername);

app.route("/phoneNumber/:phone_number")
  .get(accounts.checkPhoneNumber);

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})

//friendships
app.route("/friendships")
  .post(friends.createFriends);

app.route("/friendships/:username/friends")
  .get(friends.getUserFriends)
  .delete(friends.deleteFriendship);

app.route("/friendships/:username/requests")
  .get(friends.getUserRequests)
  .put(friends.acceptRequest)
  .delete(friends.deleteFriendship);


