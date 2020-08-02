const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./accountsQueries.js')
const cors = require('cors')
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
//if development mode, allow self-signed ssl
if ("development" == app.get("env")) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})
app.route("/accounts")
.get(db.getAllAccounts)
.post(db.createAccount);

app.route("/accounts/:id")
.get(db.getAccountById)
.put(db.updateAccounts)
.delete(db.deleteAccount);

app.route("/username")
.get(db.checkUsername);

app.route("/phoneNumber")
.get(db.checkPhoneNumber);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})