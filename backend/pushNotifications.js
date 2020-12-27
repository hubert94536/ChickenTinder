/* Deprecat */
var admin = require('firebase-admin');

admin.initializeApp({
    credential: "foo", // REPLACE
    databaseUrl: "bar" // REPLACE
})

var messaging = admin.messaging;

// Store id: tokens in socket w/ redis

const sendNotification = (id, receiver_id, type, content, sender_id, name, username, photo) => {
    var message = {
        data: {
            type: type,
            content: content, 
            name: name,
            username: username, 
            photo: photo
        },
        token: "foo" //get recipientToken from receiver_id
    }
}

const associateToken = () => {
    // associate recipientToken with id
    // caled on login
}

const disassociateToken = () => {
    // disassociate recipientToken with id
    // called on logout
}

// const Notifications = sequelize.define('notifications', {
//     id: {
//       type: DataTypes.BIGINT,
//       allowNull: false,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     receiver_id: {
//       type: DataTypes.BIGINT,
//       allowNull: false,
//     },
//     type: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     content: {
//       type: DataTypes.STRING(20),
//     },
//     sender_id: {
//       type: DataTypes.BIGINT,
//       allowNull: false,
//     },
//   })