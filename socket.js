import io from 'socket.io-client'
import AsyncStorage from '@react-native-community/async-storage'
import { USERNAME, NAME, PHOTO } from 'react-native-dotenv'

var myUsername = ''
var myPic = ''
var myName = ''
var socket = null

AsyncStorage.multiGet([USERNAME, NAME, PHOTO]).then((res) => {
  myUsername = res[0][1]
  myName = res[1][1]
  myPic = res[2][1]
})

const connect = () => {
  socket = io('https://wechews.herokuapp.com', {
    query: `username=${myUsername}`,
  })
}

const createRoom = () => {
  socket.emit('createRoom', { host: myUsername, pic: myPic, name: myName })
}

const sendInvite = (username) => {
  socket.emit('invite', { username: username, host: myUsername })
}

const declineInvite = (room) => {
  socket.emit('decline', { username: myUsername, room: room })
}

const joinRoom = (room) => {
  socket.emit('joinRoom', { username: myUsername, pic: myPic, room: room, name: myName })
}

const leaveRoom = (room) => {
  socket.emit('leave', { username: myUsername, room: room })
}

const kickUser = (username) => {
  socket.emit('kick', { username: username, room: myUsername })
}

const endSession = () => {
  socket.emit('end', { room: myUsername })
}

const startSession = () => {
  socket.emit('start', { room: myUsername })
}

// past filters object & room username
const submitFilters = (filters, room) => {
  socket.emit('submitFilters', { username: myUsername, filters: filters, room: room })
}

// pass restaurant id
const likeRestaurant = (room, restaurant) => {
  socket.emit('like', { room: room, restaurant: restaurant })
}

const getSocket = () => {
  return socket
}

export default {
  connect,
  createRoom,
  joinRoom,
  sendInvite,
  declineInvite,
  leaveRoom,
  kickUser,
  startSession,
  endSession,
  submitFilters,
  likeRestaurant,
  getSocket,
}
