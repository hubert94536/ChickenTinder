const redis = require('redis')
const { promisify } = require("util")
const Yelp = require('./yelpQuery.js')

const redisClient = redis.createClient('redis://localhost:6379')
const hgetAll = promisify(redisClient.hgetall).bind(redisClient)
const sendCommand = promisify(redisClient.send_command).bind(redisClient)

redisClient.on("connect", async () => {
  console.log('good')
  // await hmset(1, 'foo', 'bar', 'hi', 'bye')
  // let res = await hgetAll(1)
  // console.log(res['foo'].substring(0, 1))
})

module.exports = (io) => {
  io.on('connection', async (socket) => {
    try {
      // update user with new socket id and info
      let id = socket.handshake.query.id
      redisClient.hmset(`users:${id}`, 'client', socket.id)
      // create new socketId instance
      redisClient.hmset(`clients:${socket.id}`, 'id', id)
    } catch (err) {
      socket.emit('exception', err.toString())
      console.log(err)
    }

    // // send invite if previously sent before user connected
    // if (socketUser in invites && invites[socketUser] in sessions) {
    //   let sender = invites[socketUser]
    //   io.to(clients[socketUser]).emit('invite', {
    //     username: sender,
    //     pic: sessions[sender].members[sender].pic,
    //     name: sessions[sender].members[sender].name,
    //   })
    // }

    // disconnects user and removes them if in room
    socket.on('disconnect', async () => {
      try {
        let client = await hgetAll(`clients:${socket.id}`)
        redisClient.hdel(`clients:${socket.id}`, 'id', 'room')
        if (client.room) {
          let session = await sendCommand('JSON.GET', [client.room])
          session = JSON.parse(session)
          if (client.id in session.members) {
            socket.leave(client.room)
            delete session.members[client.id]
            // delete room if this is last member in room
            if (Object.keys(session.members).length === 0) {
              sendCommand('JSON.DEL', [client.room])
              sendCommand('JSON.DEL', [`filters:${client.room}`])
              sendCommand('JSON.DEL', [`res:${client.room}`])
            } else {
              // update session status
              sendCommand('JSON.SET', [client.room, '.', JSON.stringify(session)])
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
    socket.on('createRoom', async (data) => {
      try {
        let host = data.id
        let code = null
        let notUnique = true
        // create new 6 digit code while the random one generated isn't unique
        while (notUnique) {
          code = Math.floor(100000 + Math.random() * 900000) // set 6 digit code
          let res = await sendCommand('JSON.GET', [code]) // see if code already exists
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
        let filters = {}
        filters.categories = new Set()
        // set session in cache and emit to user
        sendCommand('JSON.SET', [code, '.', JSON.stringify(session)])
        sendCommand('JSON.SET', [`filters:${code}`, '.', JSON.stringify(filters)])
        redisClient.hmset(`clients:${socket.id}`, 'room', code)
        socket.join(code)
        socket.emit('update', session)
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // send invite with host info to join a room
    //   socket.on('invite', async (data) => {
    //     try {
    //       let user = await Accounts.findOne({
    //         where: { username: data.username },
    //       })
    //       // check if friend is in another group
    //       if (user.inSession) {
    //         socket.emit('unreachable', data.username)
    //       } else {
    //         invites[data.username] = data.host
    //         io.to(clients[data.username]).emit('invite', {
    //           username: data.host,
    //           pic: sessions[data.host].members[data.host].pic,
    //           name: sessions[data.host].members[data.host].name,
    //         })
    //       }
    //     } catch (error) {
    //       socket.emit('exception', error.toString())
    //     }
    //   })

    //   // declines invite and remove from invites object
    //   socket.on('decline', (data) => {
    //     try {
    //       delete invites[data.username]
    //       io.to(clients[data.room]).emit('decline', data.username)
    //     } catch (error) {
    //       socket.emit('exception', error.toString())
    //     }
    //   })

    // updates room when someone joins
    socket.on('joinRoom', async (data) => {
      try {
        // check if the room exists
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
          sendCommand('JSON.SET', [data.code, '.', JSON.stringify(session)])
          redisClient.hmset(`clients:${socket.id}`, 'room', data.code)
          socket.join(data.code)
          // TODO
          // delete invites[data.username]
          io.in(data.code).emit('update', session)
        }
        else {
          socket.send('Room does not exist :(')
        }
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // merge to master list, send response back
    socket.on('submitFilters', async (data) => {
      try {
        let filters = await sendCommand('JSON.GET', [`filters:${data.code}`])
        filters = JSON.parse(filters)
        let session = await sendCommand('JSON.GET', [data.code])
        session = JSON.parse(session)
        session.members[data.id].filters = true
        // set host filters if host
        if (data.id === session.host) {
          // initialize object of restaurants to keep track of likes
          let sessionRes = {}
          sessionRes.majority = data.filters.majority
          sessionRes.restaurants = {}
          sendCommand('JSON.SET', [`sessionRes:${data.code}`, '.', JSON.stringify(sessonRes)])
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
        }
        // add categories to set
        for (let category in data.filters.categories) {
          filters.categories.add(data.filters.categories[category])
        }
        sendCommand('JSON.SET', [data.code, '.', JSON.stringify(session)])
        sendCommand('JSON.SET', [`filters:${data.code}`, '.', JSON.stringify(filters)])
        io.in(data.code).emit('update', session)
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // alert to all clients in room to start
    socket.on('start', async (data) => {
      try {
        // transform categories set to string
        let filters = await sendCommand('JSON.GET', [`filters:${data.code}`])
        filters = JSON.parse(filters)
        filters.categories = Array.from(filters.categories).toString()
        const resList = await Yelp.getRestaurants(filters)
        // store restaurant info in cache
        for (let res in resList.businessList) {
          redisClient.hmset(`restaurants:${res.id}`,
            'name', resList.businessList[res].name,
            'distance', resList.businessList[res].distance,
            'reviewCount', resList.businessList[res].reviewCount,
            'rating', resList.businessList[res].rating,
            'price', resList.businessList[res].price,
            'phone', resList.businessList[res].phone,
            'city ', resList.businessList[res].city,
            'latitude', resList.businessList[res].latitude,
            'longitude', resList.businessList[res].longitude,
            'url', resList.businessList[res].url,
            'transactions', resList.businessList[res].transactions.toString(),
            'categories', resList.businessList[res].categories.toString(),
          )
          redisClient.expire(`restaurants:${res.id}`, 86400)
        }
        io.in(data.code).emit('start', restaurantList.businessList)
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })
    // add restaurant id to list + check for matches
    socket.on('like', async (data) => {

      try {
        let sessionRes = await sendCommand('JSON.GET', [`sessionRes:${data.code}`])
        sessionRes = JSON.parse(sessionRes)
        // increment restaurant count
        sessionRes.restaurants[data.resId] =
          (sessionRes.restaurants[data.resId] || 0) + 1
        // check if count == group size => match
        if (
          sessionRes.restaurants[data.resId] === Object.keys(sessionRes.majority)
        ) {
          // return restaurant info from cache
          let restaurant = await hgetAll(`restaurants:${data.resId}`)
          io.in(data.code).emit('match', { restaurant: restaurant })
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
        let session = await sendCommand('JSON.GET', [data.code])
        session = JSON.parse(session)
        delete session.members[data.id]
        // delete room associated to the user's socket id
        redisClient.hdel(`clients:${socket.id}`, 'room')
        // delete room if last member in room
        if (Object.keys(session.members).length === 0) {
          sendCommand('JSON.DEL', [data.code])
          sendCommand('JSON.DEL', [`filters:${data.code}`])
          sendCommand('JSON.DEL', [`res:${data.code}`])
        } else {
          // update session and emit to room
          sendCommand('JSON.SET', [data.code, '.', JSON.stringify(session)])
          io.in(data.code).emit('update', session)
        }
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // alert user to be kicked from room
    socket.on('kick', async (data) => {
      try {
        let user = await hgetall(`users:${data.id}`)
        io.to(user.client).emit('kick')
      } catch (error) {
        socket.emit('exception', error.toString())
      }
    })

    // alert all users to leave room
    socket.on('end', (data) => {
      io.in(data.code).emit('leave')
    })
  })
}
