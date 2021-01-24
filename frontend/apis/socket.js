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

// leaving during swiping round
const leaveRound = () => {
  socket.emit('leave round')
}

// leaving while forming a group
const leaveGroup =() => {
  socket.emit('leave group')
}

const kickUser = (uid) => {
  socket.emit('kick', { uid: uid })
}

// host starts a session
// filters needs: radius, group size, majority, location or latitude/longitude
// filters options: price, open_at, categories, limit
const startSession = (filters) => {
  socket.emit('start', { filters: filters })
}

// submit categories array (append a ',' at end)
const submitFilters = (categories) => {
  socket.emit('submit', {
    categories: categories,
  })
}

// pass restaurant id for a like
const likeRestaurant = (resId) => {
  socket.emit('like', { resId: resId })
}

// let everyone know you are done swiping
const finishedRound = () => {
  socket.emit('finished')
}

// send chosen restaurant
const choose = (index) => {
  socket.emit('choose', { index: index })
}

// end session
const endRound = () => {
  socket.emit('end')
}

// leaving a session due to end
const endLeave = () => {
  socket.emit('end leave')
}

// update user's socket info (name, username, photo)
const updateUser = (dataObj) => {
  socket.emit('update', dataObj)
}

const getSocket = () => {
  return socket
}

export default {
  choose,
  connect,
  createRoom,
  endLeave,
  endRound,
  finishedRound,
  getSocket,
  joinRoom,
  kickUser,
  leaveGroup,
  leaveRound,
  likeRestaurant,
  sendInvite,
  startSession,
  submitFilters,
  updateUser,
}
