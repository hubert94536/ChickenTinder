import axios from 'axios'
import {USERNAME} from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage'

var main = ''

AsyncStorage.getItem(USERNAME).then(res => {
  main = res
})

const friendsApi = axios.create({
  baseURL: 'https://wechews.herokuapp.com',
})

//creates friendship
const createFriendship = (main, friend) => {
    return friendsApi
    .post(`/friendships`, {
      params: {
        main: main,
        friend: friend
      },
    })
    .then (res => {
      console.log(res.data.user)
      return res.status;
    })
    .catch(error => {
      throw error.response.status
    })
  }
  
// gets a users friends/requests
const getFriends = (main) => {
    return friendsApi
    .get(`/friendships/friends/${main}`)
    .then(res => {
      console.log(res.data.friends)
      return {
        status: res.status,
        friendList: res.data.friends.map(function (friends) {
          // returns individual user info
          return {
            id: friends.f_id,
          }
        })
      }
    })
    .catch(error => {
      throw error.response.status
    })
  }

//accept a friend request
const acceptFriendRequest = (main, friend) => {
    return friendsApi
    .put(`/friendships/friends/${main}/${friend}`)
    .then (res => {
      return res.status
    })
    .catch(error => {
      throw error.response.status
    })
  }

// remove a friendship
  const removeFriendship = (main, friend) => {
    return friendsApi
    .delete(`/friendships/friends/${main}/${friend}`)
    .then(res => {
      return res.status
    })
    .catch(error => {
      throw error.response.status
    })
  }

  export default {
    createFriendship,
    getFriends,
    acceptFriendRequest,
    removeFriendship
  }