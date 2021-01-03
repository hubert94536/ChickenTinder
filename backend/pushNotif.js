const { pool } = require('./config.js')
const { hmset, hdel, hgetall, redisClient, firebase } = require('./config.js')
const messaging = firebase.messaging;

pool.connect((err, client, release) => {
  if (err) {
    console.log(err)
  }
  client.on('notification', (msg) => {
    console.log(JSON.parse(msg.payload))
    sendNotification(...msg.payload);
  })
  client.query('LISTEN notifications');
})

const sendNotification = (id, receiver_id, type, content, sender_id, name, username, photo) => {
    const message = {
        data: {
            type: type,
            content: content, 
            name: name,
            username: username, 
            photo: photo
        },
        token: hgetall(`users:${receiver_id}`).then((user) => {return user.regtoken})
    }
    messaging.send(message);
}

// associate recipientToken with id
// called on login
const linkToken = (req, res) => {
  try {
    redisClient.hmset(`users:${req.body.id}`, 'regtoken', req.body.token);
    return res.status(200).send("linked");
  } catch (error) {
    return res.sendStatus(500);
  }
}

// disassociate recipientToken with id
// called on logout
const unlinkToken = (req, res) => {
  try {
    redisClient.hdel(`users:${req.body.id}`, 'regtoken');
    return res.status(200).send("unlikned");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = { linkToken, unlinkToken };