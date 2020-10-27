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
// const sequelize = new Sequelize(config)
const sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_ONYX_URL)

const Accounts = sequelize.define(
  'accounts',
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      autoIncrement: true,
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
      type: DataTypes.STRING,
      unique: true,
    },
    photo: DataTypes.STRING,
    inSession: DataTypes.BOOLEAN,
    // password: DataTypes.STRING(20)
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['id', 'username', 'email'],
      },
    ],
  },
)

const Friends = sequelize.define('friends', {
  m_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  f_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
  },
})

Friends.belongsTo(Accounts, { foreignKey: 'f_info', foreignKeyConstraint: true })

/* sequelize.sync({ force: true }).then(() => {
   console.log('Friend model was synchronized successfully.')
 }) */

module.exports = { Accounts, Friends }
