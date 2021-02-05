import Axios from 'axios'
import Firebase from 'firebase'

const accountsApi = Axios.create({
  baseURL: 'https://wechews.herokuapp.com',
  // baseURL: 'http://192.168.0.23:5000',
})

// Set the AUTH token for any request
accountsApi.interceptors.request.use(async function (config) {
  const token = await Firebase.auth().currentUser.getIdToken()
  config.headers.authorization = token ? `Bearer ${token}` : ''
  return config
})

// creates user
const createFBUserTest = async (name, uid, username, email, photo, phone) => {
  return accountsApi
    .post('/test/accounts', {
      uid: uid,
      name: name,
      username: username,
      email: email,
      photo: photo,
      phone_number: phone,
    })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      return Promise.reject(error.response)
    })
}

// creates user
const createFBUser = async (name, username, email, photo) => {
  return accountsApi
    .post('/accounts', {
      name: name,
      username: username,
      email: email,
      photo: photo,
    })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      return Promise.reject(error.response)
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
      return Promise.reject(error.response)
    })
}

// gets first 100 account usernames/names starting with text input
const searchUsers = async (text) => {
  return accountsApi
    .post(`/accounts/search`, {
      text: text,
    })
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
      return Promise.reject(error.response)
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
      return Promise.reject(error.response)
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
        uid: res.data.user.uid,
      }
    })
    .catch((error) => {
      return Promise.reject(error.response)
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
    .put(`/accounts`, req)
    .then((res) => {
      return {
        status: res.status,
      }
    })
    .catch((error) => {
      return Promise.reject(error.response)
    })
}

// checks username and returns status
const checkUsername = async (username) => {
  return accountsApi
    .post(`/username`, {
      username: username,
    })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      return Promise.reject(error.response)
    })
}

// checks phone number and returns status
const checkPhoneNumber = async (phoneNumber) => {
  return accountsApi
    .post(`/phone_number`, {
      phone_number: phoneNumber,
    })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      return Promise.reject(error.response)
    })
}

// checks email and returns status
const checkEmail = async (email) => {
  return accountsApi
    .post(`/email`, {
      email: email,
    })
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      return Promise.reject(error.response)
    })
}

export default {
  checkEmail,
  checkPhoneNumber,
  checkUsername,
  createFBUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateEmail,
  updateName,
  updatePhoto,
  updatePhoneNumber,
  updateUsername,
  searchUsers,
  createFBUserTest,
}
