// Access tokens for authorizing API Requests, Refresh tokens to generate new access tokens
const fs = require('fs');
const jwt = require('jsonwebtoken');

// ISSUE: .env current cannot read multiline inputs
const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;
const secret = process.env.JWT_SECRET;

// TODO: Integrate with APIs (check response header for new access token, append tokens to all requests)
// TODO: Find how to skip for certain functions/paths (Ex. account creation)

// Generate and returns access token
// TODO: Figure out when to generate access token
const generateAccessToken = (req, res) => {
    try {
        const uid = decodeRefreshToken(req);
        var payload = {
            uid: uid
        }
        var options = {
            algorithm: "RS256", 
            expiresIn: "1d", 
            issuer: "Wechews",
            audience: "https://wechews.herokuapp.com"
        }
        return res.status(200).send(jwt.sign(payload, privateKey, options));
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

// Middleware: Decodes access token and returns user id
// 'Access-Token' MUST BE ATTACHED to every request header 
const decodeAccessToken = (req, res, next) => {
    try{
        const token = req.header("x-access-token");
        if (!token) return next();
        // consider checking db to see if uid exists
        req.uid = decodeAccess(token);
        return next();
    } catch (error) {
        if (error.name === "TokenExpiredError"){
            // TODO: See if token can be requested from client during request rather than always passing in token
            // Checks refresh token with expired token, then generates new token and conitnues with request
            try{
                const uid = decodeRefreshToken(req);
                options.ignoreExpiration = true;
                payload = jwt.verify(token, publicKey, options);
                if (payload.uid === uid) {
                    const newToken = getRefreshToken(uid);
                    req.uid = uid;
                    res.setHeader('x-access-token', newToken);
                }
            }
            catch (error) {
                return next();
            }
        }
        return next();
    }
}

// General decode function for use in sockets
const decodeAccess = (token) => {
    try{
        var options = {
            algorithms: ["RS256"],
            maxAge: "1d",
            issuer: "Wechews",
            audience: "https://wechews.herokuapp.com"
        }
        var payload = jwt.verify(token, publicKey, options);
        return payload.uid
    }
    catch (error){
        // TODO: Handle expired token
        throw error;
    }
}

// Uncomment to independently test function via endpoint
// const decodeAccessToken = (req, res) => {
//     try{
//         const token = req.header("x-access-token")
//         if (!token) throw "No token";
//         var options = {
//             algorithms: ["RS256"],
//             maxAge: "1d",
//             issuer: "Wechews",
//             audience: "https://wechews.herokuapp.com"
//         }
//         var payload = jwt.verify(token, publicKey, options);
//         // consider checking db to see if uid exists
//         req.uid = payload.uid
//         return res.status(200).send(payload.uid);
//     } catch (error) {
//             if (error.name === "TokenExpiredError"){
//                 try{
//                     const uid = decodeRefreshToken(req);
//                     options.ignoreExpiration = true;
//                     payload = jwt.verify(token, publicKey, options);
//                     if (payload.uid === uid) {
//                         const newToken = getRefreshToken(uid);
//                         req.uid = uid;
//                         res.setHeader('x-access-token', newToken);
//                     }
//                 }
//                 catch (error) {
//                     // do nothing
//                 }
//             }
//         return res.status(500).send(error.message);
//     }
// }

// Generate refresh token
// Generate upon login or daily app open (further trigger events TBD)
// Do not expose as indepedent endpoint - attach it to login or other event
const generateRefreshToken = (uid) => {
    try {
        var payload = {
            uid: uid
        }
        var options = {
            algorithm: "HS256", // TODO: Decide on HS256 vs RS256
            expiresIn: "30d", 
            issuer: "Wechews",
            audience: "https://wechews.herokuapp.com"
        }
        return jwt.sign(payload, secret, options);
    } catch (error) {
        throw error;
    }
}

// Uncomment to independently test function via endpoint
// const generateRefreshToken = (req, res) => {
//     try {
//         var payload = {
//             uid: req.body.uid
//         }
//         var options = {
//             algorithm: "HS256",
//             expiresIn: "30d", 
//             issuer: "Wechews",
//             audience: "https://wechews.herokuapp.com"
//         }
//         return res.status(200).send(jwt.sign(payload, secret, options));
//     } catch (error) {
//         return res.status(500).send(error.message);
//     }
// }

// Decodes refresh token and returns uid
const decodeRefreshToken = (req) => {
    try{
        const token = req.header("x-refresh-token");
        if (!token) throw "Invalid header";
        var options = {
            algorithms: ["HS256"],
            maxAge: "30d",
            issuer: "Wechews",
            audience: "https://wechews.herokuapp.com"
        }
        var payload = jwt.verify(token, secret, options);
        // consider checking db to see if uid exists
        return payload.uid;
    } catch (error) {
        throw error;
    }
}

// Uncomment to independently test function via endpoint
// const decodeRefreshToken = (req, res) => {
//     try{
//         const token = req.header("x-refresh-token")
//         if (!token) throw "Invalid header";
//         var options = {
//             algorithms: ["HS256"],
//             maxAge: "30d",
//             issuer: "Wechews",
//             audience: "https://wechews.herokuapp.com"
//         }
//         var payload = jwt.verify(token, secret, options);
//         // consider checking db to see if uid exists
//         return res.status(200).send(payload.uid);
//     } catch (error) {
//         return res.status(200).send(error.message);
//     }
// }

// Middleware: Checks if user has been authenticated
const isAuthenticated = (req, res, next) => {
    // Check path url for special case functions
    if (req.uid) return next();
    return res.status(401).send('Unauthenticated request');
}

// Import these functions into relevant backend files - do not make these directly accessible by api call
// Store refresh token and access token in async storage -- if refresh token expires, logout
module.exports = {
    generateAccessToken,
    decodeAccessToken,
    generateRefreshToken,
    decodeRefreshToken,
    isAuthenticated
}