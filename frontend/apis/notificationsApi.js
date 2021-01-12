import AsyncStorage from '@react-native-async-storage/async-storage'
import { ID } from 'react-native-dotenv'
import axios from 'axios'

var myId = ''

AsyncStorage.getItem(ID).then((res) => {
  myId = res
})

const notificationsApi = axios.create({
  baseURL: 'https://wechews.herokuapp.com',
  // baseURL: 'http://172.16.0.10:5000'
})

// gets a users friends/requests
const getNotifs = async () => {
  return notificationsApi
    .get(`/notifications/user/${myId}`)
    .then((res) => {
      return {
        status: res.status,
        notifs: res.data.notifs.map(function (notif) {
          // returns individual user info
          return {
            id: notif.id,
            type: notif.type,
            updatedAt: notif.updatedAt,
            sender: notif.sender_id,
            senderUsername: notif.account.username,
            senderPhoto: notif.account.photo,
            senderName: notif.account.name,
          }
        }),
      }
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// remove a notification
const removeNotif = async (id) => {
  return notificationsApi
    .delete(`/notifications/${id}`)
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// link a user to a notification token
const linkToken = async (id, token) => {
  return notificationsApi
    .post('/notifications/token', {id: id, token: token})
    .then((res) => {
      console.log("Token linked")
      return res.status
    })
    .catch((error) => {
      console.log("-----ERROR linking token")
      Promise.reject(error.response)
    })
}

// unlink a user from a notification token
const unlinkToken = async (id) => {
  return notificationsApi
    .delete('/notifications/token', {id: id})
    .then((res) => {
      console.log("Token unlinked")
      return res.status
    })
    .catch((error) => {
      console.log("-----ERROR unlinking token")
      Promise.reject(error.response)
    })
}

export default {
  getNotifs,
  removeNotif,
  linkToken,
  unlinkToken
}
