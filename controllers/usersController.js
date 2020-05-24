'use strict'
//Importar el model User junto con el módulo que lo controla
const User = require('../models/User');
const Notification = require('../models/Notification');
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

const op = Sequelize.Op;
const operatorsAliases = {
    $eq: op.eq,
    $or: op.or,
    $ne: op.ne
}

/*
Primero busca en la base de datos que haya un usuario con el email proporcionado y que esté verificado
Luego encripta los datos de la contraseña y los compara con los guardados en el usuario encontrado
Si todo es correcto se deja acceder, sino lanza un error
*/

exports.login = (req, res) => {

    User.findOne({
            where: {
                email: req.body.email,
                verified: true
            }
        })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.dataValues.password)) {
                    let token = serv.loginUser(user.idUser);
                    res.status(200).json({ msg: 'Hola ' + user.name, token: token })
                } else {
                    res.json({ error: 'La contraseña no es correcta' })
                }
            } else {
                res.json({ error: 'El usuario no existe' })
            }

        })
        .catch(err => res.json({ error: 'Ha ocurrido un error' }));
}

//Crea un usuario en la base de datos, llamando a la función insertUser, si las contraseñas son iguales
exports.create = (req, res) => {
    if (req.body.password_1 == req.body.password_2) {
        insertUser(req.body, res);
    } else {
        res.json({ error: 'Las contraseñas no coinciden' })
    }

}

//Verifica que el token recibido esté vigente, luego que exista el usuario y finalmente actualiza que está verificado
exports.verified = (req, res) => {
    let token = req.query.id;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    User.findOne({
            where: {
                email: payload.sub,
                verified: false
            }
        })
        .then((user) => {
            if (user) {
                //Con el usuario verificado se crea el objeto de las notificaciones
                Notification.create({
                    idUser: user.idUser,
                    user: new Array(),
                    host: new Array(),
                    attend: new Array()
                }, () => {

                    let noti = {
                        title: 'Te damos la bienvenida',
                        body: '¿Te apetece actualizar tu seción de bienestar?',
                        viewed: false,
                        createdAt: new Date()
                    }

                    //Y de paso se le añade una notificación de bienvenida
                    Notification.findOneAndUpdate({
                            idUser: user.idUser
                        }, { $push: { 'LVL_User': noti } },
                        (err) => {
                            if (err) {
                                console.log(err)
                            }
                        })
                })

                user.verified = true;
                user.save()
                return res.status(200).json({ msg: 'Hola ' + user.name + ', ya puedes autenticarte' });

            } else {
                return res.json({ error: 'El usuario no existe' })
            }

        })
        .catch(err => { return res.json({ error: 'El usuario no existe' }) });

}

/*Genera una nueva contraseña para el usuario y se la envía por correo
Luego el usuario podrá personalizar una contraseña nueva desde la intranet
*/
exports.recovery = (req, res) => {

    User.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(user => {
            var id = crypto.randomBytes(8).toString('hex');

            if (user) {
                user.password = bcrypt.hashSync(id, 10);
                user.verified = false;
                user.save();
                res.json({ msg: 'Hemos enviado un mensaje de renovación al correo ' + req.body.email });
                verifyEmail(user.email, 'recovery', id);
            } else {
                res.json({ error: 'El usuario no existe' })
            }

        })
        .catch(err => res.send(err));

}

//Ayuda al usuario a recuperar su contraseña
exports.renew = (req, res) => {

    let token = req.query.id;

    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    User.findOne({
            where: {
                email: payload.sub,
                verified: false
            }
        })
        .then(user => {
            if (user) {
                user.verified = true;
                user.save()
                res.status(200).json({ msg: 'Hola ' + user.name + ', ya puedes autenticarte' })
            } else {
                res.json({ error: 'El usuario no existe' })
            }

        })
        .catch(err => res.send(err));

}

/*Llama al modelo User y crea un usuario con los datos proporcionados, encriptando la contraseña
Luego llama a la función verifyEmail para pasar al proceso de verificación
Devuelve error si se viola la restricción de mails únicos
*/
function insertUser(data, res) {

    User.create({
            name: data.name,
            surname: data.surname,
            email: data.email,
            dateBirth: new Date(data.year, data.month, data.day),
            gender: data.gender,
            password: bcrypt.hashSync(data.password_1, 10)
        }).then((user) => {
            verifyEmail(user.email, 'register', null);
            res.json({ msg: data.name + ', para completar tu registro revisa tu buzón de correo' })
        })
        .catch(err => {
            if (err.name == 'SequelizeUniqueConstraintError') {
                res.json({ error: 'Ya hay un usuario registrado con esa dirección de correo' })
            } else {
                res.json({ error: err.name })
            }

        })
}


//Genera un token con el mail del usuario y se lo envía al mismo
async function verifyEmail(mail, subject, id) {

    var emailToken = serv.verifyMail(mail)

    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVICE_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER_NAME,
            pass: process.env.EMAIL_USER_PASSWORD
        }
    });

    let link;
    let info;
    switch (subject) {
        case 'register':
            link = process.env.DB_HOST + ":" + process.env.PORT + "/create-account/verify/?id=" + emailToken;
            info = ({
                from: '"Comunicación" <info@evenfy.es>',
                to: mail,
                subject: "Verificación de correo",
                text: "Bienvenid@ a Eventic!",
                html: "Hola,<br> Para finalizar tu registro, haz Click en el siguiente <br><a href=http://" + link + ">Enlace</a>"
            });
            break;
        case 'recovery':
            link = process.env.DB_HOST + ":" + process.env.PORT + "/recovery/renew/?id=" + emailToken;

            info = ({
                from: '"Comunicación" <info@evenfy.es>',
                to: mail,
                subject: "Recuperación de cuenta",
                html: "Hola, tu nueva contraseña es la siguiente: <br> " + id + " <br>Para acceder, haz Click en el siguiente <br><a href=http://" + link + ">Enlace</a> <br> Te recomendamos que <b>cambies</b> la contraseña una vez hayas inicado sesión"
            });
            break;
    }
    let send = await transporter.sendMail(info);

}