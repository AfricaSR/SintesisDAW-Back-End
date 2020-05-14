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

exports.userWellness = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)
    let id = payload.sub;

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }




}

exports.wellnessAList = (req, res) => {

    Wellness.findAll({
            where: {
                type: 'Alérgenos'
            }
        })
        .then(wellnessList => {
            res.status(200).json({ wellnessList })
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
            res.status(200).json({ wellnessList })
        })
        .catch(err => res.json({ error: 'Ha ocurrido un error' }));
}
exports.updateWellness = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)
    let id = payload.sub;

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }




}