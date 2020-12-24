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
