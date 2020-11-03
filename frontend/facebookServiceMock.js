// facebookService.js mock functions

// Log in to Firebase and Facebook
const loginWithFacebook = jest
  .fn(() => Promise.resolve('Username')) // Default: 'Username'
  .mockImplementationOnce(() => Promise.resolve('Home')) //First Call: returns 'Home'

// Log out of Firebase and Facebook
const logoutWithFacebook = jest.fn(() => Promise.resolve())

// Deletes user
const deleteUser = jest.fn(() => Promise.resolve())

export default {
  loginWithFacebook,
  logoutWithFacebook,
  deleteUser,
}
