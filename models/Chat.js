var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({
    role: String,
    name: String,
    surname: String,
    message: String,
    createdAt: Date
})

const Chat = new Schema({
    idAttend: Number,
    nameSurname: String,
    viewed: Boolean,
    lastMessage: Date,
    messages: [Message]
})

module.exports = mongoose.model('Event_Chats', {
    idEvent: Number,
    idHostAttend: Number,
    chats: [Chat]
});