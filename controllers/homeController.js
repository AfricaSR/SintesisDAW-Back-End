'use strict'
//Importar el model User junto con el módulo que lo controla
const User = require('../models/User');
const Wellness = require('../models/Wellness');
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

//Accede al dashboard de la aplicación
exports.home = (req, res, next) => {

    res.status(200).json({ token: req.body.token })

}

//Accede a los ajustes de cuenta del usuario
exports.account = (req, res) => {

    res.status(200).json({ token: req.body.token })

}

//Accede al servicio de canjeo de invitaciones
exports.exchange = (req, res) => {

    res.status(200).json({ token: req.body.token })

}

//Accede a los eventos propidos que se han generado como usuario
exports.events = (req, res) => {

    res.status(200).json({ token: req.body.token })

}

//Accede a los eventos propidos que se han generado como usuario
exports.notifications = (req, res) => {

    res.status(200).json({ token: req.body.token })

}

//Accede a los eventos propidos que se han generado como usuario
exports.create = (req, res) => {

    res.status(200).json({ token: req.body.token })

}

//Accede a los eventos propidos que se han generado como usuario
exports.myEvents = (req, res) => {

    res.status(200).json({ token: req.body.token })

}

//Accede a los eventos propidos que se han generado como usuario
exports.myInvitations = (req, res) => {

    res.status(200).json({ token: req.body.token })

}

//Accede a los eventos propidos que se han generado como usuario
exports.wellness = (req, res) => {

    res.status(200).json({ token: req.body.token })

}

//Accede a los eventos propidos que se han generado como usuario
exports.logout = (req, res) => {

    res.status(200).json({ token: req.body.token })

}

exports.verifyAuth = (req, res) => {

    const token = req.body.token;
    const payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    User.findOne({
            where: {
                idUser: payload.sub,
                verified: false
            }
        })
        .then(user => {
            if (user) {
                console.log(user)
                res.status(200).json({ token: req.body.token })
            } else {
                res.json({ error: 'El usuario no existe' })
            }

        })
        .catch(err => res.json({ error: 'El usuario no existe' }));

}

exports.wellnessList = (req, res) => {

    Wellness.findAll()
        .then(wellnessList => {
            res.status(200).json({ wellnessList })
        })
        .catch(err => res.json({ error: 'Ha ocurrido un error' }));
}