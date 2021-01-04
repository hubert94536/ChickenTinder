const { firebase } = require('./config.js')

const decodeToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    req.authToken = req.headers.authorization.split(' ')[1];
  } else {
    req.authToken = null;
  }
  next()
}

const authenticate = (req, res, next) => {
  decodeToken(req, res, async () => {
     try {
       const { authToken } = req;
       const userInfo = await firebase
         .auth()
         .verifyIdToken(authToken);
       req.authId = userInfo.uid;
       return next();
     } catch (error) {
       return res
         .status(401)
         .send('Unauthorized Request');
     }
   });
 };

module.exports = {
  authenticate
}