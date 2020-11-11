// mock functions for accountsApi
// first call with fail, successive will pass

// creates user and returns id
const createFBUser = jest
  .fn((name, id, username, email, photo) => Promise.resolve(500)) // Fail (default)
  .mockImplementationOnce((name, id, username, email, photo) => Promise.resolve(200)) // Pass (first call)

// gets list of users
const getAllUsers = jest
  .fn(() => ({ status: 500 })) // Fail
  .mockImplementationOnce(() =>
    // Pass
    Promise.resolve({
      // Pass
      status: 200,
      userList: [
        // returns individual user info
        {
          name: 'John Wick',
          username: 'j0hn',
          photo:
            'https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038',
          id: '1',
        },
        {
          name: 'Bobby Brown',
          username: 'b0bby',
          photo:
            'phohttps://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038to2',
          id: '2',
        },
        {
          name: 'Caitlin Lee',
          username: 'cait1in',
          photo:
            'https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038',
          id: '3',
        },
        {
          name: 'Sasha Suresh',
          username: 'sa5ha',
          photo:
            'https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038',
          id: '4',
        },
        {
          name: 'Ashley Nguyen',
          username: 'ashl3y',
          photo:
            'https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038',
          id: '5',
        },
      ],
    }),
  )

// gets first 100 account usernames/names starting with text input
// mock function calls 5
const searchUsers = jest
  .fn((text) => ({ status: 500 })) // Fail
  .mockImplementationOnce((
    text, // Pass
  ) =>
    Promise.resolve({
      status: 200,
      count: 5,
      userList: [
        // returns individual user info
        {
          name: 'John Wick',
          username: 'j0hn',
          photo:
            'https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038',
          id: '1',
        },
        {
          name: 'Bobby Brown',
          username: 'b0bby',
          photo:
            'phohttps://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038to2',
          id: '2',
        },
        {
          name: 'Caitlin Lee',
          username: 'cait1in',
          photo:
            'https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038',
          id: '3',
        },
        {
          name: 'Sasha Suresh',
          username: 'sa5ha',
          photo:
            'https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038',
          id: '4',
        },
        {
          name: 'Ashley Nguyen',
          username: 'ashl3y',
          photo:
            'https://scontent-lax3-1.xx.fbcdn.net/v/t1.30497-1/cp0/c15.0.50.50a/p50x50/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=2&_nc_sid=12b3be&_nc_ohc=ZEui8MAu8YMAX8gwK_s&_nc_ht=scontent-lax3-1.xx&tp=27&oh=37a708095535bfb06a83a65981aee779&oe=5FC08038',
          id: '5',
        },
      ],
    }),
  )

// deletes user and returns status
const deleteUser = jest
  .fn(() => Promise.resolve(500)) // Fail
  .mockImplementationOnce(() => Promise.resolve(200)) // Pass

// gets user by id and returns user info
const getUser = jest
  .fn((id) => ({ status: 500 })) // Fail
  .mockImplementationOnce(() =>
    // Pass
    Promise.resolve({
      // Pass
      status: 200,
      username: 'j0hn',
      email: 'j0hn@gmail.com',
      phone_number: 9491234567,
      name: 'John Wick',
      photo: 'photoJohn',
      id: 1,
    }),
  )

// update email and returns status
const updateEmail = jest
  .fn((info) => Promise.resolve(500)) // Fail
  .mockImplementationOnce((info) => Promise.resolve(200)) // Pass

// update username and returns status
const updateUsername = jest
  .fn((info) => Promise.resolve(500)) // Fail
  .mockImplementationOnce((info) => Promise.resolve(200)) // Pass

// update username and returns status
const updateName = jest
  .fn((info) => Promise.resolve(500)) // Fail
  .mockImplementationOnce((info) => Promise.resolve(200)) // Fail

// update user name and returns status
const updatePhoneNumber = jest
  .fn((info) => Promise.resolve(500)) // Fail
  .mockImplementationOnce((info) => Promise.resolve(200)) // Pass

// updates user and returns status
const updateUser = jest
  .fn((req) => Promise.resolve(500)) // Fail
  .mockImplementationOnce((req) => Promise.resolve(200)) // Pass

// checks username and returns status
const checkUsername = jest
  .fn((username) => Promise.resolve(500)) // Fail
  .mockImplementationOnce((username) => Promise.resolve(200)) // Pass

// checks phone number and returns status
const checkPhoneNumber = jest
  .fn((phoneNumber) => Promise.resolve(500)) // Fail
  .mockImplementationOnce((phoneNumber) => Promise.resolve(200)) // Pass

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
