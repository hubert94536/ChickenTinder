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
  friend_id: {
    type: DataTypes.BIGINT,
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
  sender_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
})

Notifications.belongsTo(Accounts, { foreignKey: 'sender_id', foreignKeyConstraint: true })
Friends.belongsTo(Accounts, { foreignKey: 'friend_id', foreignKeyConstraint: true })

// select name and username

// sequelize.sync({ force: true }).then(() => {
//   // sequelize.query('CREATE OR REPLACE FUNCTION notify_insert()' +
//   //   ' RETURNS trigger AS $$' +
//   //   ' DECLARE' +
//         ' row
//   //   ' BEGIN' +
//   //         ' PERFORM pg_notify(\'notifications\', row_to_json(NEW) ::text);' +
//   //         ' RETURN NEW;' +
//   //   ' END;' +
//   //   ' $$ LANGUAGE plpgsql;'
//   // )

//   // sequelize.query('CREATE TRIGGER notify_insert' +
//   //   ' AFTER INSERT ON notifications' +
//   //   ' FOR EACH ROW' +
//   //   ' EXECUTE PROCEDURE notify_insert();')
// })

module.exports = { Accounts, Friends, Notifications }

// sequelize.query(`CREATE OR REPLACE FUNCTION notify_insert() \
//   RETURNS trigger AS $$ \
//   DECLARE \
//       rec RECORD;\
//   BEGIN \
//       SELECT INTO rec notifications.id, notifications.receiver_id, notifications.type, notifications.content, \
//         notifications.sender_id, accounts.name, accounts.username \
//         FROM notifications, accounts \
//         WHERE notifications.id = NEW.id, notifications.sender_id = accounts.id
//       PERFORM pg_notify('notifications', row_to_json(rec) ::text); \
//       RETURN rec; \
//   END; \
//   $$ LANGUAGE plpgsql;`
// )
