// const Accounts = require("./accountsModel");


// const Friends = sequelize.define('friends', {

//     main_user: {
//         type: DataTypes.STRING(20),
//         allowNull: false,
//         primaryKey: true
//     },

//     // friend_id: {
//     //     type: DataTypes.INTEGER,
//     //     allowNull: false,
//     //     unique: true,
//     //     primaryKey: true,
//     //     references: {
//     //         model: "Accounts",
//     //         key: "id"
//     //       }
//     // },

//     status: {
//         type: DataTypes.STRING(20),
//         allowNull: false,
//         unique: false,

//     },

// });

// Friends.belongsTo(Accounts, {foreignKey: 'friend_user', targetKey: 'username'})




// // Accounts.sync({ force: true }).then(()=> {
// //     console.log("All models were synchronized successfully.");
// // })

// module.exports = Friends;
