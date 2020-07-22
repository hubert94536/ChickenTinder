const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./accountsQueries.js')

var port = process.env.PORT || 5432;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

console.log(app.get('/accounts', db.getUsers))
//app.get('/accounts/:id', db.getUserById)
// app.post('/users', db.createUser)
// app.put('/users/:id', db.updateUser)
// app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})