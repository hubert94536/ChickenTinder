const _ = require('underscore')
const socketAuth = require('socketio-auth')
const auth = require('./auth')
const { hdel, hgetAll, hmset, sendCommand } = require('./config.js')
const notifs = require('./notifsQueries.js')
const yelp = require('./yelpQuery.js')

// gets top 3 liked restaurants for a session
const getTop3 = (restaurants) => {
  let arrKey = ['', '', '']
  let arrVal = [0, 0, 0]
  // loops through keys and sets array to order of most likes
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
  return top3
}

module.exports = (io) => {
  // removes socket client from each namespace until authentication
  _.each(io.nsps, function (nsp) {
    nsp.on('connect', function (socket) {
      delete nsp.connected[socket.id]
    })
  })

  socketAuth(io, {
    authenticate: async (socket, data, callback) => {
      const { token } = data
      try {
        // verify token passed in authentication
        const user = await auth.verifySocket(token)
        socket.user = user
        return callback(null, true)
      } catch (err) {
        return callback({ message: 'UNAUTHORIZED' })
      }
    },
    postAuthenticate: async (socket) => {
      // reconnect socket client to each namespace
      _.each(io.nsps, function (nsp) {
        if (_.findWhere(nsp.sockets, { id: socket.id })) {
          nsp.connected[socket.id] = socket
        }
      })
      // associate uid to socket id
      hmset(`users:${socket.user.uid}`, 'client', socket.id).catch((err) => console.error(err))
    },
  })

  io.on('connection', async (socket) => {
    // disconnects user and removes them if in room
    socket.on('disconnect', async () => {
      try {
        if (socket.user) {
          // delete old socket id
          hdel(`users:${socket.user.uid}`, 'client').catch((err) => console.error(err))
          if (socket.user.room) {
            socket.leave(socket.user.room)
            // retrieve session information
            let session = await sendCommand('JSON.GET', [socket.user.room])
            session = JSON.parse(session)
            // check if user was in a room and room still active
            if (session) {
              // delete room and its filters if the host disconnected
              if (session.host === socket.user.uid) {
                io.in(socket.user.room).emit('leave')
                sendCommand('JSON.DEL', [socket.user.room]).catch((err) => console.error(err))
                sendCommand('JSON.DEL', [`filters:${socket.user.room}`]).catch((err) =>
                  console.error(err),
                )
              }
              // update live session with removed user
              else {
                // retrieve a session's filters
                let filters = await sendCommand('JSON.GET', [`filters:${socket.user.room}`])
                filters = JSON.parse(filters)
                // check if the room is in a round (majority is only set when round starts)
                if (filters.majority) {
                  let index = filters.finished.indexOf(socket.user.uid)
                  // if user is still swiping in round, reduce majority and group size by 1
                  if (index < 0 && !filters.match) {
                    // if the removed user was last person to finish, get top 3 restaurants and emit
                    if (filters.finished.length >= filters.groupSize - 1) {
                      let top3 = getTop3(filters.restaurants)
                      io.in(socket.user.room).emit('final', top3)
                    } else {
                      // decrement majority and group size by 1 otherwise
                      sendCommand('JSON.NUMINCRBY', [
                        `filters:${socket.user.room}`,
                        '.majority',
                        -1,
                      ]).catch((err) => console.error(err))
                      sendCommand('JSON.NUMINCRBY', [
                        `filters:${socket.user.room}`,
                        '.groupSize',
                        -1,
                      ]).catch((err) => console.error(err))
                    }
                  }
                } else {
                  delete session.members[socket.user.uid]
                  await sendCommand('JSON.DEL', [
                    socket.user.room,
                    `.members['${socket.user.uid}']`,
                  ])
                  // Room is still in groups page and receives updated room
                  delete session.members[socket.user.uid]
                  await sendCommand('JSON.DEL', [
                    socket.user.room,
                    `.members['${socket.user.uid}']`,
                  ])
                  io.in(socket.user.room).emit('update', session)
                }
              }
            }
            delete socket.user.room
          }
        }
      } catch (err) {
        console.error(err)
      }
    })

    // creates session and return session info to host
    socket.on('create', async () => {
      try {
        let host = socket.user.uid
        let code = null
        let unique = false
        // create new 6 digit code while the random one generated isn't unique
        while (!unique) {
          code = Math.floor(100000 + Math.random() * 900000) // set 6 digit code
          // check if code already exists
          let res = await sendCommand('JSON.GET', [code])
          if (!res) {
            unique = true
          }
        }
        // intialize session info
        let session = {}
        session.host = host
        session.code = code
        session.members = {}
        session.members[host] = {}
        session.members[host].name = socket.user.name
        session.members[host].username = socket.user.username
        session.members[host].photo = socket.user.photo
        session.members[host].filters = false
        // set filters info
        let filters = {}
        filters.categories = ''
        // set session and filters in cache and emit to user
        await sendCommand('JSON.SET', [code, '.', JSON.stringify(session)])
        await sendCommand('JSON.SET', [`filters:${code}`, '.', JSON.stringify(filters)])
        // update user's socket to hold room code
        socket.user.room = code
        socket.user.isHost = true
        socket.join(socket.user.room)
        socket.emit('update', session)
      } catch (err) {
        socket.emit('exception', 'create')
        console.error(err)
      }
    })

    // send invite with host info to join a room
    socket.on('invite', async (data) => {
      // create request body
      let req = {}
      req.body = {}
      req.body.receiver_uid = data.receiver_uid
      req.body.type = 'invite'
      req.body.content = data.code
      req.body.sender_uid = socket.user.uid
      notifs.createNotif(req).catch((err) => console.error(err))
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
          member.name = socket.user.name
          member.username = socket.user.username
          member.photo = socket.user.photo
          member.filters = false
          session.members[socket.user.uid] = member
          // update session info with member
          await sendCommand('JSON.SET', [
            data.code,
            `.members['${socket.user.uid}']`,
            JSON.stringify(member),
          ])
          socket.user.room = data.code
          socket.user.isHost = false
          socket.join(data.code)
          io.in(data.code).emit('update', session)
        } else {
          socket.emit('exception', 'join')
        }
      } catch (err) {
        socket.emit('exception', 'join')
        console.error(err)
      }
    })

    // merge user's filters to master list, send updated session back
    socket.on('submit', async (data) => {
      try {
        // append filters categories
        await sendCommand('JSON.STRAPPEND', [
          `filters:${socket.user.room}`,
          'categories',
          JSON.stringify(data.categories),
        ])
        // update member who submitted filters
        await sendCommand('JSON.SET', [
          socket.user.room,
          `.members['${socket.user.uid}'].filters`,
          true,
        ])
        // retrieve session info
        let session = await sendCommand('JSON.GET', [socket.user.room])
        session = JSON.parse(session)
        io.in(socket.user.room).emit('update', session)
      } catch (err) {
        socket.emit('exception', 'submit')
        console.error(err)
      }
    })

    // alert to all clients in room to start
    socket.on('start', async (data) => {
      try {
        // retreive filters and session info
        let filters = await sendCommand('JSON.GET', [`filters:${socket.user.room}`])
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
        if (filters.categories.endsWith(',')) {
          filters.categories = filters.categories.slice(0, -1)
        }
        // keep temporary categories in case no restaurants returned
        let tempCategories = filters.categories
        filters.categories = Array.from(new Set(filters.categories.split(','))).toString()
        // fetch restaurants from Yelp
        const resList = await yelp.getRestaurants(filters)
        // emit that no restaurants were found
        if (!resList.businessList || resList.businessList.length == 0) {
          // reset filters except for group's categories
          filters = {}
          filters.categories = tempCategories
          await sendCommand('JSON.SET', [
            `filters:${socket.user.room}`,
            '.',
            JSON.stringify(filters),
          ])
          socket.emit('reselect')
        } else {
          // clear filters for getting restaurants and replace with group logistics
          filters = {}
          filters.majority = data.filters.majority
          filters.groupSize = data.filters.groupSize
          filters.finished = []
          // initialize container to keep track of restaurant likes
          filters.restaurants = {}
          for (let res in resList.businessList) {
            filters.restaurants[resList.businessList[res].id] = 0
          }
          await sendCommand('JSON.SET', [
            `filters:${socket.user.room}`,
            '.',
            JSON.stringify(filters),
          ])
          io.in(socket.user.room).emit('start', resList.businessList)
        }
      } catch (err) {
        socket.emit('exception', 'start')
        console.error(err)
      }
    })

    // add restaurant id to list + check for matches
    socket.on('like', async (data) => {
      try {
        // increment restaurant count
        await sendCommand('JSON.NUMINCRBY', [
          `filters:${socket.user.room}`,
          `.restaurants['${data.resId}']`,
          1,
        ])
        let filters = await sendCommand('JSON.GET', [`filters:${socket.user.room}`])
        filters = JSON.parse(filters)
        // check if # likes = majority => match
        if (filters.restaurants[data.resId] >= filters.majority) {
          await sendCommand('JSON.SET', [`filters:${socket.user.room}`, `.match`, true])
          io.in(socket.user.room).emit('match', data.resId)
        }
      } catch (err) {
        console.error(err)
      }
    })

    // leaving during swiping round
    socket.on('leave round', async () => {
      try {
        socket.leave(socket.user.room)
        // retrieve a session's filters
        let filters = await sendCommand('JSON.GET', [`filters:${socket.user.room}`])
        filters = JSON.parse(filters)
        if (filters) {
          // if the removed user was last person to finish, get top 3 restaurants and emit
          if (filters.finished.length === filters.groupSize - 1) {
            let top3 = getTop3(filters.restaurants)
            io.in(socket.user.room).emit('final', top3)
          } else {
            // decrease the majority and group size by 1
            sendCommand('JSON.NUMINCRBY', [
              `filters:${socket.user.room}`,
              '.majority',
              -1,
            ]).catch((err) => console.error(err))
            sendCommand('JSON.NUMINCRBY', [
              `filters:${socket.user.room}`,
              '.groupSize',
              -1,
            ]).catch((err) => console.error(err))
          }
        }
        delete socket.user.room
      } catch (err) {
        console.error(err)
      }
    })

    // leaving in group screen
    socket.on('leave group', async () => {
      try {
        // retrieve session information
        let session = await sendCommand('JSON.GET', [socket.user.room])
        session = JSON.parse(session)
        if (session) {
          delete session.members[socket.user.uid]
          await sendCommand('JSON.DEL', [socket.user.room, `.members['${socket.user.uid}']`])
          // Room is still in groups page and receives updated room
          io.in(socket.user.room).emit('update', session)
          delete socket.user.room
        }
      } catch (err) {
        console.error(err)
      }
    })

    // alert user to be kicked from room
    socket.on('kick', async (data) => {
      try {
        // get socket id associated to user uid
        let user = await hgetAll(`users:${data.uid}`)
        if (user && user.client) {
          io.to(user.client).emit('kick')
        }
      } catch (err) {
        socket.emit('exception', `kick:${data.uid}`)
        console.error(err)
      }
    })

    // lets server know user is done swiping, send top 3 matches if everyone's finished
    socket.on('finished', async () => {
      try {
        // add user's uid to finished array in filters
        await sendCommand('JSON.ARRAPPEND', [
          `filters:${socket.user.room}`,
          'finished',
          JSON.stringify(socket.user.uid),
        ])
        let filters = await sendCommand('JSON.GET', [`filters:${socket.user.room}`])
        filters = JSON.parse(filters)
        // if everyone in room is finished swiping, get the top 3 restaurants and emit
        if (filters && filters.finished.length >= filters.groupSize) {
          if (Object.keys(filters.restaurants).length == 1) {
            await sendCommand('JSON.SET', [`filters:${socket.user.room}`, `.match`, true])
            io.in(socket.user.room).emit('match', Object.keys(filters.restaurants)[0])
          } else {
            let top3 = getTop3(filters.restaurants)
            io.in(socket.user.room).emit('top 3', top3)
          }
        }
      } catch (err) {
        socket.emit('exception', 'finished')
        console.error(err)
      }
    })

    // alert all users to choose random pick
    socket.on('choose', (data) => {
      io.in(socket.user.room).emit('choose', data.index)
    })

    // alert all users to leave
    socket.on('end', () => {
      sendCommand('JSON.DEL', [socket.user.room]).catch((err) => console.error(err))
      sendCommand('JSON.DEL', [`filters:${socket.user.room}`]).catch((err) => console.error(err))
      io.in(socket.user.room).emit('leave')
    })

    // users left because host ended session or after swiping
    socket.on('end leave', () => {
      socket.leave(socket.user.room)
      delete socket.user.room
    })

    // update socket user info
    socket.on('update', (data) => {
      if (data.username) {
        socket.user.username = data.username
      }
      if (data.name) {
        socket.user.name = data.name
      }
      if (data.photo) {
        socket.user.photo = data.photo
      }
    })
  })
}
