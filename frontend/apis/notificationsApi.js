import AsyncStorage from '@react-native-community/async-storage'
import { ID } from 'react-native-dotenv'
import axios from 'axios'

var myId = ''

AsyncStorage.getItem(ID).then((res) => {
  myId = res
})

const notificationsApi = axios.create({
  baseURL: 'https://wechews.herokuapp.com',
  //baseURL: 'http://192.168.0.23:5000'
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
              senderName: notif.account.name
            }
          }),
        }
      })
      .catch((error) => {
        throw error.response.status
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
      throw error.response.status
    })
}

export default {
  getNotifs,
  removeNotif,
}