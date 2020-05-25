'use strict'
//Importar el model User junto con el módulo que lo controla
const User = require('../models/User');
const Wellness = require('../models/Wellness');
const Event = require('../models/Event');
const Event_Invitations = require('../models/Invitation');
const Attend = require('../models/Attendees');
const Question = require('../models/Question')
const News = require('../models/News')
const Chat = require('../models/Chat');
const Sequelize = require('sequelize');

//Encriptador de datos
const bcrypt = require('bcrypt');
var crypto = require("crypto");
//const _ = require('lodash');

//Envío de mails
const nodemailer = require("nodemailer");

//Servicio de autenticación de usuarios
const serv = require('../services/auth');

//Servicio de tokens con caducidad
const jwt = require('jwt-simple');
const moment = require('moment');

//Variables globales
require('dotenv/config');

//Accede a los eventos propidos que se han generado como usuario
exports.eventListCreated = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)
    let id = payload.sub;

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    Event.findAll({
        where: {
            host: id
        }
    }).then(eventList => {
        if (Array.isArray(eventList)) {
            res.status(200).json(eventList);
        }
    }).catch(err => res.status(500).send(err))

}

exports.myInvitations = (req, res) => {

    res.status(200).json({ token: req.body.token })

}

exports.myInvitation = (req, res) => {

        res.status(200).json({ token: req.body.token })

    }
    //Accede a los eventos propidos que se han generado como usuario
exports.eventCreated = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)
    let id = payload.sub;

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    Event.findOne({
        where: {
            host: id,
            idEvent: req.body.event
        }
    }).then(event => {
        if (event) {

            Event_Invitations.findOne({
                idEvent: event.idEvent
            }, (err, ei) => {
                res.status(200).json({ event: event, ei: ei });
            })


        } else {
            res.status(200).json({ error: 'Evento no encontrado' });
        }
    }).catch(err => res.status(500).send(err))

}

exports.eventNonCreated = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    Event.findOne({
        where: {
            idEvent: req.body.event
        }
    }).then(event => {
        if (event) {
            res.status(200).json({ event: event });
        } else {
            res.status(200).json({ error: 'Evento no encontrado' });
        }
    }).catch(err => res.status(500).send(err))

}

exports.createEvent = async(req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)
    let id = payload.sub;

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }
    let d = new Date(req.body.event.date.year,
        req.body.event.date.month,
        req.body.event.date.day,
        req.body.event.date.hour,
        req.body.event.date.minute
    );


    await Event.create({
        host: id,
        title: req.body.event.title,
        description: req.body.event.description,
        code: req.body.event.code,
        date: d,
        location: req.body.event.location,
        street: req.body.event.street,
        postalCode: req.body.event.postalCode,
        closed: req.body.event.closed,
    }).then(async(event) => {
        await Event_Invitations.create({
            idEvent: event.idEvent,
            invitations: new Array()
        });

        await Attend.create({
            UserIdUser: id,
            EventIdEvent: event.idEvent,
            role: 'Anfitrión',
            confirmationCode: req.body.event.code,
            confirmed: true
        }).then(async(attend) => {
            await Chat.create({
                idEvent: event.idEvent,
                chats: new Array()
            })
        })

        await Question.create({
            idEvent: event.idEvent,
            questions: new Array()
        });

        await News.create({
            idEvent: event.idEvent,
            News: new Array()
        });



        return res.status(200).json({ msg: "Evento creado correctamente" })
    }).catch(err => { return res.status(500).json({ error: err }) })

}

exports.editEvent = (req, res) => {


}

exports.deleteEvent = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)
    let id = payload.sub;

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    //Encontrar todos los asistentes del evento y los borra
    Attend.destroy({
        where: {
            EventidEvent: req.body.idEvent
        }
    }).then(async() => {
        //Habiendo borrado los asistentes, se borran los objetos relacionados con el evento
        await Event_Invitations.deleteOne({
            idEvent: req.body.idEvent
        }, (err, ei) => {
            if (err) {
                return res.status(500).json({ error: "Ha ocurrido un error ei" })
            } else {

            }
        })

        await Chat.deleteOne({
            idEvent: req.body.idEvent
        }, (err, chat) => {
            if (err) {
                return res.status(500).json({ error: "Ha ocurrido un error chat" })
            }
        })

        await Question.deleteOne({
            idEvent: req.body.idEvent
        }, (err, quest) => {
            if (err) {
                return res.status(500).json({ error: "Ha ocurrido un error ques" })
            }
        })

        await News.deleteOne({
                idEvent: req.body.idEvent
            }, (err, news) => {
                if (err) {
                    return res.status(500).json({ error: "Ha ocurrido un error new" })
                }
            })
            //Y finalmente el propio evento
        await Event.destroy({
            where: {
                idEvent: req.body.idEvent
            }
        }).then(() => {}).catch(err => { if (err) { return res.status(500).json({ error: "Ha ocurrido un error event" }) } })


        return res.status(200).json({ msg: "Evento borrado correctamente" })

    }).catch(err => {
        if (err) {
            return res.status(500).json({ error: "Ha ocurrido un error attend" })
        }
    })

}

exports.createInvitation = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    Event_Invitations.findOneAndUpdate({
            idEvent: req.body.idEvent
        }, { $push: { "invitations": req.body.invitation } },
        (err, ei) => {
            if (ei) {
                ei.invitations.push(req.body.invitation)
                res.json(ei);
            } else {
                res.json(err);
            }
        }

    );


}

exports.deleteEventInvitation = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    Attend.findOne({
        where: {
            confirmationCode: req.body.code
        }
    }).then(async(attend) => {


        if (attend) {
            await Chat.findOneAndUpdate({
                    idEvent: req.body.idEvent,
                    'chats.idAttend': attend.idAttend
                }, { $pull: { "chats": { idAttend: attend.idAttend } } },
                (err, chat) => {

                    Attend.destroy({
                        where: {
                            confirmationCode: req.body.code
                        }
                    })

                })
        }

    })


    Event_Invitations.findOneAndUpdate({
            idEvent: req.body.idEvent
        }, { $pull: { "invitations": { code: req.body.code } } },
        (err, ei) => {
            if (ei) {
                ei.invitations = ei.invitations.filter(function(obj) {
                    return obj.code !== req.body.code;
                });
                res.json(ei);
            } else {
                res.json(err);
            }
        }

    );

}

exports.editEventInvitation = async(req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }
    await Event_Invitations.findOneAndUpdate({
        'invitations._id': req.body.invitation._id
    }, {
        $set: {
            'invitations.$.code': req.body.invitation.code,
            'invitations.$.name': req.body.invitation.name,
            'invitations.$.surname': req.body.invitation.surname,
            'invitations.$.confirmed': req.body.invitation.confirmed,
            'invitations.$.member': req.body.invitation.member,
            'invitations.$.alergenics': req.body.invitation.alergenics,
            'invitations.$.functionality': req.body.invitation.functionality

        }
    });

    Event_Invitations.findOne({
        idEvent: req.body.idEvent
    }, (err, ei) => {
        if (ei) {
            return res.json(ei)
        } else {
            res.json(err);
        }
    })


}

exports.getEventInvitations = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    Event_Invitations.findOne({
        idEvent: req.body.idEvent
    }, (err, ei) => {
        if (ei) {
            return res.json(ei)
        } else {
            res.json(err);
        }
    })

}

exports.getEventInvitation = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    Event.findOne({
        where: {
            code: req.body.code
        }
    }).then(event => {
        if (event) {

            Event_Invitations.findOne({
                idEvent: event.idEvent,
                'invitations.code': req.body.invitation
            }, (err, ei) => {
                if (ei) {
                    res.status(200).json({ ei: ei });
                } else {
                    res.status(200).json({ error: 'Invitación no encontrada' });
                }

            })


        } else {
            res.status(200).json({ error: 'Evento no encontrado' });
        }
    }).catch(err => res.status(500).send(err))

}

exports.makeQuestion = (req, res) => {


    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    Question.findOneAndUpdate({
            idEvent: req.body.event
        }, { $push: { "questions": { body: req.body.question, answers: [] } } },
        (err, q) => {

            if (q) {
                q.questions.push({ body: req.body.question, answers: [] })
                return res.status(200).json(q);
            } else {
                return res.status(500).json(err);
            }
        })

}

exports.getQuestions = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    Question.findOne({
        idEvent: req.body.event
    }, (err, qs) => {

        if (qs) {
            return res.status(200).json(qs);
        } else {
            return res.status(500).json(err);
        }
    })

}

exports.getResponses = async(req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)
    let id = payload.sub;

    await Attend.findOne({
        where: {
            UserIdUser: id,
            EventIdEvent: req.body.event
        }
    }).then(async(attend) => {

        let qs = new Array();
        //Encuentra todas las preguntas del evento con sus respuestas
        await Question.findOne({
            idEvent: attend.dataValues['EventIdEvent']
        }, (err, q) => {

            q['questions'].forEach(e => {

                let qr = {
                    question: e['body'],
                    answer: e['answers'].find(x => x.idAttend == attend.dataValues['idAttend'])
                }

                if (qr['answer'] == undefined) {
                    qr['answer'] = '';
                }
                qs.push(qr)
            });
            return res.json(qs);
        })

    }).catch(err => {
        if (err) {
            return res.json(err);
        }
    })





}


exports.makeNews = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }
    let d = new Date();
    News.findOneAndUpdate({
            idEvent: req.body.event
        }, { $push: { "News": { title: req.body.title, body: req.body.body, createdAt: d } } },
        (err, n) => {
            if (n) {

                n.News.push({ title: req.body.title, body: req.body.body, createdAt: d })
                return res.status(200).json(n);
            } else {
                return res.status(500).json(err);
            }
        })

}

exports.getNews = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    News.findOne({
        idEvent: req.body.event
    }, (err, nw) => {
        if (nw) {
            return res.status(200).json(nw);
        } else {
            return res.status(500).json(err);
        }
    })

}