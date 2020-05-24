var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema({
    title: String,
    body: String,
    viewed: Boolean,
    createdAt: Date
})

module.exports = mongoose.model('User_Notifications', {
    idUser: Number,
    LVL_Host: [Notification],
    LVL_User: [Notification],
    LVL_Attend: [Notification]
});