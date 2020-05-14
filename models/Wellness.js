const DataTypes = require('sequelize');
const sequelize = require('../db/config');
module.exports = sequelize.define("Wellness", {
    idWellness: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
            len: [0, 11]
        },
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 50]
        },
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 100]
        },
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 255]
        },
        allowNull: false
    },
    file: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 255]
        },
        allowNull: false
    }
})