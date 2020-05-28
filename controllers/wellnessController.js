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

    await Attend.findAll({
        where: {
            UserIdUser: id,
            role: 'Asistente'
        }
    }).then((at) => {
        at.forEach(async(e) => {
            await Event_Invitations.findOne({
                idEvent: e.dataValues['EventIdEvent']
            }, (err, al) => {

                al['invitations']
                    .find(x => x['code'] == e.dataValues['confirmationCode'])['alergenics'] = new Array();
                al['invitations']
                    .find(x => x['code'] == e.dataValues['confirmationCode'])['functionality'] = new Array();

                al.save();

            })
        });
    }).catch(err => {
        if (err) {
            return res.json(err)
        }
    })


    await req.body.wellnessList.forEach(e => {
        User_Wellness.create({
                UserIdUser: id,
                WellnessIdWellness: e
            }).then(async(uw) => {
                await Wellness.findOne({
                    where: {
                        idWellness: uw.dataValues['WellnessIdWellness']
                    }
                }).then(async(wll) => {
                    let name = wll.dataValues['name']

                    if (wll.dataValues['type'] == 'Alérgenos') {

                        await Attend.findAll({
                            where: {
                                UserIdUser: id
                            }
                        }).then((at) => {

                            at.forEach(async(el) => {

                                await Event_Invitations.findOne({
                                        idEvent: el.dataValues['EventIdEvent'],
                                    },
                                    (err, al) => {
                                        if (al['invitations'].find(x => x['code'] == el.dataValues['confirmationCode']) != undefined) {
                                            al['invitations']
                                                .find(x => x['code'] == el.dataValues['confirmationCode'])['alergenics'].push(name)
                                            al.save();
                                        }
                                    })

                            });

                        })

                    } else {

                        await Attend.findAll({
                            where: {
                                UserIdUser: id
                            }
                        }).then((at) => {

                            at.forEach(async(el) => {

                                await Event_Invitations.findOne({
                                        idEvent: el.dataValues['EventIdEvent']
                                    },
                                    (err, al) => {
                                        if (al['invitations'].find(x => x['code'] == el.dataValues['confirmationCode']) != undefined) {
                                            al['invitations']
                                                .find(x => x['code'] == el.dataValues['confirmationCode'])['functionality'].push(name)
                                            al.save();
                                        }
                                    })

                            });

                        })

                    }
                })
            })
            .catch(err => {
                if (err) {
                    return err
                }
            });

    })

    return res.status(200).json({ Felicitaciones: "Tu sección de Bienestar ha sido actualizada." })

}