const DataTypes = require('sequelize');
const sequelize = require('../db/config');

module.exports = sequelize.define("User_Wellness", {
    idUW: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
            len: [0, 11]
        },
        allowNull: false
    }
});