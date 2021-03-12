const { pool } = require('./config.js')
const { hmset, hdel, hgetAll, firebase } = require('./config.js')
const messaging = firebase.messaging()
const { Notifications } = require('./models.js')

// TODO: Remove debugging code when done

pool.connect((err, client) => {
  if (err) {
    console.error(err)
  }
  client.on('notification', (msg) => {
    const notif = JSON.parse(msg.payload)
    sendNotification(notif)
  })
  client.query('LISTEN notifications')
})

const sendNotification = async (notif) => {
  try {
    console.log(notif)
    const user = await hgetAll(`users:${notif.receiver_uid}`)
    // only send notification if user exists or regtoken is attached to the user
    if (user && user.regtoken) {
      console.log('send notification')
      const data = {
        type: notif.type,
        content: notif.content,
        name: notif.name,
        username: notif.username,
        photo: notif.photo,
      }
      const message = {
        data: { config: JSON.stringify(data) },
        token: user.regtoken,
      }
      messaging.send(message)
    }
  } catch (error) {
    console.log(error)
  }
}

// associate regtoken with id
// called on login / if ID is in async storage when App.js is (re)loaded
const linkToken = async (req, res) => {
  try {
    console.log(req.authId)
    await hmset(`users:${req.authId}`, 'regtoken', req.body.token)
    console.log(`${req.authId} linked to ${req.body.token}`)
    return res.status(200).send('linked')
  } catch (error) {
    return res.sendStatus(500)
  }
}

// disassociate regtoken with id
// called on logout
const unlinkToken = async (req, res) => {
  try {
    console.log(req.authId)
    await hdel(`users:${req.authId}`, 'regtoken')
    console.log(`${req.authId} unlinked`)
    return res.status(200).send('unlinked')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

// for testing
// send 'id' and 'type' in the body of the id
// 'receiver_id' and 'sender_id' are the same for convenience
// currently supported types: 'invite', 'pending', 'friends'
// testing path: '/notifications/test' via POST request
const testNotif = (req, res) => {
  try {
    Notifications.create({
      receiver_uid: req.body.id,
      type: req.body.type,
      content: 'message',
      sender_uid: req.body.id,
    })
    return res.status(200).send('test sent')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

module.exports = { linkToken, unlinkToken, testNotif }
