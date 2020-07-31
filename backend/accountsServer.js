const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./accountsQueries.js')
const cors = require('cors')
var port = process.env.PORT || 3000;

// app.use(cors({
//   origin: process.env.baseURL || 'https://wechews.herokuapp.com/',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// // app.use(function(req, res, next) {
// //   req.header('Access-Control-Allow-Origin', 'https://wechews.herokuapp.com/');
// //   res.header(
// //     'Access-Control-Allow-Headers',
// //     'Origin, X-Requested-With, Content-Type, Accept'
// //   );
// //   next();
// // });
// app.use(bodyParser.json())
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// )
// //if development mode, allow self-signed ssl
// if ("development" == app.get("env")) {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// }
// app.get('/', (request, response) => {
//   response.json({ info: 'Node.js, Express, and Postgres API' })
// })
// app.route("/accounts")
// .get(db.getAllAccounts)
// .post(db.createAccount);

// app.route("/accounts/:id")
// .get(db.getAccountById)
// .put(db.updateAccounts)
// .delete(db.deleteAccount);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})