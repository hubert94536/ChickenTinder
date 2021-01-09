import Axios from 'axios'
import Firebase from 'firebase'

const notificationsApi = Axios.create({
  // baseURL: 'https://wechews.herokuapp.com',
  baseURL: 'http://172.16.0.10:5000',
})

// Set the AUTH token for any request
notificationsApi.interceptors.request.use(async function (config) {
  const token = await Firebase.auth().currentUser.getIdToken()
  config.headers.authorization = token ? `Bearer ${token}` : ''
  return config
})

// gets a users friends/requests
const getNotifs = async () => {
  return notificationsApi
    .get(`/notifications`)
    .then((res) => {
      return {
        status: res.status,
        notifs: res.data.notifs.map(function (notif) {
          // returns individual user info
          return {
            id: notif.id,
            type: notif.type,
            updatedAt: notif.updatedAt,
            sender: notif.sender_uid,
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
    .delete(`/notifications`, {
      id: id,
    })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

export default {
  getNotifs,
  removeNotif,
}
