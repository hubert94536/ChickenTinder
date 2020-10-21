const fs = require('fs')
const jwt = require('jsonwebtoken')

//TODO: Store private and public keys in files and replace path with their paths
var privateKey = fs.readFileSync('path', 'utf8')
var publicKey = fs.readFileSync('path', 'utf8')

//TODO: Decide on token algorithm, TTL, and (optional) audience

//Generate and returns user token
const generateToken = (uid) => {
    try {
        var payload = {
            "uid": uid
        }
        var options = {
            "algorithm": "HS256", //CHANGE LATER
            "expiresIn": "1d", //CHANGE LATER
            "issuer": "Wechews"
        }
        return res.status(200).send(jwt.sign(payload, privateKey, options));
    } catch (errror) {

    }

}

//Decodes token and returns user id
const decodeToken = (token) => {
    try{
        var options = {
            "algorithm": "HS256",
            "expiresIn": "1d",
            "issuer": "Wechews"
        }
        var payload = jwt.verify(token, publicKey, options);
        if (!("uid" in payload)) throw "Invalid token";
        return res.status(200).send(payload.uid);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

//Decodes token and checks if token matches uid
const verifyToken = (token, uid) => {
    try{
        var options = {
            "algorithm": "HS256",
            "expiresIn": "1d",
            "issuer": "Wechews"
        }
        var payload = jwt.verify(token, publicKey, options);
        if (!("uid" in payload)) throw "Invalid token";
        if (payload.uid != uid) return res.status(401).send("User mismatch");
        return res.status(200).send("Verified");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

module.exports = {
    generateToken,
    decodeToken,
    verifyToken
  }
  