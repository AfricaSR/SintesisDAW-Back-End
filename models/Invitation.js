var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Response = new Schema({
    question: String,
    response: String
})

const I_Wellness = new Schema({
    idWellness: Number
})

const Invitation = new Schema({
    name: String,
    surname: String,
    code: String,
    confirmed: Boolean,
    Wellness: [I_Wellness],
    Responses: [Response]
})

module.exports = mongoose.model('Event_Invitations', {
    idEvent: Number,
    invitations: [Invitation]
});