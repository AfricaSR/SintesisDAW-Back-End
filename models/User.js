const DataTypes = require('sequelize');
const sequelize = require('../db/config');

module.exports = sequelize.define("User", {
    idUser: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
            len: [0, 11]
        },
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 50]
        },
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 100]
        },
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 100]
        },
        allowNull: false
    },
    dateBirth: {
        type: DataTypes.DATE,
        allowNull: false
    },
    gender: {
        type: DataTypes.CHAR,
        validate: {
            len: [0, 1]
        },
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 255]
        },
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 255]
        },
        allowNull: false
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});