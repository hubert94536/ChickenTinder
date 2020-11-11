<<<<<<< HEAD
const loginWithFacebook = () => {
  return Promise.resolve('Username')
}

exports.loginWithFacebook = loginWithFacebook
=======
const loginWithFacebook = jest
  .fn(async () => Promise.reject())
  .mockImplementationOnce(async () => Promise.resolve('Username'))

const logoutWithFacebook = jest
  .fn(async () => Promise.reject())
  .mockImplementationOnce(async () => Promise.resolve())

const deleteUser = jest
  .fn(async () => Promise.reject())
  .mockImplementationOnce(async () => Promise.resolve())

export default {
  loginWithFacebook,
  logoutWithFacebook,
  deleteUser,
}
>>>>>>> 8522c47d83d5811d63c3936d16b94aec8a8de1d6
