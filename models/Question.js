var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Answer = new Schema({
    Attend_code: String,
    answer: String
})

const Question = new Schema({
    body: String,
    answers: [Answer]
})

module.exports = mongoose.model('Event_Questions', {
    idEvent: Number,
    questions: [Question]
});