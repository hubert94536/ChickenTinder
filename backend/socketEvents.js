const { Accounts } = require('./models.js')
const Yelp = require('./yelpQuery.js')
var sessions = {} // store temporary sessions
var clients = {} // associates username with client id
var clientsIds = {} // associates client id with username
var invites = {} // store invites
var lastRoom = {} // store last room if user disconnected
var restaurants = {} // caching of restaurants
module.exports = (io) => {
  io.on('connection', (socket) => {
    // replace old socket id with new one in both objects
    let socketUser = socket.handshake.query.username
    delete clientsIds[clients[socketUser]]
    clients[socketUser] = socket.id
    clientsIds[socket.id] = socketUser

    // send invite if previously sent before user connected
    if (socketUser in invites) {
      let sender = invites[socketUser]
      io.to(clients[socketUser]).emit('invite', {
        username: sender,
        pic: sessions[sender].members[sender].pic,
        name: sessions[sender].members[sender].name,
      })
    }
    // send reconnect alert if user was in a room and room still exists
    if (socketUser in lastRoom && lastRoom[socketUser] in sessions) {
      let sender = lastRoom[socketUser]
      io.to(clients[socketUser]).emit('reconnectRoom', {
        username: sender,
        pic: sessions[sender].members[sender].pic,
        name: sessions[sender].members[sender].name,
      })
    }

    // check for disconnection
    socket.on('disconnect', async () => {
      try {
        let username = clientsIds[socket.id]
        if (username in lastRoom) {
          await Accounts.update(
            {
              inSession: false,
            },
            {
              where: { username: username },
            },
          )
          let room = lastRoom[username]
          delete sessions[room].members[username]
          // delete room if this is last member in room
          if (Object.keys(sessions[room].members).length === 0) {
            delete sessions[room]
            delete lastRoom[username]
          } else {
            io.in(room).emit('update', sessions[room].members)
          }
        }
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    // creates session and return session info to host
    socket.on('createRoom', async (data) => {
      try {
        await Accounts.update(
          {
            inSession: true,
          },
          {
            where: { username: data.host },
          },
        )
        socket.join(data.host)
        sessions[data.host] = {}
        sessions[data.host].members = {}
        sessions[data.host].host = data.host
        sessions[data.host].members[data.host] = {}
        sessions[data.host].members[data.host].pic = data.pic
        sessions[data.host].members[data.host].filters = false
        sessions[data.host].members[data.host].name = data.name
        sessions[data.host].restaurants = {}
        sessions[data.host].filters = {}
        sessions[data.host].filters.categories = new Set()
        lastRoom[data.host] = data.host
        socket.emit('update', sessions[data.host])
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    // send invite with host info to join a room
    socket.on('invite', async (data) => {
      try {
        let user = await Accounts.findOne({
          where: { username: data.username },
        })
        // check if friend is in another group
        if (user.inSession) {
          socket.emit('unreachable', data.username)
        } else {
          invites[data.username] = data.host
          io.to(clients[data.username]).emit('invite', {
            username: data.host,
            pic: sessions[data.host].members[data.host].pic,
            name: sessions[data.host].members[data.host].name,
          })
        }
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    // declines invite and send to host
    socket.on('decline', (data) => {
      try {
        delete invites[data.username]
        io.to(clients[data.room]).emit('decline', data.username)
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    // alerts everyone in room updated status
    socket.on('joinRoom', async (data) => {
      // include to check if room exists
      if (data.room in sessions) {
        try {
          await Accounts.update(
            {
              inSession: true,
            },
            {
              where: { username: data.username },
            },
          )
          socket.join(data.room)
          delete invites[data.username]
          sessions[data.room].members[data.username] = {}
          sessions[data.room].members[data.username].filters = false
          sessions[data.room].members[data.username].pic = data.pic
          sessions[data.room].members[data.username].name = data.name
          lastRoom[data.username] = data.room
          io.in(data.room).emit('update', sessions[data.room].members)
        } catch (error) {
          socket.emit('exception', error)
        }
      } else {
        socket.emit('exception', 'status 404')
      }
    })

    // alerts to everyone user submitted filters & returns selected filters
    socket.on('submitFilters', (data) => {
      // merge to master list, send response back
      try {
        sessions[data.room].members[data.username].filters = true
        io.in(data.room).emit('update', sessions[data.room].members)
        // check if host
        if (data.username === data.room) {
          if (data.filters.price) {
            sessions[data.room].filters.price = data.filters.price
          }
          if (data.filters.open_at) {
            sessions[data.room].filters.open_at = data.open_at
          }
          sessions[data.room].filters.radius = data.filters.radius
          sessions[data.room].filters.latitude = data.filters.latitude
          sessions[data.room].filters.longitude = data.filters.longitude
        }
        for (let category in data.filters.categories) {
          sessions[data.room].filters.categories.add(data.filters.categories[category])
        } 
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    // alert to all clients in room to start
    socket.on('start', async (data) => {
      // proceed to restaurant matching after everyone submits filters
      try {
        sessions[data.room].filters.categories = Array.from(
          sessions[data.room].filters.categories
        ).toString()
        const restaurantList = await Yelp.getRestaurants(sessions[data.room].filters)
        // store restaurant info in 'cache'
        for (let res in restaurantList.businessList) {
          restaurants[restaurantList.businessList[res].id] = restaurantList.businessList[res]
        }
        io.in(data.room).emit('start', restaurantList.businessList)
      } catch (error) {
        console.log(error)
        socket.emit('exception', error)
      }
    })

    socket.on('like', (data) => {
      // add restaurant id to list + check for matches
      try {
        // increment restaurant count
        sessions[data.room].restaurants[data.restaurant] =
          (sessions[data.room].restaurants[data.restaurant] || 0) + 1
        if (
          sessions[data.room].restaurants[data.restaurant] ===
          Object.keys(sessions[data.room].members).length
        ) {
          // return restaurant info from 'cache'
          io.in(data.room).emit('match', { restaurant: restaurants[data.restaurant] })
          console.log(restaurants[data.restaurant])
        } else {
          console.log(data.restaurant)
        }
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    // leaving a session
    socket.on('leave', async (data) => {
      try {
        await Accounts.update(
          {
            inSession: false,
          },
          {
            where: { username: data.username },
          },
        )
        socket.leave(data.room)
        delete sessions[data.room].members[data.username]
        delete lastRoom[data.username]
        // delete room if this is last member in room
        if (Object.keys(sessions[data.room].members).length === 0) {
          delete sessions[data.room]
        } else {
          io.in(data.room).emit('update', sessions[data.room].members)
        }
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    // host can kick a user from room
    socket.on('kick', (data) => {
      try {
        io.to(clients[data.username]).emit('kick', { username: data.username, room: data.room })
        console.log(data.username)
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    // alert all users to leave room
    socket.on('end', (data) => {
      try {
        io.in(data.room).emit('leave', data.room)
      } catch (error) {
        socket.emit('exception', error)
      }
    })
  })
}
