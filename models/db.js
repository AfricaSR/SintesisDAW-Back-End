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


    Event.belongsTo(User, {
        foreignKey: 'host',
        targetKey: 'idUser'
    });

    User.belongsToMany(Event, {
        through: {
            model: Attend,
            unique: false,
            foreignKey: 'EventIdEvent',
        },

        unique: false,
        otherKey: 'EventIdEvent'
    });

    Event.belongsToMany(User, {
        through: {
            model: Attend,
            unique: false,
            foreignKey: 'UserIdUser',
        },

        unique: false,
        otherKey: 'UserIdUser'

    });


    await sequelize.sync({ force: false });

}