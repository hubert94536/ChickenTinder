// Tokens used only for authorizing API Requests
const fs = require('fs');
const jwt = require('jsonwebtoken');

var privateKey = process.env.PRIVATE_KEY;
var publicKey = process.env.PUBLIC_KEY;

// TODO: Most API calls will have to be verified (so must send token and possibly uid)
// TODO: Implement Refresh Token generation and validation (for generating access tokens)


// Generate and returns user token
// Use only with login or refresh - no independent api endpoint
const generateJWT = (uid) => {
    try {
        var payload = {
            uid: uid
        }
        var options = {
            algorithm: "RS256", //CHANGE LATER
            expiresIn: "1d", 
            issuer: "Wechews",
            audience: "https://wechews.herokuapp.com"
        }
        return jwt.sign(payload, privateKey, options);
    } catch (error) {
        throw error;
    }
}

// Middleware: Decodes token and returns user id
// JWT MUST be attached to Access-Token for every request header 
// Notes that requests cannot have a pre-set 'uid' in their body
const decodeJWT = (req, res, next) => {
    const token = req.header("Access-Token")
    if (!token) return next();
    try{
        var options = {
            algorithms: ["RS256"],
            maxAge: "1d",
            issuer: "Wechews",
            audience: "https://wechews.herokuapp.com"
        }
        var payload = jwt.verify(token, publicKey, options);
        // consider checking db to see if uid exists
        req.uid = payload.uid
        return next();
    } catch (error) {
        return next();
    }
}

// Middleware: Checks if user has been authenticated
const isAuthenticated = (req, res, next) => {
    if (req.uid) return next();
    res.status(401);
    res.send('User not authenticated')
}

// Import these functions into relevant backend files - do not make these directly accessible by api call
// Store refresh token and access token in async storage -- if refresh token expires, logout
module.exports = {
    generateJWT,
    decodeJWT,
    isAuthenticated
}