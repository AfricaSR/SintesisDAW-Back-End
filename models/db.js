const sequelize = require('../db/config');
const User = require('./User');
const Wellness = require('./Wellness');
const Event = require('./Event');
const Attend = require('./Attendees')

require('dotenv/config');

exports.main = async() => {

    User.belongsToMany(Wellness, { through: "User_Wellness" });
    Wellness.belongsToMany(User, { through: "User_Wellness" });

    Event.belongsTo(User, {
        foreignKey: 'host',
        targetKey: 'idUser'
    });

    User.belongsToMany(Event, { through: "Attend" });
    Event.belongsToMany(User, { through: "Attend" });

    await sequelize.sync({ force: true });

}