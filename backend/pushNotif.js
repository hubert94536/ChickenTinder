const { pool } = require('./config.js')

pool.connect((err, client, release) => {
  if (err) {
    console.log(err)
  }
  client.on('notification', (msg) => {
    console.log(JSON.parse(msg.payload))
    // TODO: emit notification
  })
  client.query('LISTEN notifications')
})
