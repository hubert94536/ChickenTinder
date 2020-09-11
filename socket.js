import io from 'socket.io-client'
import AsyncStorage from '@react-native-community/async-storage'
import { USERNAME, NAME, PHOTO } from 'react-native-dotenv'

var myUsername = ''
var myPic = ''
var myName = ''

AsyncStorage.multiGet([USERNAME, NAME, PHOTO]).then(res => {
  myUsername = res[0][1]
  myName = res[1][1]
  myPic = res[2][2]
})

const socket = io('https://wechews.herokuapp.com', {
  query: `username=${myUsername}`
})

const createRoom = () => {
  try {
    socket.emit('createRoom', { host: myUsername, pic: myPic, name: myName })
  } catch (error) {
    return Promise.reject(new Error(error))
  }
}

const sendInvite = (username) => {
  try {
    socket.emit('invite', { username: username, host: myUsername })
  } catch (error) {
    return Promise.reject(new Error(error))
  }
}

const declineInvite = (room) => {
  try {
    socket.emit('decline', { username: myUsername, room: room })
  } catch (error) {
    return Promise.reject(new Error(error))
  }
}

const joinRoom = (room) => {
  try {
    socket.emit('joinRoom', { username: myUsername, pic: myPic, room: room, name: myName })
  } catch (error) {
    return Promise.reject(new Error(error))
  }
}

const leaveRoom = (room) => {
  try {
    socket.emit('leave', { username: myUsername, room: room })
  } catch (error) {
    return Promise.reject(new Error(error))
  }
}

const kickUser = (user) => {
  try {
    socket.emit('kick', { username: username, room: myUsername })
  } catch (error) {
    return Promise.reject(new Error(error))
  }
}

const endSession = () => {
  try {
    socket.emit('end', { room: myUsername })
  } catch (error) {
    return Promise.reject(new Error(error))
  }
}

const startSession = () => {
  try {
    socket.emit('start', { room: myUsername })
  } catch (error) {
    return Promise.reject(new Error(error))
  }
}

const submitFilters = (filters, room) => {
  try {
    socket.emit('submitFilters', { username: myUsername, filters: filters, room: room })
  } catch (error) {
    return Promise.reject(new Error(error))
  }
}

const likeRestaurant = (room, restaurant) => {
  try {
    socket.emit('like', { room: room, restaurant: restaurant })
  } catch (error) {
    return Promise.reject(new Error(error))
  }
}

const getSocket = () => {
  return socket
}

export default {
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
  getSocket
}
