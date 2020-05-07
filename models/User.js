const Sequelize = require('sequelize');
const db = require('../db/config');

module.exports = db.define('user', {
    idUser: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
            len: [0, 11]
        },
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 50]
        },
        allowNull: false
    },
    surname: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 100]
        },
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 100]
        },
        allowNull: false
    },
    dateBirth: {
        type: Sequelize.DATE,
        allowNull: false
    },
    gender: {
        type: Sequelize.CHAR,
        validate: {
            len: [0, 1]
        },
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 255]
        },
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    updatedAt: {
        type: Sequelize.DATE
    }

})