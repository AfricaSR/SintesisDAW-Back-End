'use strict'
const User = require('../models/User');
const Attend = require('../models/Attendees');
const Event = require('../models/Event');
const Chat = require('../models/Chat');
const jwt = require('jwt-simple');
const moment = require('moment');


//Variables globales
require('dotenv/config');

exports.saveMessage = async(idEvent, idAttend, message) => {

    let messages = await Chat.findOneAndUpdate({
        idEvent: idEvent,
        'chats.idAttend': idAttend
    }, { $push: { 'chats.$.messages': message } }).then(event => {

        event['chats'].find(chat => chat['idAttend'] = idAttend)['messages'].push(message);
        return event['chats'].find(chat => chat['idAttend'] = idAttend);
    })

    return messages;

}

exports.getChatMessages = (idEvent, idAttend) => {

    let messages = Chat.findOne({
        idEvent: idEvent,
        'chats.idAttend': idAttend
    }).then(event => {
        return event['chats'].find(chat => chat['idAttend'] = idAttend)
    })

    return messages;

}

exports.getChats = (req, res) => {

    Chat.findOne({
        idEvent: req.body.idEvent
    }, (err, event) => {
        if (event) {
            return res.status(200).json(event);
        }
    })

}