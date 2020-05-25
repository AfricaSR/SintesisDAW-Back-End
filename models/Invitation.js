var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Invitation = new Schema({
    name: String,
    surname: String,
    code: String,
    confirmed: Boolean,
    member: Boolean,
    alergenics: [String],
    functionality: [String]
})

module.exports = mongoose.model('Event_Invitations', {
    idEvent: Number,
    invitations: [Invitation]
});