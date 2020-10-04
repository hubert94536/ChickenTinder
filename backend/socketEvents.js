const { Accounts } = require('./models.js')
const Yelp = require('./yelpQuery.js')
var sessions = {} // store temporary sessions
var clients = {} // associates username with client id
var clientsIds = {} // associates client id with username
var invites = {} // store invites
var lastRoom = {} // store last room if user disconnected
module.exports = (io) => {
  io.on('connection', socket => {
    // replace old socket id with new one in both objects
    var socketUser = socket.handshake.query.username
    delete clientsIds[clients[socketUser]]
    clients[socketUser] = socket.id
    clientsIds[socket.id] = socketUser

    // send invite if previously sent before connection
    if (socketUser in invites) {
      var sender = invites[socketUser]
      io.to(clients[socketUser]).emit('invite', {
        username: sender,
        pic: sessions[sender].members[sender].pic,
        name: sessions[sender].members[sender].name
      })
    }
    // send reconnection if user was in a room and room still exists
    if (socketUser in lastRoom && lastRoom[socketUser] in sessions) {
      var sender = lastRoom[socketUser]
      io.to(clients[socketUser]).emit('reconnectRoom', {
        username: sender,
        pic: sessions[sender].members[sender].pic,
        name: sessions[sender].members[sender].name
      })
    }

    // check for disconnection
    socket.on('disconnect', async data => {
      try {
        var username = clientsIds[socket.id]
        if (username in lastRoom) {
          await Accounts.update({
            inSession: false
          }, {
            where: { username: username }
          })
          var room = lastRoom[username]
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
    socket.on('createRoom', async data => {
      try {
        await Accounts.update({
          inSession: true
        }, {
          where: { username: data.host }
        })
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
    socket.on('invite', async data => {
      try {
        var user = await Accounts.findOne({
          where: { username: data.username }
        })
        // check if friend is in another group
        if (user.inSession) {
          socket.emit('unreachable', data.username)
        } else {
          invites[data.username] = data.host
          io.to(clients[data.username]).emit('invite', {
            username: data.host,
            pic: sessions[data.host].members[data.host].pic,
            name: sessions[data.host].members[data.host].name
          })
        }
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    // declines invite and send to host
    socket.on('decline', data => {
      try {
        delete invites[data.username]
        io.to(clients[data.room]).emit('decline', data.username)
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    // alerts everyone in room updated status
    socket.on('joinRoom', async data => {
      // include to check if room exists
      if (data.room in sessions) {
        try {
          await Accounts.update({
            inSession: true
          }, {
            where: { username: data.username }
          })
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
    socket.on('submitFilters', data => {
      // merge to master list, send response back
      try {
        sessions[data.room].members[data.username].filters = true
        io.in(data.room).emit('update', sessions[data.room].members)
        // check if host
        if (data.username === data.room) {
          sessions[data.host].filters.price = data.price
          sessions[data.host].filters.open_at = data.open_at
          sessions[data.host].filters.radius = data.radius
          sessions[data.host].filters.latitude = data.latitude
          sessions[data.host].filters.longitude = data.longitude
        }
        for (var category in data.categories) {
          sessions[data.host].filters.categories.add(category)
        }
        console.log(sessions[data.host].filters)
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    // alert to all clients in room to start
    socket.on('start', async data => {
      // proceed to restaurant matching after EVERYONE submits filters
      try {
        const restaurantList = await Yelp.getRestaurants(sessions[data.host].filters)
        console.log(restaurantList)
        io.in(data.room).emit('start', { restaurantList: restaurantList })
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    socket.on('like', data => {
      // add restaurant id to list + check for matches
      try {
        sessions[data.room].restaurants[data.restaurant] = (sessions[data.room].restaurants[data.restaurant] || 0) + 1
        if (sessions[data.room].restaurants[data.restaurant] === Object.keys(sessions[data.room].members).length) {
          socket.emit('like', { restaurant: data.restaurant, room: data.room })
          console.log(data.restaurant)
        } else {
          console.log(sessions[data.room])
        }
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    socket.on('match', data => {
      try {
        io.in(data.room).emit('match', data.restaurant)
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    // leaving a session
    socket.on('leave', async data => {
      try {
        await Accounts.update({
          inSession: false
        }, {
          where: { username: data.username }
        })
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
    socket.on('kick', data => {
      try {
        io.to(clients[data.username]).emit('kick', { username: data.username, room: data.room })
        console.log(data.username)
      } catch (error) {
        socket.emit('exception', error)
      }
    })

    // alert all users to leave room
    socket.on('end', data => {
      try {
        io.in(data.room).emit('leave', data.room)
      } catch (error) {
        socket.emit('exception', error)
      }
    })
  })
}
