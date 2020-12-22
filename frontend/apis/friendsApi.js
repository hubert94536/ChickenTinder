import axios from 'axios'

const friendsApi = axios.create({
  baseURL: 'https://wechews.herokuapp.com',
  // baseURL: 'http://172.16.0.10:5000'
})

// creates friendship
const createFriendshipTest = async (main, friend) => {
  return friendsApi
    .post('/friendships', {
      main: main,
      friend: friend,
    })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

const createFriendship = async (id, friend) => {
  return friendsApi
    .post('/friendships', {
      main: id,
      friend: friend,
    })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// gets a users friends/requests
const getFriends = async (id) => {
  return friendsApi
    .get(`/friendships/${id}`)
    .then((res) => {
      return {
        status: res.status,
        friendList: res.data.friends.map(function (friends) {
          // returns individual user info
          return {
            id: friends.friend_id,
            name: friends.account.name,
            photo: friends.account.photo,
            username: friends.account.username,
            status: friends.status,
          }
        }),
      }
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// accept a friend request
const acceptFriendRequest = async (id, friend) => {
  return friendsApi
    .put(`/friendships/${id}/${friend}`)
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// remove a friendship
const removeFriendship = async (id, friend) => {
  return friendsApi
    .delete(`/friendships/${id}/${friend}`)
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

export default {
  createFriendship,
  createFriendshipTest,
  getFriends,
  acceptFriendRequest,
  removeFriendship,
}
