'use strict'
//Importar el model User junto con el módulo que lo controla
const User = require('../models/User');
const Wellness = require('../models/Wellness');
const User_Wellness = require('../models/User_Wellness');
const Event_Invitations = require('../models/Invitation');
const Attend = require('../models/Attendees');
const sequelize = require('../db/config');

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

exports.userWellness = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)
    let id = payload.sub;

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    User_Wellness.findAll({
        where: {
            UserIdUser: id
        }
    }).then(uw => {
        let wellnessList = new Array();
        uw.forEach(e => {
            wellnessList.push(e.dataValues.WellnessIdWellness)
        });

        res.status(200).json({ wellnessList });
    }).catch(err => res.json({ error: 'Ha ocurrido un error' }));

}

exports.wellnessAList = (req, res) => {

    Wellness.findAll({
            where: {
                type: 'Alérgenos'
            }
        })
        .then(wellnessList => {
            res.status(200).json({ wellnessList: wellnessList })
        })
        .catch(err => res.json({ error: 'Ha ocurrido un error' }));
}

exports.wellnessDList = (req, res) => {

    Wellness.findAll({
            where: {
                type: 'Diversidad'
            }
        })
        .then(wellnessList => {
            res.status(200).json({ wellnessList: wellnessList })
        })
        .catch(err => res.json({ error: 'Ha ocurrido un error' }));
}
exports.updateWellness = async(req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)
    let id = payload.sub;

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }


    await User_Wellness.destroy({
        where: {
            UserIdUser: id
        }
    });

    await req.body.wellnessList.forEach(e => {
        User_Wellness.create({
            UserIdUser: id,
            WellnessIdWellness: e
        });

    })

    let myEvents = await Attend.findAll({
        where: {
            UserIdUser: id
        }
    });

    let query = ('SELECT ' +
        'w.name ' +
        'FROM ' +
        'wellnesses w ' +
        'JOIN user_wellnesses uw ON ' +
        'w.idWellness = uw.WellnessIdWellness ' +
        'JOIN users u ON ' +
        'uw.UserIdUser = u.idUser ' +
        'WHERE ' +
        'w.type = "Alérgenos" AND u.idUser = ' + id);

    let myAlergenics = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

    let ma = new Array();

    await myAlergenics.forEach(async(e) => {
        await ma.push(e['name'])
    })

    query = ('SELECT ' +
        'w.name ' +
        'FROM ' +
        'wellnesses w ' +
        'JOIN user_wellnesses uw ON ' +
        'w.idWellness = uw.WellnessIdWellness ' +
        'JOIN users u ON ' +
        'uw.UserIdUser = u.idUser ' +
        'WHERE ' +
        'w.type = "Diversidad" AND u.idUser = ' + id);

    let myDiversity = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

    let md = new Array();

    await myDiversity.forEach(e => {
        md.push(e['name'])
    })

    myEvents.forEach(async(e) => {

        await Event_Invitations.findOneAndUpdate({
            idEvent: e.dataValues['EventIdEvent'],
            'invitations.code': e.dataValues['confirmationCode']
        }, {
            $set: {
                'invitations.$.alergenics': ma,
                'invitations.$.functionality': md
            }
        });

    });

}