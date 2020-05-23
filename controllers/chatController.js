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
    return new Promise((resolve, reject) => {
        Chat.findOneAndUpdate({
            idEvent: idEvent,
            'chats.idAttend': idAttend
        }, { $push: { 'chats.$.messages': message } }, { 'new': true }, (err, event) => {
            if (err) {
                reject(err);
            } else {
                if (event) {
                    resolve();
                } else {
                    reject('no item found');
                }
            }
        });
    });

}

exports.getChatMessages = (idEvent, idAttend) => {

    let messages = Chat.findOne({
        idEvent: idEvent,
        'chats.idAttend': idAttend
    }).then(event => {
        return event;
    }).catch(err => { return err })

    return messages;

}

exports.getChat = (req, res) => {

    Chat.findOne({
        idEvent: req.body.idEvent,
        'chats.idAttend': req.body.idAttend
    }).then(event => {
        return res.status(200).json(event['chats'].find(chat => chat['idAttend'] == req.body.idAttend))
    }).catch(err => { return err })

}

exports.viewChatMessages = (idEvent, idAttend, viewed) => {

    let messages = Chat.findOneAndUpdate({
        idEvent: idEvent,
        'chats.idAttend': idAttend
    }, { $set: { 'chats.$.viewed': viewed } }).then(event => {
        return event;
    }).catch(err => { return err })

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