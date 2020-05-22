const Event = require('../models/Event');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
//Esta función permite cerrar los eventos si la fecha de ellos ya está excedida cada día
module.exports = (app) => {
    setInterval(updateEvents, 86.400)

    function updateEvents() {
        Event.update({
            closed: true
        }, {
            where: {
                date: {
                    [Op.lte]: new Date()
                },
                closed: false
            }
        })
    }

}