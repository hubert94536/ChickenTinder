import auth from '@react-native-firebase/auth'
import io from 'socket.io-client'

var socket = null

const connect = () => {
  // socket = io('http://192.168.0.23:5000')
  socket = io('https://wechews.herokuapp.com')
  socket.on('connect', async () => {
    console.log('connect')
    const token = await auth().currentUser.getIdToken()
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
  // intialize session info
  let session = {}
  session.join = true
  session.members = {}
  session.filters = {}
  session.filters.categories = ''
  session.match = ''
  socket.emit('create', {
    session: session,
  })
}

// sends invite to an uid
const sendInvite = (receiver) => {
  socket.emit('invite', {
    uid: receiver,
  })
}

const joinRoom = (code) => {
  // initialize member object
  let member = {}
  member.filters = false
  member.connected = true
  socket.emit('join', {
    code: code,
    member: member,
  })
}
// leaving a session
const leave = (stage) => {
  socket.emit('leave', { stage: stage })
}

const kickUser = (uid) => {
  socket.emit('kick', { uid: uid })
}

// host starts a session
// filters needs: radius, group size, majority, location or latitude/longitude
// filters options: price, open_at, categories, limit
const startSession = (filters, session) => {
  // set filters for yelp querying from host filters
  if (filters.price) {
    session.filters.price = filters.price
  }
  if (filters.open_at) {
    session.filters.open_at = filters.open_at
  }
  session.filters.radius = filters.radius
  if (filters.location) {
    session.filters.location = filters.location
  } else {
    session.filters.latitude = filters.latitude
    session.filters.longitude = filters.longitude
  }
  if (filters.limit) {
    session.filters.limit = filters.limit
  }
  session.filters.categories += filters.categories
  if (session.filters.categories.endsWith(',')) {
    session.filters.categories = session.filters.categories.slice(0, -1)
  }
  // keep temporary categories in case no restaurants returned
  session.tempCategories = session.filters.categories
  session.filters.categories = Array.from(new Set(session.filters.categories.split(','))).toString()
  session.majority = filters.majority
  session.finished = [] // keep track of who's finished swiping
  session.restaurants = {} // keep track of restaurant likes
  socket.emit('start', { session: session })
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

const dislikeRestaurant = (resId) => {
  socket.emit('dislike', { resId: resId })
}

// let everyone know you are done swiping
const finishedRound = () => {
  socket.emit('finished')
}

// send chosen restaurant
const choose = (index) => {
  socket.emit('choose', { index: index })
}

// update user's socket info (name, username, photo)
const updateUser = (dataObj) => {
  socket.emit('update', dataObj)
}

// host manually takes everyone to top3
const toTop3 = () => {
  socket.emit('to top 3')
}

const getSocket = () => {
  return socket
}

export default {
  choose,
  connect,
  createRoom,
  dislikeRestaurant,
  leave,
  finishedRound,
  getSocket,
  joinRoom,
  kickUser,
  likeRestaurant,
  sendInvite,
  startSession,
  submitFilters,
  updateUser,
  toTop3,
}
