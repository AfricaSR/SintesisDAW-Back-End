var mongoose = require('mongoose');

module.exports = mongoose.model('UW', {
    idUser: Number,
    wellness: Array
});