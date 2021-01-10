const firebase = require('firebase-admin')
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
  ssl: false,
}

const pool = new pg.Pool(config)
const sequelize = new Sequelize(config)
// const redisClient = redis.createClient('redis://localhost:6379')

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
})

const hgetAll = promisify(redisClient.hgetall).bind(redisClient)
const hmset = promisify(redisClient.hmset).bind(redisClient)
const sendCommand = promisify(redisClient.send_command).bind(redisClient)
const hdel = promisify(redisClient.hdel).bind(redisClient)
firebase.initializeApp()

module.exports = { firebase, hdel, hgetAll, hmset, pool, sendCommand, sequelize }
