// mock functions for accountsApi

// creates user and returns id
const createFBUser = (name, id, username, email, photo) => {
    return Promise.resolve(200)
}

// gets list of users
const getAllUsers = () => {
    return Promise.resolve({
        status: 200,
        userList: [  // returns individual user info
            {
                name: "John Wick",
                username: "j0hn",
                photo: "https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038",
                id: "1",
            },
            {
                name: "Bobby Brown",
                username: "b0bby",
                photo: "phohttps://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038to2",
                id: "2",
            },
            {
                name: "Caitlin Lee",
                username: "cait1in",
                photo: "https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038",
                id: "3",
            },
            {
                name: "Sasha Suresh",
                username: "sa5ha",
                photo: "https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038",
                id: "4",
            },
            {
                name: "Ashley Nguyen",
                username: "ashl3y",
                photo: "https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038",
                id: "5",
            }
        ]
      })
} 

// gets first 100 account usernames/names starting with text input
// mock function calls 5
const searchUsers = (text) => {
    return Promise.resolve({
        status: 200,
        count: 5,
        userList: [  // returns individual user info
            {
                name: "John Wick",
                username: "j0hn",
                photo: "https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038",
                id: "1",
            },
            {
                name: "Bobby Brown",
                username: "b0bby",
                photo: "https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038",
                id: "2",
            },
            {
                name: "Caitlin Lee",
                username: "cait1in",
                photo: "https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038",
                id: "3",
            },
            {
                name: "Sasha Suresh",
                username: "sa5ha",
                photo: "https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038",
                id: "4",
            },
            {
                name: "Ashley Nguyen",
                username: "ashl3y",
                photo: "https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038",
                id: "5",
            }
        ]
      })
}

// deletes user and returns status
const deleteUser = () => {
    return Promise.resolve(200)
}

// gets user by id and returns user info
const getUser = (id) => {
    return Promise.resolve({
        status: 200,
        username: "j0hn",
        email: "j0hn@gmail.com",
        phone_number: 9491234567,
        name: "John Wick",
        photo: "photoJohn",
        id: 1,
      })
}

// update email and returns status
const updateEmail = (info) => {
    return Promise.resolve(200)
}

// update username and returns status
const updateUsername = (info) => {
    return Promise.resolve(200)
}

// update username and returns status
const updateName = (info) => {
    return Promise.resolve(200)
}

// update user name and returns status
const updatePhoneNumber = (info) => {
    return Promise.resolve(200)
}

// updates user and returns status
const updateUser = (req) => {
    return Promise.resolve(200)
}

// checks username and returns status
const checkUsername = (username) => {
    return Promise.resolve(200)
}

// checks phone number and returns status
const checkPhoneNumber = (phoneNumber) => {
    return Promise.resolve(200)
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