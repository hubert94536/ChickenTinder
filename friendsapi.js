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
      return {
        f_id: res.data.user.f_id,
        status: res.status
      }
    })
    .catch(error => {
      return Promise.reject(new Error(error))
    })
  }
  
//gets a users friends
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
            id: friends.f_id
          }
        })
      }
    })
    .catch(error => {
      return Promise.reject(new Error(error))
    })
  }

//gets a users friend requests
const getRequests = (main) => {
    return friendsApi
    .get(`/friendships/requests/${main}`)
    .then(res => {
      console.log(res.data.requests)
      return {
        status: res.status,
        userList: res.data.requests.map(function (friends) {
          // returns individual user info
          return {
            id: friends.f_id
          }
        })
      }
    })
    .catch(error => {
      return Promise.reject(new Error(error))
    })
  }

//accept a friend request
const acceptFriendRequest = (main, friend) => {
    return friendsApi
    .put(`/friendships/requests/${main}/${friend}`, {
      params: {
        accepted: 'accepted'
      },
    })
    .then (res => {
      console.log(res.data.user)
      return {
        f_id: res.data.user.f_id,
        f_status: res.data.user.f_id.f_status,
        status: res.status
      }
    })
    .catch(error => {
      return Promise.reject(new Error(error))
    })
  }

//deny a friend request
  const denyFriendRequest = (main, friend) => {
    return friendsApi
    .delete(`/friendships/requests/${main}/${friend}`)
    .then(res => {
      console.log(res.status)
      return res.status
    })
    .catch(error => {
      return Promise.reject(new Error(error))
    })
  }

//remove a friendship
  const removeFriend = (main, friend) => {
    return friendsApi
    .delete(`/friendships/friends/${main}/${friend}`)
    .then(res => {
      console.log(res.status)
      return res.status
    })
    .catch(error => {
      return Promise.reject(new Error(error))
    })
  }

  export default {
    createFriendship,
    getFriends,
    getRequests,
    acceptFriendRequest,
    denyFriendRequest,
    removeFriend
  }