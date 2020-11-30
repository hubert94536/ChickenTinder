import { USERNAME, NAME, PHOTO, ID } from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage'
import io from 'socket.io-client'

var myUsername = ''
var myPhoto = ''
var myName = ''
var myId = ''
var socket = null

AsyncStorage.multiGet([USERNAME, NAME, PHOTO, ID]).then((res) => {
  myUsername = res[0][1]
  myName = res[1][1]
  myPhoto = res[2][1]
  myId = res[3][1]
})

const connect = () => {
  socket = io('https://wechews.herokuapp.com', {
    query: `id=${myId}`,
  })
}
// uncomment below if testing on local server
/* const connect = () => {
   socket = io('http://192.168.0.23:5000', {
     query: `username=${myUsername}`,
   })
} */

const createRoom = () => {
  socket.emit('createRoom', {
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
  socket.emit('joinRoom', {
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

// ends session after receiving match
const endSession = (code) => {
  socket.emit('end', { code: code })
}

// host starts a session
// filters needs: radius, group size, majority, location or latitude/longitude
// filters options: price, open_at, categories, limit
const startSession = (code, filters) => {
  socket.emit('start', { code: code, filters: filters })
}

// submit categories array (append a ',' at end)
const submitFilters = (code, categories) => {
  socket.emit('submitFilters', {
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
  socket.emit('final', { code: code, id: myId })
}

// randomize the restaurant chosen
const randomize = (code) => {
  socket.emit('choose', { code: code })
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
  endSession,
  submitFilters,
  likeRestaurant,
  getSocket,
  randomize
}
