var admin = require('firebase-admin');

admin.initializeApp({
    credential: "foo", // REPLACE
    databaseUrl: "bar" // REPLACE
})

// Store id: tokens in socket w/ redis

// Friend request notification
const sendfriendRequest = (sender, recipientToken) => {
    // build message
    // send message
    var message = {
        notifications: {
            title: `${sender} has sent you a friend request`
        },
        android: {
            priority: "high",
            notification: {
                click_action: "foo" // REPLACE
            }
        },
        token: recipientToken
    }
}

// Accepted notification
const sendAcceptFriend = (sender, recipientToken) => {
    // build message
    // send message
    var message = {
        notifications: {
            title: `${sender} has accepted your friend request`
        },
        android: {
            priority: "high",
            notification: {
                click_action: "foo" // REPLACE
            }
        },
        token: recipientToken
    }
}

// Invite notification
// Pass in array to send to multiple
const sendInvite = (sender, recipientToken) => {
    var message = {
        notifications: {
            title: `${sender} has invited you`,
            body: "Click to join"
        },
        android: {
            priority: "high",
            notification: {
                click_action: "foo" // REPLACE
            }
        },
        token: recipientToken
    }


}

// Currently no groups

// Subscribes multiple people to a group
const subscribeToGroup = (registrationTokens, topic) => {

}

// Unsubscribes multiple people from a group
const unsubscribeFromGroup = (registrationTokens, topic) => {

}

// Send a message to a group
const sendToGroup = (sender, topic, message) = { 

}

