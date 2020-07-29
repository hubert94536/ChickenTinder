const express = require('express')
const router = express.Router()
const app = express()
const bodyParser = require('body-parser')
const db = require('./accountsQueries.js')

var port = process.env.PORT || 3000;

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
app.get('/accounts', db.getAllAccounts)
app.get('/accounts/:id', db.getAccountById)
app.post('/accounts', db.createAccount)
app.put('/accounts/:id', db.updateAccounts)
app.delete('/accounts/:id', db.deleteAccount)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})