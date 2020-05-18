'use strict'
//Importar el model User junto con el módulo que lo controla
const User = require('../models/User');
const Wellness = require('../models/Wellness');
const Event = require('../models/Event');
const Event_Invitations = require('../models/Invitation');
const Invitation = require('../models/Invitation');
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

exports.createEvent = (req, res) => {

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


    Event.create({
        host: id,
        title: req.body.event.title,
        description: req.body.event.description,
        code: req.body.event.code,
        date: d,
        location: req.body.event.location,
        street: req.body.event.street,
        postalCode: req.body.event.postalCode,
        closed: req.body.event.closed,
    }).then(event => {
        Event_Invitations.create({
            idEvent: event.idEvent
        })

        return res.status(200).json({ msg: "Evento creado correctamente" })
    }).catch(err => { return res.status(500).json({ error: err }) })

}

exports.editEvent = (req, res) => {


}

exports.deleteEvent = (req, res) => {


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
            'invitations.$.functionality': req.body.invitation.functionality,
            'invitations.$.responses': req.body.invitation.responses,

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