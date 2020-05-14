const sequelize = require('../db/config');
const User = require('./User');
const Wellness = require('./Wellness');
const Event = require('./Event');
const User_Wellness = require('./User_Wellness');
const Attend = require('./Attendees')

require('dotenv/config');

exports.main = async() => {

    User.belongsToMany(Wellness, {
        through: {
            model: User_Wellness,
            unique: false,
            foreignKey: 'WellnessIdWellness',
        },

        unique: false,
        otherKey: 'WellnessIdWellness'
    });

    Wellness.belongsToMany(User, {
        through: {
            model: User_Wellness,
            unique: false,
            foreignKey: 'UserIdUser',
        },

        unique: false,
        otherKey: 'UserIdUser'

    });
    /*
        User.belongsToMany(Wellness, { through: User_Wellness, as: "User", unique: false });
        Wellness.belongsToMany(User, { through: User_Wellness, as: "Wellness", unique: false });*/

    Event.belongsTo(User, {
        foreignKey: 'host',
        targetKey: 'idUser'
    });

    User.belongsToMany(Event, { through: "Attend" });
    Event.belongsToMany(User, { through: "Attend" });

    await sequelize.sync({ force: false });

}