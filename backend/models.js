const { Sequelize, DataTypes } = require('sequelize')
// require ('dotenv').config();

// configuration for database
const config = {
  user: process.env.USERS_USER,
  username: process.env.USERS_USER,
  host: process.env.USERS_HOST,
  password: process.env.USERS_PASSWORD,
  port: 5432,
  database: process.env.USERS_DATABASE,
  ssl: true,
  dialect: 'postgresql',
  // dialectOptions: {
  //     ssl: {
  //         require: true
  //     }
  // },
  ssl: {
    rejectUnauthorized: false
  }
}

const sequelize = new Sequelize(config)

const Accounts = sequelize.define('accounts', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone_number: {
    type: DataTypes.STRING,
    unique: true
  },
  photo: DataTypes.STRING,
  inSession: DataTypes.BOOLEAN
  // password: DataTypes.STRING(20)
})

Accounts.sync({ force: true }).then(() => {
  console.log('All models were synchronized successfully.')
})


const Friends = sequelize.define('friends', {

    main_user: {
        type: DataTypes.STRING(20),
        allowNull: false,
        // primaryKey: true
    },


    f_status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: false,

    },

});

Friends.belongsTo(Accounts, {foreignKey: 'friend_user', targetKey: 'username'})


Friends.sync({ force: true}).then(()=> {
    console.log("All models were synchronized successfully.");
})

module.exports = { Accounts, Friends }
