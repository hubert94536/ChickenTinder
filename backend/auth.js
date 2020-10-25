//Tokens used only for authorizing API Requests
const fs = require('fs');
const jwt = require('jsonwebtoken');

//TODO: Store private and public keys in files and replace path with their paths
var privateKey = process.env.PRIVATE_KEY;
var publicKey = process.env.PUBLIC_KEY;

//TODO: Decide on token algorithm, TTL, and (optional) audience
//TODO: Most API calls will have to be verified (so must send token and possibly uid)
//TODO: Figure out when token is generated (on login, ...) and how to re-generate token if expired

//Generate and returns user token
const generateToken = (uid) => {
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

//Decodes token and returns user id
const decodeToken = (token) => {
    try{
        var options = {
            algorithms: ["RS256"],
            maxAge: "1d",
            issuer: "Wechews",
            audience: "https://wechews.herokuapp.com"
        }
        var payload = jwt.verify(token, publicKey, options);
        if (!("uid" in payload)) throw "Invalid token";
        return payload.uid;
    } catch (error) {
        throw error;
    }
}

//Decodes token and checks if token matches uid
const verifyToken = (token, uid) => {
    try{
        var options = {
            "algorithms": ["RS256"],
            "maxAge": "1d",
            "issuer": "Wechews",
            "audience": "https://wechews.herokuapp.com"
        }
        var payload = jwt.verify(token, publicKey, options);
        if (!("uid" in payload)) throw "Invalid token";
        if (payload.uid != uid) throw "User mismatch";
        return "Verified";
    } catch (error) {
        throw error;
    }
}

//Import these functions into relevant backend files - do not make these directly accessible by api call
//Store user token in async storage -- find a way to refresh once token expires
module.exports = {
    generateToken,
    decodeToken,
    verifyToken
}