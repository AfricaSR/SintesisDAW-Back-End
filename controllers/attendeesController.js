'use strict'
//Importar el model User junto con el módulo que lo controla
const User = require('../models/User');
const Wellness = require('../models/Wellness');
const Event = require('../models/Event');
const Event_Invitations = require('../models/Invitation');
const Invitation = require('../models/Invitation');
const Attend = require('../models/Attendees');
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

exports.createAttend = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)
    let id = payload.sub;

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    Attend.create({
        UserIdUser: id,
        EventIdEvent: req.body.event,
        role: req.body.role,
        confirmationCode: req.body.confirmationCode
    }).then(async(attend) => {
        await Event_Invitations.findOneAndUpdate({
            idEvent: req.body.event,
            'invitations.code': req.body.confirmationCode
        }, {
            $set: {
                'invitations.$.member': true,
            }
        });

        return res.status(200).json({ msg: "Bienveni@ al Evento" })
    }).catch(err => { return res.status(500).json({ error: err }) })



}