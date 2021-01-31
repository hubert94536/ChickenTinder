import Axios from 'axios'
import Firebase from 'firebase'

const friendsApi = Axios.create({
  baseURL: 'https://wechews.herokuapp.com',
  // baseURL: 'http://192.168.0.23:5000',
})
// Set the AUTH token for any request
friendsApi.interceptors.request.use(async function (config) {
  const token = await Firebase.auth().currentUser.getIdToken()
  config.headers.authorization = token ? `Bearer ${token}` : ''
  return config
})

// creates friendship
const createFriendshipTest = async (main, friend) => {
  return friendsApi
    .post(`/test/friendships`, {
      uid: main,
      friend: friend,
    })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      return Promise.reject(error.response)
    })
}

const createFriendship = async (friend) => {
  return friendsApi
    .post(`/friendships`, { friend: friend })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      return Promise.reject(error.response)
    })
}

// gets a users friends/requests
const getFriends = async () => {
  return friendsApi
    .get(`/friendships`)
    .then((res) => {
      return {
        status: res.status,
        friendList: res.data.friends.map(function (friends) {
          // returns individual user info
          return {
            uid: friends.friend_uid,
            name: friends.account.name,
            photo: friends.account.photo,
            username: friends.account.username,
            status: friends.status,
          }
        }),
      }
    })
    .catch((error) => {
      return Promise.reject(error.response)
    })
}

// accept a friend request
const acceptFriendRequest = async (friend) => {
  return friendsApi
    .put(`/friendships`, { friend: friend })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      return Promise.reject(error.response)
    })
}

// remove a friendship
const removeFriendship = async (friend) => {
  return friendsApi
    .delete(`/friendships`, { data: { friend: friend } })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      return Promise.reject(error.response)
    })
}

export default {
  createFriendship,
  createFriendshipTest,
  getFriends,
  acceptFriendRequest,
  removeFriendship,
}
