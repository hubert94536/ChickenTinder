const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const io = require('socket.io')()
const winston = require('winston')
const winstonDailyRotateFile = require('winston-daily-rotate-file')
const accounts = require('./accountsQueries.js')
const auth = require('./auth.js')
const friends = require('./friendsQueries.js')
const notifications = require('./notifsQueries.js')
const schema = require('./schema.js')


const app = express()
const server = http.createServer(app)

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.json()
)
// configurations of error logger
const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  defaultMeta: { service: 'user-service' },
  transports: [
    new winstonDailyRotateFile({
      filename: './logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info'
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'rejections.log' })
  ]
});

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
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }))
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

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})
