const DataTypes = require('sequelize');
const sequelize = require('../db/config');

module.exports = sequelize.define("Event", {
    idEvent: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
            len: [0, 11]
        },
        allowNull: false
    },
    host: {
        type: DataTypes.INTEGER,
        validate: {
            len: [0, 11]
        },
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 255]
        },
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    code: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 6]
        },
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 100]
        },
        allowNull: false
    },
    street: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 150]
        },
        allowNull: false
    },
    postalCode: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 5]
        },
        allowNull: false
    },
    closed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});