const { firebase } = require('./config.js')
const { Accounts } = require('./models.js')

// decode token by splicing Bearer and token
const decodeToken = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    req.authToken = req.headers.authorization.split(' ')[1]
  } else {
    req.authToken = null
  }
  next()
}

// authenticate incoming api requests
const authenticate = (req, res, next) => {
  decodeToken(req, res, async () => {
    try {
      const { authToken } = req
      const userInfo = await firebase.auth().verifyIdToken(authToken)
      req.authId = userInfo.uid
      return next()
    } catch (error) {
      return res.status(401).send('Unauthorized Request')
    }
  })
}

// verify token from socket connection
const verifySocket = async (token) => {
  const userInfo = await firebase.auth().verifyIdToken(token)
  const user = await Accounts.findOne({ where: { uid: userInfo.uid } })
  if (!user) {
    return Promise.reject('USER_NOT_FOUND')
  }
  return Promise.resolve(user)
}

module.exports = {
  authenticate,
  verifySocket,
}
