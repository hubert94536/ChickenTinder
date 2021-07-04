const _ = require('underscore')
const socketAuth = require('socketio-auth')
const auth = require('./auth')
const { hdel, hgetAll, hmset, sendCommand, lock } = require('./config.js')
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
    timeout: 2000,
    authenticate: async (socket, data, callback) => {
      const { token } = data
      try {
        // verify token passed in authentication
        let user = await auth.verifySocket(token)
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
      try {
        let user = await hgetAll(`users:${socket.user.uid}`)
        if (user.room) {
          lock(user.room, async function (done) {
            // check if room still exists
            let session = await sendCommand('JSON.GET', [user.room])
            session = JSON.parse(session)
            if (session && typeof session === 'object') {
              // check if the member has been marked as disconnected, need to set to connected if true
              if (!session.members[socket.user.uid].connected) {
                await sendCommand('JSON.SET', [
                  user.room,
                  `.members['${socket.user.uid}'].connected`,
                  true,
                ])
                session.members[socket.user.uid].connected = true
                socket.to(user.room).emit('update', session)
              }
              // send session to reconnected user
              socket.join(user.room)
              socket.user.room = user.room
              socket.emit('reconnect', session)
            } else {
              hdel(`users:${socket.user.uid}`, 'room').catch((err) => console.error(err))
            }
            done()
          })
        } else socket.emit('reconnect')
      } catch (err) {
        console.error(err)
      }
    },
  })

  io.on('connection', (socket) => {
    socket.on('reconnection', () => {
      console.log('reconnect')
      if (socket.user.room) {
        lock(socket.user.room, async function (done) {
          // check if room still exists
          let session = await sendCommand('JSON.GET', [socket.user.room])
          session = JSON.parse(session)
          if (session) {
            // send session to user
            socket.emit('reconnect', session)
          } else {
            hdel(`users:${socket.user.uid}`, 'room').catch((err) => console.error(err))
            delete socket.user.room
            socket.emit('reconnect')
          }
          done()
        })
      } else {
        socket.emit('reconnect')
      }
    })

    // disconnects user and removes them if in room
    socket.on('disconnect', async () => {
      try {
        if (socket.user && socket.user.room) {
          console.log('disconnected: ' + socket.user.uid)
          socket.leave(socket.user.room)
          lock(socket.user.room, async function (done) {
            let user = await hgetAll(`users:${socket.user.uid}`)
            // check if they already reconnected before disconnect event was fired
            if (user.client === socket.id) {
              // retrieve session information
              let session = await sendCommand('JSON.GET', [socket.user.room])
              session = JSON.parse(session)
              // check if user was in a room and room still active
              if (session) {
                // Room is still in groups page and receives updated room
                session.members[socket.user.uid].connected = false
                await sendCommand('JSON.SET', [
                  socket.user.room,
                  `.members['${socket.user.uid}'].connected`,
                  false,
                ])
                io.in(socket.user.room).emit('update', session)
              }
            }
            done()
          })
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
          hmset(`users:${socket.user.uid}`, 'room', code).catch((err) => console.error(err))
          // update user's socket to hold room code
          socket.user.room = code
          socket.join(socket.user.room)
          socket.emit('update', data.session)
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
    // TODO multi
    // updates room when someone joins
    socket.on('join', (data) => {
      if (data.code && data.member) {
        lock(data.code, async function (done) {
          try {
            data.member.name = socket.user.name
            data.member.username = socket.user.username
            data.member.photo = socket.user.photo
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
              session.members[socket.user.uid] = data.member
              // associate uid to last room
              hmset(`users:${socket.user.uid}`, 'room', data.code).catch((err) =>
                console.error(err),
              )
              socket.user.room = data.code
              socket.join(data.code)
              io.in(data.code).emit('update', session)
            } else {
              socket.emit('exception', 'cannot join')
            }
          } catch (err) {
            socket.emit('exception', 'join')
            console.error(err)
          }
          done()
        })
      } else {
        console.error('exception')
        socket.emit('exception', 'join')
      }
    })

    // merge user's filters to master list, send updated session back
    socket.on('submit', async (data) => {
      try {
        if (data.categories) {
          // append user's filters categories
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
      } catch (err) {
        socket.emit('exception', 'submit')
        console.error(err)
      }
    })

    // alert to all clients in room to start
    socket.on('start', (data) => {
      if (socket.user.room) {
        lock(socket.user.room, async function (done) {
          try {
            let session = data.session
            if (session) {
              // fetch restaurants from Yelp
              const resList = await yelp.getRestaurants(session.filters)
              // emit that no restaurants were found
              if (!resList.businessList || resList.businessList.length == 0) {
                // reset filters except for group's categories
                session.filters = {}
                session.filters.categories = session.tempCategories
                await sendCommand('JSON.SET', [socket.user.room, '.', JSON.stringify(session)])
                socket.emit('reselect', session)
              } else {
                // prevent new users to join room
                session.open = false
                session.resInfo = resList.businessList
                for (let res in resList.businessList) {
                  session.restaurants[resList.businessList[res].id] = 0
                }
                await sendCommand('JSON.SET', [socket.user.room, '.', JSON.stringify(session)])
                io.in(socket.user.room).emit('start', session)
              }
            }
          } catch (err) {
            socket.emit('exception', 'start')
            console.error(err)
          }
          done()
        })
      } else {
        console.error('Unable to start')
      }
    })

    // add restaurant id to list + check for matches
    socket.on('like', async (data) => {
      try {
        if (data.resId) {
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
            await sendCommand('JSON.SET', [socket.user.room, '.match', JSON.stringify(data.resId)])
            io.in(socket.user.room).emit('match', data.resId)
          } else {
            // set what card user was last on
            await sendCommand('JSON.SET', [
              socket.user.room,
              `.members['${socket.user.uid}'].card`,
              JSON.stringify(data.resId),
            ])
          }
        }
      } catch (err) {
        console.error(err)
      }
    })

    // set what card user was last on
    socket.on('dislike', (data) => {
      if (data.resId) {
        sendCommand('JSON.SET', [
          socket.user.room,
          `.members['${socket.user.uid}'].card`,
          JSON.stringify(data.resId),
        ]).catch((err) => console.error(err))
      }
    })

    // handle user leaving
    socket.on('leave', () => {
      if (socket.user.room) {
        lock(socket.user.room, async function (done) {
          try {
            socket.leave(socket.user.room)
            hdel(`users:${socket.user.uid}`, 'room').catch((err) => console.error(err))
            await sendCommand('JSON.DEL', [socket.user.room, `.members['${socket.user.uid}']`])
            // retrieve a session
            let session = await sendCommand('JSON.GET', [socket.user.room])
            session = JSON.parse(session)
            // delete room if there are no more members
            if (Object.keys(session.members).length === 0) {
              sendCommand('JSON.DEL', [socket.user.room]).catch((err) => console.error(err))
            } else {
              // if the host is leaving, reassign the host
              if (session.host === socket.user.uid) {
                await sendCommand('JSON.SET', [
                  socket.user.room,
                  '.host',
                  JSON.stringify(Object.keys(session.members)[0]),
                ])
                session.host = Object.keys(session.members)[0]
              }
              // if the removed user was last person to finish in a round, get top 3 restaurants and emit
              if (
                session.restaurants &&
                !session.top3 &&
                session.finished.length === Object.keys(session.members).length
              ) {
                let top3 = getTop3(session.restaurants)
                if (top3.choices.length > 1) {
                  await sendCommand('JSON.SET', [socket.user.room, '.top3', JSON.stringify(top3)])
                  io.in(socket.user.room).emit('top 3', top3)
                } else {
                  // return match if top3 is only 1 restaurant
                  await sendCommand('JSON.SET', [
                    socket.user.room,
                    '.match',
                    JSON.stringify(top3.choices[0]),
                  ])
                  io.in(socket.user.room).emit('match', top3.choices[0])
                }
              } else if (session.restaurants && !session.top3) {
                // decrease the majority by 1
                await sendCommand('JSON.NUMINCRBY', [socket.user.room, '.majority', -1])
              }
              io.in(socket.user.room).emit('update', session)
            }
            delete socket.user.room
          } catch (err) {
            console.error(err)
          }
          done()
        })
      } else {
        console.error('Unable to leave')
      }
    })

    // alert user to be kicked from room
    socket.on('kick', async (data) => {
      try {
        if (data.uid) {
          await sendCommand('JSON.DEL', [socket.user.room, `.members['${data.uid}']`])
          let session = await sendCommand('JSON.GET', [socket.user.room])
          session = JSON.parse(session)
          io.in(socket.user.room).emit('update', session)
        }
      } catch (err) {
        socket.emit('exception', `kick:${data.uid}`)
        console.error(err)
      }
    })

    // leaving due to being kicked
    socket.on('kick leave', () => {
      socket.leave(socket.user.room)
      hdel(`users:${socket.user.uid}`, 'room').catch((err) => console.error(err))
      delete socket.user.room
    })

    // mark user as finished swiping, send top 3 matches if everyone's finished
    socket.on('finished', async () => {
      try {
        // add user's uid to finished array in filters
        await sendCommand('JSON.ARRAPPEND', [
          socket.user.room,
          'finished',
          JSON.stringify(socket.user.uid),
        ])
        let session = await sendCommand('JSON.GET', [socket.user.room])
        session = JSON.parse(session)
        // if everyone in room is finished swiping, get the top 3 restaurants and emit
        if (session.finished.length >= Object.keys(session.members).length) {
          let top3 = getTop3(session.restaurants)
          if (top3.choices.length > 1) {
            await sendCommand('JSON.SET', [socket.user.room, '.top3', JSON.stringify(top3)])
            io.in(socket.user.room).emit('top 3', top3)
          } else {
            // return match if top3 is only 1 restaurant
            await sendCommand('JSON.SET', [
              socket.user.room,
              '.match',
              JSON.stringify(top3.choices[0]),
            ])
            io.in(socket.user.room).emit('match', top3.choices[0])
          }
        } else {
          io.in(socket.user.room).emit('update', session)
        }
      } catch (err) {
        console.error(err)
      }
    })

    socket.on('to top 3', async () => {
      let session = await sendCommand('JSON.GET', [socket.user.room])
      session = JSON.parse(session)
      let top3 = getTop3(session.restaurants)
      if (top3.choices.length > 1) {
        await sendCommand('JSON.SET', [socket.user.room, '.top3', JSON.stringify(top3)])
        io.in(socket.user.room).emit('top 3', top3)
      } else {
        // return match if top3 is only 1 restaurant
        await sendCommand('JSON.SET', [socket.user.room, '.match', JSON.stringify(top3.choices[0])])
        io.in(socket.user.room).emit('match', top3.choices[0])
      }
    })

    // alert all users to choose random pick
    socket.on('choose', async (data) => {
      try {
        let session = await sendCommand('JSON.GET', [socket.user.room])
        session = JSON.parse(session)
        await sendCommand('JSON.SET', [
          socket.user.room,
          '.match',
          JSON.stringify(session.top3.choices[data.index]),
        ])
        io.in(socket.user.room).emit('choose', data.index)
      } catch (err) {
        socket.emit('exception', 'choose')
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
