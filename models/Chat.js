var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({
    idAttend: Number,
    role: String,
    name: String,
    surname: String,
    message: String,
    createdAt: Date
})

const Chat = new Schema({
    code: String,
    messages: [Message]
})

module.exports = mongoose.model('Event_Chats', {
    idEvent: Number,
    chats: [Chat]
});