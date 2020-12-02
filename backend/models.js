const { DataTypes } = require('sequelize')
const { sequelize } = require('./config.js')

const Accounts = sequelize.define('accounts', {
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
})

const Friends = sequelize.define('friends', {
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

const Notifications = sequelize.define('notifications', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
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
})

Notifications.belongsTo(Accounts, { foreignKey: 'sender_id', foreignKeyConstraint: true })
Friends.belongsTo(Accounts, { foreignKey: 'friend_id', foreignKeyConstraint: true })

sequelize.sync({ force: true }).then(() => {
  sequelize.query('CREATE OR REPLACE FUNCTION notify_insert()' +
    ' RETURNS trigger AS $$' +
    ' DECLARE' +
    ' BEGIN' +
    ' PERFORM pg_notify(\'notifications\', row_to_json(NEW)::text);' +
    ' RETURN NEW;' +
    ' END;' +
    ' $$ LANGUAGE plpgsql;'
  )
  sequelize.query('CREATE TRIGGER notify_insert' +
    ' AFTER INSERT ON notifications' +
    ' FOR EACH ROW' +
    ' EXECUTE PROCEDURE notify_insert();')
})

module.exports = { Accounts, Friends, Notifications }
