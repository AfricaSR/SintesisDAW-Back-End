var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const New = new Schema({
    title: String,
    body: String,
    createdAt: Date
})

module.exports = mongoose.model('Event_News', {
    idEvent: Number,
    News: [New]
});