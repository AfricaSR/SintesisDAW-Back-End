const DataTypes = require('sequelize');
const sequelize = require('../db/config');

module.exports = sequelize.define("Attend", {
    idAttend: {

        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
            len: [0, 11]
        },
        allowNull: false
    },
    confirmationCode: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 6]
        },
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 50]
        },
        allowNull: false
    }
});