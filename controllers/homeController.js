'use strict'
//Importar el model User junto con el módulo que lo controla
const User = require('../models/User');
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
exports.home = (req, res) => {

    res.status(200).json({ msg: 'Bienvenido al home' })

}

//Accede a los ajustes de cuenta del usuario
exports.account = (req, res) => {

    res.status(200).json({ msg: 'Mi cuenta' })

}

//Accede al servicio de canjeo de invitaciones
exports.exchange = (req, res) => {

    res.status(200).json({ msg: 'Canjear' })

}

//Accede a los eventos propidos que se han generado como usuario
exports.events = (req, res) => {

    res.status(200).json({ msg: 'Mis eventos' })

}