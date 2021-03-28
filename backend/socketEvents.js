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
              // check if the room is in a round (majority is only set when round starts)
              if (session.stage === 'round') {

              } else {
                // Room is still in groups page and receives updated room
                session.members[socket.user.uid].connected = false
                await sendCommand('JSON.SET', [
                  socket.user.room,
                  `.members['${socket.user.uid}'].connected`,
                  false
                ])
                io.in(socket.user.room).emit('update', session)
              }
            }
          }
        }
      } catch (err) {
        console.error(err)
      }
    })

    // creates session and return session info to host
    socket.on('create', async (data) => {
      try {
        if (!socket.user.room && data.session) {
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
          // intialize member in session
          data.session.code = code
          data.session.host = host
          data.session.members[host] = {}
          data.session.members[host].name = socket.user.name
          data.session.members[host].username = socket.user.username
          data.session.members[host].photo = socket.user.photo
          data.session.members[host].filters = false
          data.session.members[host].connected = true
          // set session and filters in cache and emit to user
          await sendCommand('JSON.SET', [code, '.', JSON.stringify(data.session)])
          // associate uid to last room
          await hmset(`users:${socket.user.uid}`, 'room', code)
          // update user's socket to hold room code
          socket.user.room = code
          socket.join(socket.user.room)
          socket.emit('update', session)
        }
      } catch (err) {
        socket.emit('exception', 'create')
        console.error(err)
      }
    })

    // send invite with host info to join a room
    socket.on('invite', (data) => {
      if (data.uid && socket.user.room) {
        // create request body
        let req = {}
        req.body = {}
        req.body.receiver_uid = data.uid
        req.body.type = 'invite'
        req.body.content = socket.user.room
        req.body.sender_uid = socket.user.uid
        notifs.createNotif(req).catch((err) => console.error(err))
      }
    })

    // updates room when someone joins
    socket.on('join', async (data) => {
      try {
        if (data.code && data.member) {
          // check if the session exists
          let session = await sendCommand('JSON.GET', [data.code])
          session = JSON.parse(session)
          if (session && session.open) {
            // update session info with member
            await sendCommand('JSON.SET', [
              data.code,
              `.members['${socket.user.uid}']`,
              JSON.stringify(data.member),
            ])
            // associate uid to last room
            await hmset(`users:${socket.user.uid}`, 'room', data.code)
            socket.user.room = data.code
            socket.join(data.code)
            io.in(data.code).emit('update', session)
          } else {
            console.log('exception')
            socket.emit('exception', 'join')
          }
        }
      } catch (err) {
        socket.emit('exception', 'join')
        console.error(err)
      }
    })

    // merge user's filters to master list, send updated session back
    socket.on('submit', async (data) => {
      try {
        if (socket.user.room) {
          if (data.categories) {
            // append filters categories
            await sendCommand('JSON.STRAPPEND', [
              socket.user.room,
              '.filters.categories',
              JSON.stringify(data.categories),
            ])
          }
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
        }
      } catch (err) {
        socket.emit('exception', 'submit')
        console.error(err)
      }
    })

    // alert to all clients in room to start
    socket.on('start', async (data) => {
      try {
        // TODO: offload to client
        if (socket.user.room && data.filters) {
          // retreive filters and session info
          let session = await sendCommand('JSON.GET', [socket.user.room])
          session = JSON.parse(session)
          // set filters for yelp querying from host filters
          if (data.filters.price) {
            session.filters.price = data.filters.price
          }
          if (data.filters.open_at) {
            session.filters.open_at = data.filters.open_at
          }
          session.filters.radius = data.filters.radius
          if (data.filters.location) {
            session.filters.location = data.filters.location
          } else {
            session.filters.latitude = data.filters.latitude
            session.filters.longitude = data.filters.longitude
          }
          if (data.filters.limit) {
            session.filters.limit = data.filters.limit
          }
          session.filters.categories += data.filters.categories
          if (session.filters.categories.endsWith(',')) {
            session.filters.categories = session.filters.categories.slice(0, -1)
          }
          // keep temporary categories in case no restaurants returned
          session.tempCategories = session.filters.categories
          session.filters.categories = Array.from(new Set(session.filters.categories.split(','))).toString()
          // fetch restaurants from Yelp
          const resList = await yelp.getRestaurants(session.filters)
          // emit that no restaurants were found
          if (!resList.businessList || resList.businessList.length == 0) {
            // reset filters except for group's categories
            session.filters = {}
            session.filters.categories = session.tempCategories
            await sendCommand('JSON.SET', [
              socket.user.room,
              '.',
              JSON.stringify(session),
            ])
            socket.emit('reselect')
          } else {
            // prevent new users to join room
            session.open = false
            session.stage = 'round'
            // clear filters for getting restaurants and replace with group logistics
            session.majority = data.filters.majority
            session.groupSize = data.filters.groupSize
            session.finished = []
            // initialize container to keep track of restaurant likes
            session.restaurants = {}
            for (let res in resList.businessList) {
              session.restaurants[resList.businessList[res].id] = 0
            }
            await sendCommand('JSON.SET', [
              socket.user.room,
              '.',
              JSON.stringify(session),
            ])
            io.in(socket.user.room).emit('start', resList.businessList)
          }
        }
      } catch (err) {
        socket.emit('exception', 'start')
        console.error(err)
      }
    })

    // add restaurant id to list + check for matches
    socket.on('like', async (data) => {
      try {
        if (socket.user.room && data.resId) {
          // increment restaurant count
          await sendCommand('JSON.NUMINCRBY', [
            socket.user.room,
            `.restaurants['${data.resId}']`,
            1,
          ])
          let session = await sendCommand('JSON.GET', [socket.user.room])
          session = JSON.parse(session)
          // check if # likes = majority => match
          if (session.restaurants[data.resId] >= session.majority) {
            await sendCommand('JSON.SET', [socket.user.room, `.stage`, 'match'])
            io.in(socket.user.room).emit('match', data.resId)
          } else {
            // set what card user was last on
            await sendCommand('JSON.SET', [socket.user.room, `.members['${socket.user.uid}'].card`, data.resId])
          }
        }
      } catch (err) {
        console.error(err)
      }
    })

    // set what card user was last on
    socket.on('dislike', async (data) => {
      try {
        if (socket.user.room && data.resId) {
          await sendCommand('JSON.SET', [socket.user.room, `.members['${socket.user.uid}'].card`, data.resId])
        }
      } catch (err) {
        console.error(err)
      }
    })

    // leaving during swiping round
    socket.on('leave round', async () => {
      try {
        if (socket.user.room) {
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
          await hdel(`users:${socket.user.uid}`, 'room')
          delete socket.user.room
        }
      } catch (err) {
        console.error(err)
      }
    })

    // leaving in group screen
    socket.on('leave group', async () => {
      try {
        if (socket.user.room) {
          socket.leave(socket.user.room)
          // retrieve session information
          let session = await sendCommand('JSON.GET', [socket.user.room])
          session = JSON.parse(session)
          if (session) {
            delete session.members[socket.user.uid]
            await sendCommand('JSON.DEL', [`${socket.user.room}`, `.members['${socket.user.uid}']`])
            // Room is still in groups page and receives updated room
            io.in(socket.user.room).emit('update', session)
          }
          await hdel(`users:${socket.user.uid}`, 'room')
          delete socket.user.room
        }
      } catch (err) {
        console.error(err)
      }
    })

    // alert user to be kicked from room
    socket.on('kick', async (data) => {
      try {
        if (data.uid) {
          // get socket id associated to user uid
          let user = await hgetAll(`users:${data.uid}`)
          if (user && user.client) {
            io.to(user.client).emit('kick')
          }
        }
      } catch (err) {
        socket.emit('exception', `kick:${data.uid}`)
        console.error(err)
      }
    })
    // TODO
    // lets server know user is done swiping, send top 3 matches if everyone's finished
    socket.on('finished', async () => {
      try {
        if (socket.user.room) {
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
        }
      } catch (err) {
        console.error(err)
      }
    })

    // alert all users to choose random pick
    socket.on('choose', (data) => {
      if (socket.user.room && data.index >= 0) {
        io.in(socket.user.room).emit('choose', data.index)
      }
    })

    // alert all users to leave
    socket.on('end', async () => {
      if (socket.user.room) {
        try {
          await sendCommand('JSON.DEL', [`${socket.user.room}`])
          await hdel(`users:${socket.user.uid}`, 'room')
          io.in(socket.user.room).emit('leave')
          delete socket.user.room
        } catch (err) {
          console.error(err)
        }
      }
    })

    // users left because host ended session or after swiping
    socket.on('end leave', async () => {
      if (socket.user.room) {
        try {
          socket.leave(socket.user.room)
          await hdel(`users:${socket.user.uid}`, 'room')
          delete socket.user.room
        } catch (err) {
          console.error(err)
        }
      }
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
