const { pool } = require('./config.js')
const { hmset, hdel, hgetAll, redisClient, firebase } = require('./config.js')
const messaging = firebase.messaging();
const { Notifications } = require('./models.js')

// TODO: Remove debugging code when done

pool.connect((err, client, release) => {
  if (err) {
    console.log(err)
  }
  client.on('notification', (msg) => {
    const notif = JSON.parse(msg.payload)
    sendNotification(notif);
  })
  client.query('LISTEN notifications');
})

const sendNotification = async (notif) => {
  console.log("send notification")
  console.log(notif)
  const user = await hgetAll(`users:${notif.receiver_uid}`)
  console.log(user.regtoken)
  const message = {
    data: {
        type: JSON.stringify(notif.type),
        content: JSON.stringify(notif.content), 
        name: JSON.stringify(notif.name),
        username: JSON.stringify(notif.username), 
        photo: JSON.stringify(notif.photo)
    },
    token: user.regtoken
  }
  messaging.send(message);
}


// associate recipientToken with id
// called on login / if App.js is (re)loaded
const linkToken = async (req, res) => {
  try {
    console.log(req.authId)
    await hmset(`users:${req.authId}`, 'regtoken', req.body.token)
    console.log(`${req.authId} linked to ${req.body.token}`)
    return res.status(200).send("linked");
  } catch (error) {
    return res.sendStatus(500);
  }
}

// disassociate recipientToken with id
// called on logout
const unlinkToken = async (req, res) => {
  try {
    console.log(req.authId)
    await hdel(`users:${req.authId}`, 'regtoken')
    console.log(`${req.authId} unlinked`)
    return res.status(200).send("unlinked");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

// for testing
// send 'id' and 'type' in the body of the id
// 'receiver_id' and 'sender_id' are the same for convenience
// currently supported types: 'invite', 'pending', 'friends'
// testing path: '/notifications/test' via POST request
const testNotif = (req, res) => {
  try{
    Notifications.create({
      id: 2,
      receiver_id: req.body.id,
      type: req.body.type,
      content: "message",
      sender_id: req.body.id
    })
    return res.status(200).send("test sent");
  } catch (error) {
    return res.status(500).send(error.message);

  }
}

module.exports = { linkToken, unlinkToken, testNotif };