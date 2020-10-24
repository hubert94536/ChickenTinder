/* not sure if this is the way to do it

const accountsApi = require('./index')
const axios = require('axios')

jest.mock('axios')

axios.createFBUser.mockResolvedValue({
    status: 200
})
*/

// creates user and returns id
const createFBUser = async (name, id, username, email, photo) => {
    return 200
}

// gets list of users
const getAllUsers = async () => {
    return {
        status: 200,
        userList: [  // returns individual user info
            {
                name: "John",
                username: "j0hn",
                photo: "photo1",
                id: 1,
            },
            {
                name: "Bobby",
                username: "b0bby",
                photo: "photo2",
                id: 2,
            },
            {
                name: "Caitlin",
                username: "cait1in",
                photo: "photo3",
                id: 3,
            },
            {
                name: "Sasha",
                username: "sa5ha",
                photo: "photo4",
                id: 4,
            },
            {
                name: "Ashley",
                username: "ashl3y",
                photo: "photos5",
                id: 5,
            }
        ]
      }
} 

// gets first 100 account usernames/names starting with text input
// mock function calls 5
const searchUsers = async (text) => {
    return {
        status: 200,
        count: 5,
        userList: [  // returns individual user info
            {
                name: "John",
                username: "j0hn",
                photo: "photo1",
                id: 1,
            },
            {
                name: "Bobby",
                username: "b0bby",
                photo: "photo2",
                id: 2,
            },
            {
                name: "Caitlin",
                username: "cait1in",
                photo: "photo3",
                id: 3,
            },
            {
                name: "Sasha",
                username: "sa5ha",
                photo: "photo4",
                id: 4,
            },
            {
                name: "Ashley",
                username: "ashl3y",
                photo: "photos5",
                id: 5,
            }
        ]
      }
}

// deletes user and returns status
const deleteUser = async () => {
    return 200
}

// gets user by id and returns user info
const getUser = async (id) => {
    return {
        status: 200,
        username: "j0hn",
        email: "j0hn@gmail.com",
        phone_number: 9491234567,
        name: "John",
        photo: "photoJohn",
        id: 1,
      }
}

// update email and returns status
const updateEmail = async (info) => {
    const req = {
        email: "b0bby@gmail.com",
      }
      return updateUser(req)
}

// update username and returns status
const updateUsername = async (info) => {
    const req = {
        username: "b0bby",
      }
      return updateUser(req)
}

// update username and returns status
const updateName = async (info) => {
    const req = {
        name: "Bobby",
      }
      return updateUser(req)
}

// update username and returns status
const updatePhoneNumber = async (info) => {
    const req = {
    phone_number: 8001234567,
  }
  return updateUser(req)
}

// updates user and returns status
const updateUser = async (req) => {
    return 200
}

// checks username and returns status
const checkUsername = async (username) => {
    return 200
}

// checks phone number and returns status
const checkPhoneNumber = async (phoneNumber) => {
    return 200
}


