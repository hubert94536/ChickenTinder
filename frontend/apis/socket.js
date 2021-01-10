import Firebase from 'firebase'
import io from 'socket.io-client'

var socket = null

const connect = () => {
  // socket = io('http://192.168.0.23:5000')
  socket = io('https://wechews.herokuapp.com')
  socket.on('connect', async () => {
    console.log('connect')
    const token = await Firebase.auth().currentUser.getIdToken()
    socket.emit('authentication', { token: token })
  })
  socket.on('unauthorized', (reason) => {
    console.log('Unauthorized:', reason)
    socket.disconnect()
  })
  socket.on('disconnect', (reason) => {
    console.log('Disconnect:', reason)
  })
}

const createRoom = () => {
  socket.emit('create')
}

// sends invite to an uid
const sendInvite = (receiver, code) => {
  socket.emit('invite', {
    receiver: receiver,
    code: code,
  })
}

const joinRoom = (code) => {
  socket.emit('join', {
    code: code,
  })
}

const leaveRoom = (code) => {
  socket.emit('leave', {
    code: code,
  })
}

const kickUser = (uid) => {
  socket.emit('kick', { uid: uid })
}

// host starts a session
// filters needs: radius, group size, majority, location or latitude/longitude
// filters options: price, open_at, categories, limit
const startSession = (code, filters) => {
  socket.emit('start', { code: code, filters: filters })
}

// submit categories array (append a ',' at end)
const submitFilters = (code, categories) => {
  socket.emit('submit', {
    code: code,
    categories: categories,
  })
}

// pass restaurant id for a like
const likeRestaurant = (code, resId) => {
  socket.emit('like', { code: code, resId: resId })
}

// let everyone know you are done swiping
const finishedRound = (code) => {
  socket.emit('finished', { code: code })
}

// send chosen restaurant
const choose = (code, index) => {
  socket.emit('choose', { code: code, index: index })
}

// end session
const endRound = (code) => {
  socket.emit('end', { code: code })
}

const getSocket = () => {
  return socket
}

export default {
  connect,
  createRoom,
  joinRoom,
  sendInvite,
  finishedRound,
  leaveRoom,
  kickUser,
  startSession,
  submitFilters,
  likeRestaurant,
  getSocket,
  choose,
  endRound,
}
