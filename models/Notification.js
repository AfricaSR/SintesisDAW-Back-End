var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema({
    title: String,
    body: String,
    viewed: Boolean,
    createdAt: Date
})

const LVL_Host = new Schema({
    notifications: [Notification]
})

const LVL_User = new Schema({
    notifications: [Notification]
})

const LVL_Attend = new Schema({
    notifications: [Notification]
})

module.exports = mongoose.model('Notification', {
    idUser: Number,
    user: LVL_User,
    host: LVL_Host,
    attend: LVL_Attend
});