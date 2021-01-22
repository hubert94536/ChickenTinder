const { pool } = require('./config.js')

pool.connect((err, client, release) => {
  if (err) {
    console.error(err)
  }
  client.on('notification', (msg) => {
    console.error(JSON.parse(msg.payload))
    // TODO: emit notification
  })
  client.query('LISTEN notifications')
})
