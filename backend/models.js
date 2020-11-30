const { Sequelize, DataTypes } = require('sequelize')

// configuration for database
const config = {
  user: process.env.USERS_USER,
  username: process.env.USERS_USER,
  host: process.env.USERS_HOST,
  password: process.env.USERS_PASSWORD,
  port: process.env.USERS_PORT,
  database: process.env.USERS_DATABASE,
  dialect: 'postgresql',
  ssl: {
    rejectUnauthorized: false,
  },
}
const sequelize = new Sequelize(config)
const Accounts = sequelize.define(
  'accounts',
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone_number: {
      type: DataTypes.STRING(15),
      unique: true,
    },
    photo: DataTypes.STRING,
  },
)

const Friends = sequelize.define(
  'friends', {
  main_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

const Notifications = sequelize.define(
  'notifications',
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    receiver_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(20),
    },
  }
)

Notifications.belongsTo(Accounts, { foreignKey: 'sender_id', foreignKeyConstraint: true })
Friends.belongsTo(Accounts, { foreignKey: 'friend_id', foreignKeyConstraint: true })

// sequelize.sync({ force: true }).then(() => {
//   console.log('Friend model was synchronized successfully.')
// })

module.exports = { Accounts, Friends, Notifications }
