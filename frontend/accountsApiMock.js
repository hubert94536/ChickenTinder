import { ID } from 'react-native-dotenv'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

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
                id: "1",
            },
            {
                name: "Bobby",
                username: "b0bby",
                photo: "photo2",
                id: "2",
            },
            {
                name: "Caitlin",
                username: "cait1in",
                photo: "photo3",
                id: "3",
            },
            {
                name: "Sasha",
                username: "sa5ha",
                photo: "photo4",
                id: "4",
            },
            {
                name: "Ashley",
                username: "ashl3y",
                photo: "photos5",
                id: "5",
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
                id: "1",
            },
            {
                name: "Bobby",
                username: "b0bby",
                photo: "photo2",
                id: "2",
            },
            {
                name: "Caitlin",
                username: "cait1in",
                photo: "photo3",
                id: "3",
            },
            {
                name: "Sasha",
                username: "sa5ha",
                photo: "photo4",
                id: "4",
            },
            {
                name: "Ashley",
                username: "ashl3y",
                photo: "photos5",
                id: "5",
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
    return 200
}

// update username and returns status
const updateUsername = async (info) => {
    return 200
}

// update username and returns status
const updateName = async (info) => {
    return 200
}

// update user name and returns status
const updatePhoneNumber = async (info) => {
    return 200
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

// Fails

// FAIL: creates user and returns id
const createFBUserFail = async (name, id, username, email, photo) => {
    return 500
}

// FAIL: gets list of users
const getAllUsersFail = async () => {
    return {
        status: 500,
        userList: [  // returns individual user info
            {
                name: "John",
                username: "j0hn",
                photo: "photo1",
                id: "1",
            },
            {
                name: "Bobby",
                username: "b0bby",
                photo: "photo2",
                id: "2",
            },
            {
                name: "Caitlin",
                username: "cait1in",
                photo: "photo3",
                id: "3",
            },
            {
                name: "Sasha",
                username: "sa5ha",
                photo: "photo4",
                id: "4",
            },
            {
                name: "Ashley",
                username: "ashl3y",
                photo: "photos5",
                id: "5",
            }
        ]
      }
} 

// FAIL: gets first 100 account usernames/names starting with text input
// mock function calls 5
const searchUsersFail = async (text) => {
    return {
        status: 500,
        count: 5,
        userList: [  // returns individual user info
            {
                name: "John",
                username: "j0hn",
                photo: "photo1",
                id: "1",
            },
            {
                name: "Bobby",
                username: "b0bby",
                photo: "photo2",
                id: "2",
            },
            {
                name: "Caitlin",
                username: "cait1in",
                photo: "photo3",
                id: "3",
            },
            {
                name: "Sasha",
                username: "sa5ha",
                photo: "photo4",
                id: "4",
            },
            {
                name: "Ashley",
                username: "ashl3y",
                photo: "photos5",
                id: "5",
            }
        ]
      }
}

// FAIL: deletes user and returns status
const deleteUserFail = async () => {
    return 500
}

// FAIL: gets user by id and returns user info
const getUserFail = async (id) => {
    return {
        status: 500,
        username: "j0hn",
        email: "j0hn@gmail.com",
        phone_number: 9491234567,
        name: "John",
        photo: "photoJohn",
        id: 1,
      }
}

// FAIL: update email and returns status
const updateEmailFail = async (info) => {
    return 500
}

// FAIL: update username and returns status
const updateUsernameFail = async (info) => {
    return 500
}

// FAIL: update user name and returns status
const updateNameFail = async (info) => {
    return 500
}

// FAIL: update username and returns status
const updatePhoneNumberFail = async (info) => {
    return 500
}

// FAIL: updates user and returns status
const updateUserFail = async (req) => {
    return 500
}

// FAIL: checks username and returns status
const checkUsernameFail = async (username) => {
    return 500
}

// FAIL: checks phone number and returns status
const checkPhoneNumberFail = async (phoneNumber) => {
    return 500
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
  }