const { hgetAll, sendCommand, redisClient } = require('./config.js')
const Notifs = require('./notificationsQueries.js')
const Yelp = require('./yelpQuery.js')

// gets top 3 liked restaurants for a session
const getTop3 = (restaurants) => {
  let arrKey = ['', '', '']
  let arrVal = [0, 0, 0]
  for (let [key, value] of Object.entries(restaurants)) {
    let tempVal = 0
    let tempKey = ''
    if (value >= arrVal[0]) {
      tempVal = arrVal[0]
      tempKey = arrKey[0]
      arrVal[0] = value
      arrKey[0] = key
      value = tempVal
      key = tempKey
    }
    if (value >= arrVal[1]) {
      tempVal = arrVal[1]
      tempKey = arrKey[1]
      arrVal[1] = value
      arrKey[1] = key
      value = tempVal
      key = tempKey
    }
    if (value >= arrVal[2]) {
      tempVal = arrVal[2]
      tempKey = arrKey[2]
      arrVal[2] = value
      arrKey[2] = key
    }
  }
  let top3 = {}
  top3.choices = []
  top3.likes = []
  // push sorted array into top choices
  for (let i = 0; i < 3; i++) {
    if (arrKey[i] != '') {
      top3.choices.push(arrKey[i])
      top3.likes.push(arrVal[i])
    }
  }
  // pick a random number (0-2) to select restaurant
  top3.random = Math.floor(Math.random() * top3.choices.length)
  return top3
}

module.exports = (io) => {
  io.on('connection', async (socket) => {
    try {
      // TODO get notifications
      // update user with new socket id and info
      let id = socket.handshake.query.id
      redisClient.hmset(`users:${id}`, 'client', socket.id)
      // create new socketId instance mapping to user id
      redisClient.hmset(`clients:${socket.id}`, 'id', id)
    } catch (err) {
      socket.emit('exception', err.toString())
      console.log(err)
    }

    // disconnects user and removes them if in room
    socket.on('disconnect', async () => {
      try {
        // retrieve user's last room and id from socket id
        let client = await hgetAll(`clients:${socket.id}`)
        // delete old socket id
        redisClient.hdel(`clients:${socket.id}`, 'id', 'room')
        if (client.room) {
          // retrieve session information
          let session = await sendCommand('JSON.GET', [client.room])
          session = JSON.parse(session)
          // check if user was in a room and room still active
          socket.leave(client.room)
          delete session.members[client.id]
          // delete room and its filters if this is last member in room
          if (Object.keys(session.members).length === 0) {
            sendCommand('JSON.DEL', [client.room])
            sendCommand('JSON.DEL', [`filters:${client.room}`])
          }
          // update session with removed user and reduce majority in filters
          else {
            await sendCommand('JSON.SET', [client.room, '.', JSON.stringify(session)])
            // retreive a session's filters
            let filters = await sendCommand('JSON.GET', [`filters:${client.room}`])
            filters = JSON.parse(filters)
            // check if the room is in a round (majority is only set when round starts)
            if (filters.majority) {
              filters.majority -= 1
              filters.groupSize -= 1
              // delete user from finished list if finished
              let index = filters.finished.indexOf(client.id)
              if (index >= 0) {
                delete filters.finished[index]
              }
              await sendCommand('JSON.SET', [
                `filters:${client.room}`,
                '.',
                JSON.stringify(filters),
              ])
              // if the removed user was last person to finish, get top 3 restaurants and emit
              if (filters.finished.length === parseInt(filters.groupSize)) {
                let top3 = getTop3(filters.restaurants)
                io.in(client.room).emit('final', top3)
              }
            } else {
              io.in(client.room).emit('update', session)
            }
          }
        }
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // creates session and return session info to host
    socket.on('create', async (data) => {
      try {
        let host = data.id
        let code = null
        let notUnique = true
        // create new 6 digit code while the random one generated isn't unique
        while (notUnique) {
          code = Math.floor(100000 + Math.random() * 900000) // set 6 digit code
          // check if code already exists
          let res = await sendCommand('JSON.GET', [code])
          if (res === null) {
            notUnique = false
          }
        }
        // intialize session info
        let session = {}
        session.host = host
        session.code = code
        session.members = {}
        session.members[host] = {}
        session.members[host].name = data.name
        session.members[host].username = data.username
        session.members[host].photo = data.photo
        session.members[host].filters = false
        // set filters info
        let filters = {}
        filters.categories = ''
        // set session and filters in cache and emit to user
        await sendCommand('JSON.SET', [code, '.', JSON.stringify(session)])
        await sendCommand('JSON.SET', [`filters:${code}`, '.', JSON.stringify(filters)])
        // update user's socket id to hold room code
        redisClient.hmset(`clients:${socket.id}`, 'room', code)
        socket.join(code)
        socket.emit('update', session)
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })
    // TODO create notif in db and update
    // send invite with host info to join a room
    socket.on('invite', async (data) => {
      try {
        let user = await hgetAll(`users:${data.receiver}`)
        await Notifs.createNotif(data.receiver, 'invite', data.code, data.id)
        io.to(user.client).emit('invite', {
          id: data.id,
          username: data.username,
          photo: data.photo,
          name: data.name,
          code: data.code,
        })
      } catch (error) {
        socket.emit('exception', error.toString())
      }
    })

    // updates room when someone joins
    socket.on('join', async (data) => {
      try {
        // check if the session exists
        let session = await sendCommand('JSON.GET', [data.code])
        session = JSON.parse(session)
        if (session) {
          // initialize member object
          let member = {}
          member.name = data.name
          member.username = data.username
          member.photo = data.photo
          member.filters = false
          session.members[data.id] = member
          // update session info with member
          await sendCommand('JSON.SET', [data.code, '.', JSON.stringify(session)])
          redisClient.hmset(`clients:${socket.id}`, 'room', data.code)
          socket.join(data.code)
          io.in(data.code).emit('update', session)
        } else {
          socket.send('Room does not exist :(')
        }
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // merge user's filters to master list, send updated session back
    socket.on('submit', async (data) => {
      try {
        // append filters categories
        sendCommand('JSON.STRAPPEND', [
          `filters:${data.code}`,
          'categories',
          JSON.stringify(data.categories),
        ])
        // retrieve session info
        let session = await sendCommand('JSON.GET', [data.code])
        session = JSON.parse(session)
        // update member who submitted filters
        session.members[data.id].filters = true
        await sendCommand('JSON.SET', [data.code, '.', JSON.stringify(session)])
        io.in(data.code).emit('update', session)
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // alert to all clients in room to start
    socket.on('start', async (data) => {
      try {
        // retreive filters and session info
        let filters = await sendCommand('JSON.GET', [`filters:${data.code}`])
        filters = JSON.parse(filters)
        // set filters for yelp querying from host filters
        if (data.filters.price) {
          filters.price = data.filters.price
        }
        if (data.filters.open_at) {
          filters.open_at = data.filters.open_at
        }
        filters.radius = data.filters.radius
        if (data.filters.location) {
          filters.location = data.filters.location
        } else {
          filters.latitude = data.filters.latitude
          filters.longitude = data.filters.longitude
        }
        if (data.filters.limit) {
          filters.limit = data.filters.limit
        }
        filters.categories += data.filters.categories
        const resList = await Yelp.getRestaurants(filters)
        // clear filters for getting restaurants and replace with group logistics
        filters = {}
        filters.majority = data.filters.majority
        filters.groupSize = data.filters.groupSize
        filters.finished = []
        // initialize container to keep track of restaurant likes
        filters.restaurants = {}
        await sendCommand('JSON.SET', [`filters:${data.code}`, '.', JSON.stringify(filters)])
        io.in(data.code).emit('start', resList.businessList)
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // add restaurant id to list + check for matches
    socket.on('like', async (data) => {
      try {
        // retreive session's filters
        let filters = await sendCommand('JSON.GET', [`filters:${data.code}`])
        filters = JSON.parse(filters)
        // increment restaurant count
        if (filters.restaurants[data.resId]) {
          filters.restaurants[data.resId] = parseInt(filters.restaurants[data.resId]) + 1
        } else {
          filters.restaurants[data.resId] = 1
        }
        await sendCommand('JSON.SET', [`filters:${data.code}`, '.', JSON.stringify(filters)])
        // check if # likes = majority => match
        if (filters.restaurants[data.resId] === parseInt(filters.majority)) {
          // return restaurant info from cache
          io.in(data.code).emit('match', data.resId)
        }
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // leaving a session
    socket.on('leave', async (data) => {
      try {
        socket.leave(data.code)
        // retreive session
        let session = await sendCommand('JSON.GET', [data.code])
        session = JSON.parse(session)
        delete session.members[data.id]
        // delete room associated to the user's socket id
        redisClient.hdel(`clients:${socket.id}`, 'room')
        // delete room and its filters if last member in room
        if (Object.keys(session.members).length === 0) {
          sendCommand('JSON.DEL', [data.code])
          sendCommand('JSON.DEL', [`filters:${data.code}`])
        } else {
          await sendCommand('JSON.SET', [data.code, '.', JSON.stringify(session)])
          // retreive a session's filters
          let filters = await sendCommand('JSON.GET', [`filters:${data.code}`])
          filters = JSON.parse(filters)
          // check if the room is in a round (majority is only set when round starts)
          if (filters.majority) {
            filters.majority -= 1
            filters.groupSize -= 1
            // delete user from finished list if finished
            let index = filters.finished.indexOf(data.id)
            if (index >= 0) {
              delete filters.finished[index]
            }
            await sendCommand('JSON.SET', [`filters:${data.code}`, '.', JSON.stringify(filters)])
            // if the removed user was last person to finish, get top 3 restaurants and emit
            if (filters.finished.length === parseInt(filters.groupSize)) {
              let top3 = getTop3(filters.restaurants)
              io.in(data.code).emit('final', top3)
            }
          } else {
            // Room is still in groups page and receives updated room
            io.in(data.code).emit('update', session)
          }
        }
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // alert user to be kicked from room
    socket.on('kick', async (data) => {
      try {
        // get socket id associated to user id
        let user = await hgetAll(`users:${data.id}`)
        io.to(user.client).emit('kick')
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // lets server know user is done swiping, send top 3 matches if everyone's finished
    socket.on('finished', async (data) => {
      try {
        // add user's id to finished array in filters
        await sendCommand('JSON.ARRAPPEND', [`filters:${data.code}`, 'finished', data.id])
        let filters = await sendCommand('JSON.GET', [`filters:${data.code}`])
        filters = JSON.parse(filters)
        // if everyone in room is finished swiping, get the top 3 restaurants and emit
        if (filters.finished.length === parseInt(filters.groupSize)) {
          let top3 = getTop3(filters.restaurants)
          io.in(data.code).emit('top 3', top3)
        }
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // alert all users to choose random pick
    socket.on('randomize', (data) => {
      io.in(data.code).emit('choose')
    })
  })
}
