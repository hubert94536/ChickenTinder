const { Sequelize, DataTypes } = require('sequelize');

//configuration for accounts database
const config = {
    user: process.env.USERS_USER,
    username: process.env.USERS_USER,
    host: process.env.USERS_HOST,
    password: process.env.USERS_PASSWORD,
    port: 5432,
    database: process.env.USERS_DATABASE,
    ssl: true,
    dialect: 'postgresql',
    ssl: {
        rejectUnauthorized: false,
    }
}

const sequelize = new Sequelize(config);

const Accounts = sequelize.define('accounts', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    username: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    email: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    phone_number: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    friends: DataTypes.ARRAY(DataTypes.TEXT),
});


Accounts.sync({ force: true }).then(()=> {
    console.log("All models were synchronized successfully.");
})

module.exports = Accounts;
