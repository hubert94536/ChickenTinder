const rateLimit = require("express-rate-limit");
const RedisStore = require('rate-limit-redis');
const { redisClient } = require('./config.js')

// TODO: Tune values later

// rate limiter for general operations
// allow 100 requests per 5 minutes (1 per 3 second)
const defaultLimiter = rateLimit({
    windowMs: 5*60*1000,
    max: 100,
    message: "Too many requests, try again in 5 minutes",
    store: new RedisStore({
        client: redisClient,
        expiry: 5*60*1000, 
        prefix: "defrl:"
    })
})

// rate limiter for frequently used operations
// allow 60 requests per minute (1 per second)
const frequentLimiter = rateLimit({
    windowMs: 1*60*1000,
    max: 60,
    message: "Too many requests, try again in a minutes",
    store: new RedisStore({
        client: redisClient,
        expiry: 1*60*1000, 
        prefix: "frqrl:"
    })
})

// rate limiter for operations related to changing account
// allow 100 requests per 15 minutes (1 per 9 seconds)
const accountsLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100,
    message: "Too many requests, try again in 15 minutes",
    store: new RedisStore({
        client: redisClient,
        expiry: 15*60*1000, 
        prefix: "accrl:"
    })
})

module.exports = { defaultLimiter, frequentLimiter, accountsLimiter }