'use strict'
const User = require('../models/User');
const Attend = require('../models/Attendees');
const Event = require('../models/Event');
const Chat = require('../models/Chat');
const Notification = require('../models/Notification');
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

exports.getNotifications = (token) => {

    let tok = token;
    let payload = jwt.decode(tok, process.env.SECRET_TOKEN)
    let id = payload.sub;

    let notifications = Notification.findOne({
        idUser: id
    }).then(noti => {
        return noti;
    }).catch(err => { return err })

    return notifications;

}

exports.viewNotifications = async(token) => {
    let tok = token;
    let payload = jwt.decode(tok, process.env.SECRET_TOKEN)
    let id = payload.sub;
    let notifications = await Notification.findOne({
        idUser: id
    }, (err, noti) => {
        if (noti) {
            noti['LVL_User'].forEach(e => {
                e['viewed'] = true;
            });
            noti['LVL_Host'].forEach(e => {
                e['viewed'] = true;
            });
            noti['LVL_Attend'].forEach(e => {
                e['viewed'] = true;
            });
            noti.save()
        }

        return noti;
    })

    return notifications;
}

exports.postNewsNotification = async(idEvent, title) => {

    let Notifications = await Attend.findAll({
        where: {
            EventIdEvent: idEvent,
            role: {
                $not: 'Anfitrión'
            }
        }
    }).then(async(attends) => {

        if (attends) {
            let noti = {
                title: title,
                body: 'Tiene una nueva noticia',
                viewed: false,
                createdAt: new Date()
            }
            await attends.forEach(e => {
                console.log(e.dataValues)
                Notification.findOneAndUpdate({
                    idUser: e.dataValues['UserIdUser']
                }, { $push: { 'LVL_Attend': noti } }, (err) => {
                    if (err) {
                        return err;
                    }
                })
            });

        }
    }).catch(err => {
        if (err) {
            return err;
        }
    })

    return Notifications;

}

exports.postAttend = async(idEvent, user) => {

    let notifications = await Event.findOne({
        where: {
            idEvent: idEvent
        }
    }).then(async(event) => {

        if (event) {

            let noti = {
                title: (user['name'] + ' ' + user['surname']),
                body: 'Se ha dado de alta en tu evento <b>' + event.dataValues['title'] + '</b>',
                viewed: false,
                createdAt: new Date()
            }
            await Notification.findOneAndUpdate({
                idUser: event.dataValues['host']
            }, { $push: { 'LVL_Host': noti } })
        }
    }).catch(err => {
        if (err) {
            return err;
        }
    })

    return notifications;

}

/*
Una vez se haya actualizado la sección de bienestar del usuario,
Encontrar aquellos eventos de los que el usuario sea asistente y enviar un mensaje
a los anfitriones del evento para que tengan en cuenta esta información
*/
exports.postWellness = async(token) => {
    let tok = token;
    let payload = jwt.decode(tok, process.env.SECRET_TOKEN)
    let id = payload.sub;
    let notifications = await Attend.findAll({
        where: {
            UserIdUser: id
        }
    }).then((attends) => {

        if (attends) {

            let noti = {
                title: 'Uno de tus invitados',
                body: 'Ha actualizado su información de <b style="color: #56baed;">Bienestar</b>',
                viewed: false,
                createdAt: new Date()
            }

            attends.forEach((e) => {
                Event.findOne({
                    where: {
                        idEvent: e.dataValues['EventIdEvent']
                    }
                }).then((host) => {

                    Notification.findOneAndUpdate({
                            idUser: host.dataValues['host']
                        }, { $push: { 'LVL_Host': noti } },
                        (err) => {
                            if (err) {
                                return err;
                            }
                        })

                })

            })

        }
    }).catch(err => {
        if (err) {
            return err;
        }
    })

    return notifications;

}