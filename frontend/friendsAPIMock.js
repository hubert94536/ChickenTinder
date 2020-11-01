// friendsAPi.js mock functions
// first call will fail, rest will succeed

// creates friendship
const createFriendship = jest
  .fn((friend) => Promise.resolve(200)) // Default: Success
  .mockImplementationOnce((friend) => Promise.resolve(500)) //First Call: Fail

// gets a users friends/requests
// Default: success status, returns an array of user info for 5 users
// First Call: fail status, but still returns an array of user info for 5 users
const getFriends = jest
  .fn(() =>
    Promise.resolve({
      status: 200,
      friendList: [
        {
          id: '1',
          name: 'Jeff Winger',
          photo: 'https://example.com/jeff.png',
          username: 'jeff168',
          status: 200,
        },
        {
          id: '2',
          name: 'Britta Perry',
          photo: 'https://example.com/britta.png',
          username: 'britta168',
          status: 200,
        },
        {
          id: '3',
          name: 'Annie Edison',
          photo: 'https://example.com/annie.png',
          username: 'annie168',
          status: 200,
        },
        {
          id: '4',
          name: 'Troy Barnes',
          photo: 'https://example.com/troy.png',
          username: 'troy168',
          status: 200,
        },
        {
          id: '5',
          name: 'Abed Nadir',
          photo: 'https://example.com/abed.png',
          username: 'abed168',
          status: 200,
        },
      ],
    }),
  )
  .mockImplementationOnce(() =>
    Promise.resolve({
      status: 500,
      friendList: [
        {
          id: '1',
          name: 'Jeff Winger',
          photo: 'https://example.com/jeff.png',
          username: 'jeff168',
          status: 200,
        },
        {
          id: '2',
          name: 'Britta Perry',
          photo: 'https://example.com/britta.png',
          username: 'britta168',
          status: 200,
        },
        {
          id: '3',
          name: 'Annie Edison',
          photo: 'https://example.com/annie.png',
          username: 'annie168',
          status: 200,
        },
        {
          id: '4',
          name: 'Troy Barnes',
          photo: 'https://example.com/troy.png',
          username: 'troy168',
          status: 200,
        },
        {
          id: '5',
          name: 'Abed Nadir',
          photo: 'https://example.com/abed.png',
          username: 'abed168',
          status: 200,
        },
      ],
    }),
  )

// accept a friend request
const acceptFriendRequest = jest
  .fn((friend) => Promise.resolve(200)) // Default: Success
  .mockImplementationOnce((friend) => Promise.resolve(500)) //First Call: Fail

// remove a friendship
const removeFriendship = jest
  .fn((friend) => Promise.resolve(200)) // Default: Success
  .mockImplementationOnce((friend) => Promise.resolve(500)) //First Call: Fail

export default {
  createFriendship,
  getFriends,
  acceptFriendRequest,
  removeFriendship,
}
