import AsyncStorage from '@react-native-async-storage/async-storage'
import { UID } from 'react-native-dotenv'
import axios from 'axios'

var myId = ''

AsyncStorage.getItem(UID).then((res) => {
  myId = res
})

// uncomment when tokens are set up
// var tokenHeaders = {};
// AsyncStorage.multiGet([REFRESH_TOKEN, ACCESS_TOKEN]).then((res) => {
//   tokenHeaders = {
//     'x-access-token': res[0][1],
//     'x-refresh-token': res[1][1]
//   }
// })

const friendsApi = axios.create({
  // baseURL: 'https://wechews.herokuapp.com',
  baseURL: 'http://192.168.0.23:5000',
  
  // uncomment when tokens are set up
  // headers: tokenHeaders
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

const createFriendship = async (uid, friend) => {
  return friendsApi
    .post(`/friendships/${uid}/${friend}`)
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// gets a users friends/requests
const getFriends = async (uid) => {
  return friendsApi
    .get(`/friendships/${uid}`)
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
      Promise.reject(error.response)
    })
}

// accept a friend request
const acceptFriendRequest = async (uid, friend) => {
  return friendsApi
    .put(`/friendships/${uid}/${friend}`)
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// remove a friendship
const removeFriendship = async (uid, friend) => {
  return friendsApi
    .delete(`/friendships/${uid}/${friend}`)
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
