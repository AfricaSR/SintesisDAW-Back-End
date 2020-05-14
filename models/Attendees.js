const DataTypes = require('sequelize');
const sequelize = require('../db/config');

module.exports = sequelize.define("Attend", {
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