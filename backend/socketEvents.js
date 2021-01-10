const { hdel, hgetAll, sendCommand } = require('./config.js')
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
  io.on('connection', async (socket) => {
    // disconnects user and removes them if in room
    socket.on('disconnect', async () => {
      try {
        // delete old socket id
        if (socket.user) {
          await hdel(`users:${socket.user.uid}`, 'client')
          if (socket.user.room) {
            // retrieve session information
            let session = await sendCommand('JSON.GET', [socket.user.room])
            session = JSON.parse(session)
            // check if user was in a room and room still active
            if (session) {
              socket.leave(socket.user.room)
              delete session.members[socket.user.uid]
              // delete room and its filters if this is last member in room
              if (Object.keys(session.members).length === 0) {
                await sendCommand('JSON.DEL', [socket.user.room])
                await sendCommand('JSON.DEL', [`filters:${socket.user.room}`])
              }
              // update session with removed user and reduce majority in filters
              else {
                await sendCommand('JSON.DEL', [socket.user.room, `.members['${socket.user.uid}']`])
                // retreive a session's filters
                let filters = await sendCommand('JSON.GET', [`filters:${socket.user.room}`])
                filters = JSON.parse(filters)
                // check if the room is in a round (majority is only set when round starts)
                if (filters.majority) {
                  // reduce majority and group size by 1
                  filters.majority -= 1
                  filters.groupSize -= 1
                  await sendCommand('JSON.NUMINCRBY', [
                    `filters:${socket.user.room}`,
                    '.majority',
                    -1,
                  ])
                  await sendCommand('JSON.NUMINCRBY', [
                    `filters:${socket.user.room}`,
                    '.groupSize',
                    -1,
                  ])
                  // delete user from finished list if finished
                  let index = filters.finished.indexOf(socket.user.uid)
                  if (index >= 0) {
                    delete filters.finished[index]
                  }
                  // if the removed user was last person to finish, get top 3 restaurants and emit
                  if (filters.finished.length === filters.groupSize) {
                    let top3 = getTop3(filters.restaurants)
                    io.in(socket.user.room).emit('final', top3)
                  }
                } else {
                  // Room is still in groups page and receives updated room
                  io.in(socket.user.room).emit('update', session)
                }
              }
            }
            delete socket.user.room
          }
        }
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // creates session and return session info to host
    socket.on('create', async () => {
      try {
        let host = socket.user.uid
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
        socket.join(code)
        socket.emit('update', session)
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // send invite with host info to join a room
    socket.on('invite', async (data) => {
      try {
        // create request body
        let req = {}
        req.body = {}
        req.body.receiver_uid = data.receiver_uid
        req.body.type = 'invite'
        req.body.content = data.code
        req.body.sender_uid = socket.user.uid
        await notifs.createNotif(req)
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
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
        await sendCommand('JSON.STRAPPEND', [
          `filters:${data.code}`,
          'categories',
          JSON.stringify(data.categories),
        ])
        // update member who submitted filters
        await sendCommand('JSON.SET', [data.code, `.members['${socket.user.uid}'].filters`, true])
        // retrieve session info
        let session = await sendCommand('JSON.GET', [data.code])
        session = JSON.parse(session)
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
        if (filters.categories.endsWith(',')) {
          filters.categories = filters.categories.slice(0, -1)
        }
        filters.categories = Array.from(new Set(filters.categories.split(','))).toString()
        const resList = await yelp.getRestaurants(filters)
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
        // increment restaurant count
        await sendCommand('JSON.NUMINCRBY', [
          `filters:${data.code}`,
          `.restaurants['${data.resId}']`,
          1,
        ])
        let filters = await sendCommand('JSON.GET', [`filters:${data.code}`])
        filters = JSON.parse(filters)
        // check if # likes = majority => match
        if (filters.restaurants[data.resId] === filters.majority) {
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
        // delete room associated to the user's socket id
        delete socket.user.room
        // retrieve session information
        let session = await sendCommand('JSON.GET', [data.code])
        session = JSON.parse(session)
        delete session.members[socket.user.uid]
        // delete room and its filters if last member in room
        if (Object.keys(session.members).length === 0) {
          sendCommand('JSON.DEL', [data.code])
          sendCommand('JSON.DEL', [`filters:${data.code}`])
        } else {
          await sendCommand('JSON.DEL', [data.code, `.members['${socket.user.uid}']`])
          // retreive a session's filters
          let filters = await sendCommand('JSON.GET', [`filters:${data.code}`])
          filters = JSON.parse(filters)
          // check if the room is in a round (majority is only set when round starts)
          if (filters.majority) {
            // reduce majority and group size by 1
            filters.majority -= 1
            filters.groupSize -= 1
            await sendCommand('JSON.NUMINCRBY', [`filters:${data.code}`, '.majority', -1])
            await sendCommand('JSON.NUMINCRBY', [`filters:${data.code}`, '.groupSize', -1])
            // delete user from finished list if finished
            let index = filters.finished.indexOf(socket.user.uid)
            if (index >= 0) {
              delete filters.finished[index]
            }
            // if the removed user was last person to finish, get top 3 restaurants and emit
            if (filters.finished.length === filters.groupSize) {
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
        // get socket id associated to user uid
        let user = await hgetAll(`users:${data.uid}`)
        io.to(user.client).emit('kick')
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // lets server know user is done swiping, send top 3 matches if everyone's finished
    socket.on('finished', async (data) => {
      try {
        // add user's uid to finished array in filters
        await sendCommand('JSON.ARRAPPEND', [
          `filters:${data.code}`,
          'finished',
          JSON.stringify(socket.user.uid),
        ])
        let filters = await sendCommand('JSON.GET', [`filters:${data.code}`])
        filters = JSON.parse(filters)
        // if everyone in room is finished swiping, get the top 3 restaurants and emit
        if (filters.finished.length === filters.groupSize) {
          let top3 = getTop3(filters.restaurants)
          io.in(data.code).emit('top 3', top3)
        }
      } catch (err) {
        socket.emit('exception', err.toString())
        console.log(err)
      }
    })

    // alert all users to choose random pick
    socket.on('choose', (data) => {
      io.in(data.code).emit('choose', data.index)
    })

    // alert all users to leave
    socket.on('end', (data) => {
      io.in(data.code).emit('kick')
    })
  })
}
