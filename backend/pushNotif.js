const { pool } = require('./config.js')
const { hmset, hdel, hgetAll, redisClient, firebase } = require('./config.js')
const messaging = firebase.messaging();
const { Notifications } = require('./models.js')
const {v}

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
  const user = await hgetAll(`users:${notif.receiver_id}`)
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
// called on login
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
    console.log(`${req.body.id} unlinked`)
    return res.status(200).send("unlinked");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

const testNotif = (req, res) => {
  try{
    Notifications.create({
      id: 2,
      receiver_id: 3644699272284924,
      type: "test",
      content: "message",
      sender_id: 3644699272284924
    })
    return res.status(200).send("test sent");
  } catch (error) {
    return res.status(500).send(error.message);

  }
}

module.exports = { linkToken, unlinkToken, testNotif };