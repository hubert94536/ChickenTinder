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
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    phone_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    photo: DataTypes.STRING,
});

// Accounts.sync({ force: true }).then(()=> {
//     console.log("All models were synchronized successfully.");
// })

module.exports = Accounts;
