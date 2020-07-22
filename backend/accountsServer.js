const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./accountsQueries.js')
//const { Client } = require('pg');

// const client = new Client({
//   connectionString: process.env.USERS_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// client.connect();

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });
// app.use(bodyParser.json())
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// )

// app.get('/', (request, response) => {
//   response.json({ info: 'Node.js, Express, and Postgres API' })
// })

console.log(app.get('/users', db.getUsers))
// app.get('/users/:id', db.getUserById)
// app.post('/users', db.createUser)
// app.put('/users/:id', db.updateUser)
// app.delete('/users/:id', db.deleteUser)

app.listen(process.env.PORT || 3000, () => {
  console.log(`App running on port ${3000}.`)
})