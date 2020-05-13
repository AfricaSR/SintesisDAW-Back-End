const Sequelize = require('sequelize');
const db = require('../db/config');

module.exports = db.define('wellness', {
    idWellness: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
            len: [0, 11]
        },
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 50]
        },
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 100]
        },
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        validate: {
            len: [0, 255]
        },
        allowNull: false
    },
    file: {
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
    updatedAt: {
        type: Sequelize.DATE
    }

})