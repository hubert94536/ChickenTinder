import axios from 'axios'

const accountsApi = axios.create({
  baseURL: 'https://wechews.herokuapp.com',
  // baseURL: 'http://172.16.0.10:5000'
})

// creates user and returns id
const createFBUser = async (name, id, username, email, photo) => {
  return accountsApi
    .post('/accounts', {
      id: id,
      name: name,
      username: username,
      email: email,
      photo: photo,
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
            id: users.id,
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
            id: users.id,
          }
        }),
      }
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// deletes user and returns status
const deleteUser = async (id) => {
  return accountsApi
    .delete(`/accounts/${id}`)
    .then((res) => {
      return res.status
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// gets user by id and returns user info
const getUser = async (id) => {
  return accountsApi
    .get(`/accounts/${id}`)
    .then((res) => {
      return {
        username: res.data.user.username,
        email: res.data.user.email,
        phone_number: res.data.user.phone_number,
        name: res.data.user.name,
        photo: res.data.user.photo,
        id: res.data.user.id,
      }
    })
    .catch((error) => {
      Promise.reject(error.response)
    })
}

// update email and returns status
const updateEmail = async (id, info) => {
  const req = {
    email: info,
  }
  return updateUser(id, req)
}

// update username and returns status
const updateUsername = async (id, info) => {
  const req = {
    username: info,
  }
  return updateUser(id, req)
}

// update username and returns status
const updateName = async (id, info) => {
  const req = {
    name: info,
  }
  return updateUser(id, req)
}

// update username and returns status
const updatePhoneNumber = async (id, info) => {
  const req = {
    phone_number: info,
  }
  return updateUser(id, req)
}

const updatePhoto = async (id, info) => {
  const req = {
    photo: info,
  }
  return updateUser(id, req)
}

// updates user and returns status
const updateUser = async (id, req) => {
  return accountsApi
    .put(`/accounts/${id}`, req)
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
  console.log('check')
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
