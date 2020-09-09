import axios from 'axios'
import {API_KEY} from 'react-native-dotenv'

const accountsApi = axios.create({
  baseURL: 'https://wechews.herokuapp.com',
})

//creates friendship
const createFriendship = (main_user, friend_user) => {
    return accountsApi
    .post('/friendships', {
      params: {
        main_user: main_user,
        friend_user: friend_user
      },
    })
    .then (res => {
      // console.log(res.data.users.id);
      // return {
      //   id: res.data.users.id,
      //   status: res.status
      // }
    })
    .catch(error => console.log(error.message))
  }
  
//gets a users friends
  const getFriends = (main_user) => {
    return accountsApi
    .get('/friendships/${username}/friends', {
      params: {
        main_user: main_user,
      },
    })
    .then (res => {
      // console.log(res.data.users.id);
      // return {
      //   id: res.data.users.id,
      //   status: res.status
      // }
    })
    .catch(error => console.log(error.message))
  }

//gets a users friend requests
  const getRequests = (main_user) => {
    return accountsApi
    .get('/friendships/${username}/requests', {
      params: {
        main_user: main_user,
      },
    })
    .then (res => {
      // console.log(res.data.users.id);
      // return {
      //   id: res.data.users.id,
      //   status: res.status
      // }
    })
    .catch(error => console.log(error.message))
  }

//accept a friend request
  const acceptFriendRequest = (main_user) => {
    return accountsApi
    .put('/friendships/${username}/requests', {
      params: {
        main_user: main_user,
        friend_user: friend_user
      },
    })
    .then (res => {
      // console.log(res.data.users.id);
      // return {
      //   id: res.data.users.id,
      //   status: res.status
      // }
    })
    .catch(error => console.log(error.message))
  }

//deny a friend request
  const denyFriendRequest = (main_user) => {
    return accountsApi
    .delete('/friendships/${username}/requests', {
      params: {
        main_user: main_user,
        friend_user: friend_user
      },
    })
    .then (res => {
      // console.log(res.data.users.id);
      // return {
      //   id: res.data.users.id,
      //   status: res.status
      // }
    })
    .catch(error => console.log(error.message))
  }

//remove a friendship
  const removeFriend = (main_user,friend_user) => {
    return accountsApi
    .delete('/friendships/${main_user}/${friend_user}', {
      params: {
        main_user: main_user,
        friend_user: friend_user
      },
    })
    .then (res => {
      // console.log(res.data.users.id);
      // return {
      //   id: res.data.users.id,
      //   status: res.status
      // }
    })
    .catch(error => console.log(error.message))
  }