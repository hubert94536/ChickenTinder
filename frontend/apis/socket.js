import io from 'socket.io-client'

var myId = ''
var myName = ''
var myPhoto = ''
var myUsername = ''
var socket = null

const connect = (uid, name, photo, username) => {
  myId = uid
  myName = name
  myPhoto = photo
  myUsername = username
  // socket = io('https://wechews.herokuapp.com', {
  //   query: `uid=${myId}`,
  // })
  socket = io('http://192.168.0.23:5000', {
    query: `uid=${myId}`,
  })
}

const createRoom = () => {
  socket.emit('create', {
    uid: myId,
    name: myName,
    username: myUsername,
    photo: myPhoto,
  })
}

// sends invite to an uid
const sendInvite = (receiver, code) => {
  socket.emit('invite', {
    uid: myId,
    name: myName,
    username: myUsername,
    photo: myPhoto,
    receiver: receiver,
    code: code,
  })
}

const joinRoom = (code) => {
  socket.emit('join', {
    uid: myId,
    name: myName,
    username: myUsername,
    photo: myPhoto,
    code: code,
  })
}

const leaveRoom = (code) => {
  socket.emit('leave', {
    code: code,
    uid: myId,
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
    uid: myId,
  })
}

// pass restaurant id for a like
const likeRestaurant = (code, resId) => {
  socket.emit('like', { code: code, resId: resId })
}

// let everyone know you are done swiping
const finishedRound = (code) => {
  socket.emit('finished', { code: code, uid: myId })
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
