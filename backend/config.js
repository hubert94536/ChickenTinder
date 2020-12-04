const pg = require('pg')
const { promisify } = require('util')
const redis = require('redis')
const { Sequelize } = require('sequelize')

// configuration for database
const config = {
  user: process.env.USERS_USER,
  username: process.env.USERS_USER,
  host: process.env.USERS_HOST,
  password: process.env.USERS_PASSWORD,
  port: process.env.USERS_PORT,
  database: process.env.USERS_DATABASE,
  dialect: 'postgresql',
  // ssl: false
  ssl: {
    rejectUnauthorized: false,
  },
}

const sequelize = new Sequelize(config)
// const pool = new pg.Pool(config)
// pool.connect((err, client, release) => {
//     if (err) {
//         console.log(err)
//     }
//     client.on('notification', (msg) => {
//       console.log(JSON.parse(msg.payload))
//     })
//     client.query('LISTEN notifications')
//   })
 const redisClient = redis.createClient('redis://localhost:6379')
// const redisClient = redis.createClient({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT,
//   password: process.env.REDIS_PASSWORD,
// })
const hgetAll = promisify(redisClient.hgetall).bind(redisClient)
const sendCommand = promisify(redisClient.send_command).bind(redisClient)

module.exports = { sequelize, hgetAll, sendCommand, redisClient }
