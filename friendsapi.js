import axios from 'axios'
import {API_KEY} from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage'

const friendsApi = axios.create({
  baseURL: 'https://wechews.herokuapp.com',
})

//creates friendship
const createFriendship = (mainUser, friendUser) => {
    return friendsApi
    .post(`/friendships`, {
      params: {
        main_user: mainUser,
        friend_user: friendUser
      },
    })
    .then (res => {
      console.log(res.data.user)
      return {
        friend_user: res.data.user.friend_user,
        status: res.status
      }
    })
    .catch(error => {
      return Promise.reject(new Error(error))
    })
  }
  
//gets a users friends
const getFriends = (main_user) => {
    return friendsApi
    .get(`/friendships/${main_user}/friends`, {
      params: {
        main_user: main_user,
      },
    })
    .then(res => {
      console.log(res.data.friends)
      return {
        status: res.status,
        friendList: res.data.friends.map(function (friends) {
          // returns individual user info
          return {
            username: friends.friend_user
          }
        })
      }
    })
    .catch(error => {
      return Promise.reject(new Error(error))
    })
  }

//gets a users friend requests
const getRequests = (main_user) => {
    return friendsApi
    .get(`/friendships/${main_user}/requests`, {
      params: {
        main_user: main_user,
      },
    })
    .then(res => {
      console.log(res.data.requests)
      return {
        status: res.status,
        userList: res.data.requests.map(function (friends) {
          // returns individual user info
          return {
            username: friends.friend_user
          }
        })
      }
    })
    .catch(error => {
      return Promise.reject(new Error(error))
    })
  }

//accept a friend request
const acceptFriendRequest = (main_user, friend_user) => {
    return friendsApi
    .put(`/friendships/${main_user}/requests`, {
      params: {
        main_user: main_user,
        friend_user: friend_user
      },
    })
    .then (res => {
      console.log(res.data.user)
      return {
        friend_user: res.data.user.friend_user,
        f_status: res.data.user.friend_user.f_status,
        status: res.status
      }
    })
    .catch(error => {
      return Promise.reject(new Error(error))
    })
  }

//deny a friend request
  const denyFriendRequest = (main_user, friend_user) => {
    return friendsApi
    .delete(`/friendships/${main_user}/requests`, {
      params: {
        main_user: main_user,
        friend_user: friend_user
      },
    })
    .then(res => {
      console.log(res.status)
      return res.status
    })
    .catch(error => {
      return Promise.reject(new Error(error))
    })
  }

//remove a friendship
  const removeFriend = (main_user,friend_user) => {
    return friendsApi
    .delete(`/friendships/${main_user}/friends`, {
      params: {
        main_user: main_user,
        friend_user: friend_user
      },
    })
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