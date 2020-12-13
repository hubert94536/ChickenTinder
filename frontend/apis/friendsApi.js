import axios from 'axios'

const friendsApi = axios.create({
  baseURL: 'https://wechews.herokuapp.com',
  // baseURL: 'http://172.16.0.10:5000'
})

// creates friendship
const createFriendshipTest = async (main, friend) => {
  return friendsApi
    .post('/friendships', {
      params: {
        main: main,
        friend: friend,
      },
    })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      throw error.response.status
    })
}

const createFriendship = async (id, friend) => {
  return friendsApi
    .post('/friendships', {
      params: {
        main: id,
        friend: friend,
      },
    })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      throw error.response.status
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
      throw error.response.status
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
      throw error.response.status
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
      throw error.response.status
    })
}

export default {
  createFriendship,
  createFriendshipTest,
  getFriends,
  acceptFriendRequest,
  removeFriendship,
}
