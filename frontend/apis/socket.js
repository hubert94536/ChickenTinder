import io from 'socket.io-client'

var myId = ''
var myName = ''
var myPhoto = ''
var myUsername = ''
var socket = null

const connect = (id, name, photo, username) => {
  myId = id
  myName = name
  myPhoto = photo
  myUsername = username
  socket = io('https://wechews.herokuapp.com', {
    query: `id=${myId}`,
  })
}
// uncomment below if testing on local server
/* const connect = () => {
   socket = io('http://172.16.0.10:5000', {
     query: `username=${myUsername}`,
   })
} */

const createRoom = () => {
  socket.emit('create', {
    id: myId,
    name: myName,
    username: myUsername,
    photo: myPhoto,
  })
}

// sends invite to an id
const sendInvite = (receiver, code) => {
  socket.emit('invite', {
    id: myId,
    name: myName,
    username: myUsername,
    photo: myPhoto,
    receiver: receiver,
    code: code,
  })
}

const joinRoom = (code) => {
  socket.emit('join', {
    id: myId,
    name: myName,
    username: myUsername,
    photo: myPhoto,
    code: code,
  })
}

const leaveRoom = (code) => {
  socket.emit('leave', {
    code: code,
    id: myId,
  })
}

const kickUser = (id) => {
  socket.emit('kick', { id: id })
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
    id: myId,
  })
}

// pass restaurant id for a like
const likeRestaurant = (code, resId) => {
  socket.emit('like', { code: code, resId: resId })
}

// let everyone know you are done swiping
const finishedRound = (code) => {
  socket.emit('finished', { code: code, id: myId })
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
