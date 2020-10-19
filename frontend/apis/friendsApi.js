import AsyncStorage from '@react-native-community/async-storage'
import { ID } from 'react-native-dotenv'
import axios from 'axios'

var myId = ''

AsyncStorage.getItem(ID).then((res) => {
  myId = res
})

const friendsApi = axios.create({
  baseURL: 'https://wechews.herokuapp.com',
  // baseURL: 'http://192.168.0.23:5000'
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

const createFriendship = async (friend) => {
  return friendsApi
    .post('/friendships', {
      params: {
        main: myId,
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
const getFriends = async () => {
  return friendsApi
    .get(`/friendships/friends/${myId}`)
    .then((res) => {
      return {
        status: res.status,
        friendList: res.data.friends.map(function (friends) {
          // returns individual user info
          return {
            id: friends.f_id,
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
const acceptFriendRequest = async (friend) => {
  return friendsApi
    .put(`/friendships/friends/${myId}/${friend}`)
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      throw error.response.status
    })
}

// remove a friendship
const removeFriendship = async (friend) => {
  return friendsApi
    .delete(`/friendships/friends/${myId}/${friend}`)
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
