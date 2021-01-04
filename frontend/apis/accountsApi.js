import { ID_TOKEN } from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

var token = ''

AsyncStorage.getItem(ID_TOKEN).then((res) => {
  token
})

const accountsApi = axios.create({
  // baseURL: 'https://wechews.herokuapp.com',
  baseURL: 'http://192.168.0.23:5000',
  
  // uncomment when tokens are set up
  // headers: tokenHeaders
})

// creates user
const createFBUser = async (name, username, email, photo, phone) => {
  return accountsApi
    .post('/accounts', {
      name: name,
      username: username,
      email: email,
      photo: photo,
      phone_number: phone
    })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// gets list of users
const getAllUsers = async () => {
  return accountsApi
    .get('/accounts')
    .then((res) => {
      return {
        status: res.status,
        userList: res.data.users.map(function (users) {
          // returns individual user info
          return {
            name: users.name,
            username: users.username,
            photo: users.photo,
            uid: users.uid,
          }
        }),
      }
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// gets first 100 account usernames/names starting with text input
const searchUsers = async (text) => {
  return accountsApi
    .get(`/accounts/search/${text}`)
    .then((res) => {
      return {
        count: res.data.users.count,
        userList: res.data.users.rows.map(function (users) {
          // returns individual user info
          return {
            name: users.name,
            username: users.username,
            photo: users.photo,
            uid: users.uid,
          }
        }),
      }
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// deletes user and returns status
const deleteUser = async () => {
  return accountsApi
    .delete(`/accounts`)
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// gets user and returns user info
const getUser = async () => {
  return accountsApi
    .get(`/accounts`)
    .then((res) => {
      return {
        username: res.data.user.username,
        email: res.data.user.email,
        phone_number: res.data.user.phone_number,
        name: res.data.user.name,
        photo: res.data.user.photo,
      }
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// update email and returns status
const updateEmail = async (info) => {
  const req = {
    email: info,
  }
  return updateUser(req)
}

// update username and returns status
const updateUsername = async (info) => {
  const req = {
    username: info,
  }
  return updateUser(req)
}

// update username and returns status
const updateName = async (info) => {
  const req = {
    name: info,
  }
  return updateUser(req)
}

// update username and returns status
const updatePhoneNumber = async (info) => {
  const req = {
    phone_number: info,
  }
  return updateUser(req)
}

const updatePhoto = async (id, info) => {
  const req = {
    photo: info,
  }
  return updateUser(id, req)
}

// updates user and returns status
const updateUser = async (req) => {
  return accountsApi
    .put(`/accounts/`, req)
    .then((res) => {
      return {
        status: res.status,
      }
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// checks username and returns status
const checkUsername = async (username) => {
  return accountsApi
    .get(`/username/${username}`)
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// checks phone number and returns status
const checkPhoneNumber = async (phoneNumber) => {
  return accountsApi
    .get(`/phoneNumber/${phoneNumber}`)
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// checks email and returns status
const checkEmail = async (email) => {
  return accountsApi
    .get(`/email/${email}`)
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

export default {
  createFBUser,
  getAllUsers,
  deleteUser,
  getUser,
  updateEmail,
  updateUsername,
  updateName,
  updatePhoneNumber,
  checkUsername,
  checkPhoneNumber,
  searchUsers,
  checkEmail,
}
