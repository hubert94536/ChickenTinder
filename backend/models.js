const { DataTypes } = require('sequelize')
const { sequelize } = require('./config.js')

const Accounts = sequelize.define('accounts', {
  uid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(15),
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
  photo: DataTypes.INTEGER,
})

const Friends = sequelize.define('friends', {
  main_uid: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  friend_uid: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
})

const Notifications = sequelize.define('notifications', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  receiver_uid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING(20),
  },
  sender_uid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
})

Notifications.belongsTo(Accounts, { foreignKey: 'sender_uid', foreignKeyConstraint: true })
Friends.belongsTo(Accounts, { foreignKey: 'friend_uid', foreignKeyConstraint: true })

sequelize.sync({ force: true }).then(() => {
  // trigger function to return the newly inserted row and foreign key info
  sequelize.query(
    'CREATE OR REPLACE FUNCTION notify_insert()' +
      " RETURNS trigger AS ' " +
      ' DECLARE ' +
      ' rec RECORD;' +
      ' BEGIN' +
      ' SELECT INTO rec NEW.id, NEW.receiver_uid, NEW.type, NEW.content,' +
      ' NEW.sender_uid, accounts.name, accounts.username, accounts.photo' +
      ' FROM accounts' +
      ' WHERE NEW.sender_uid = accounts.uid;' +
      " PERFORM pg_notify(''notifications'', row_to_json(rec) ::text);" +
      ' RETURN NEW;' +
      ' END;' +
      " ' LANGUAGE plpgsql;",
  )

  // creates trigger upon inserting into notifications
  sequelize.query(
    'CREATE TRIGGER notify_insert' +
      ' AFTER INSERT ON notifications' +
      ' FOR EACH ROW' +
      ' EXECUTE PROCEDURE notify_insert();',
  )
})

module.exports = { Accounts, Friends, Notifications }
