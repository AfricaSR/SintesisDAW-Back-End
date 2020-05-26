'use strict'
//Importar el model User junto con el módulo que lo controla
const User = require('../models/User');
const Sequelize = require('sequelize');

//Encriptador de datos
const bcrypt = require('bcrypt');


//Servicio de tokens con caducidad
const jwt = require('jwt-simple');
const moment = require('moment');

//Variables globales
require('dotenv/config');


exports.myAccount = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)
    let id = payload.sub;

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }


    User.findOne({
            where: {
                idUser: id
            },
            attributes: ['idUser', 'name', 'surname', 'email', 'dateBirth', 'gender', 'photo']
        })
        .then(user => {
            if (user) {
                return res.status(200).send(user);
            }

        })
        .catch(err => res.json({ error: 'Ha ocurrido un error' }));
}

exports.editUser = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }
    let date = new Date(req.body.dateBirth.year, req.body.dateBirth.month, req.body.dateBirth.day);
    User.update({
            name: req.body.user.name,
            surname: req.body.user.surname,
            dateBirth: date,
            gender: req.body.user.gender
        }, {
            where: {
                idUser: payload.sub
            }
        }).then(user => {
            return res.status(200).send(user);
        })
        .catch(err => res.json({ error: 'Ha ocurrido un error' }));
}

exports.addPicture = (req, res) => {

    let idUser = req.file.originalname.split('.')[0];
    User.update({
            photo: 'http://localhost:3000/uploads/' + req.file.originalname
        }, {
            where: {
                idUser: idUser
            }
        }).then(user => {
            return res.status(200).send(user);
        })
        .catch(err => res.json({ error: 'Ha ocurrido un error' }));



}




exports.editPassword = async(req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    let isOldPass = false;

    await User.findOne({
        where: {
            idUser: payload.sub
        }
    }).then(user => {
        if (user) {
            if (bcrypt.compareSync(req.body.oldPassword, user.dataValues.password)) {
                isOldPass = true;
            } else {
                return res.json({ error: 'La antigua contraseña no es correcta' })
            }
        }
    })

    if (isOldPass) {
        await User.update({
                password: bcrypt.hashSync(req.body.password, 10)
            }, {
                where: {
                    idUser: payload.sub
                }
            }).then(user => {
                if (user) {
                    return res.status(200).json({ msg: 'Contraseña editada correctamente' });
                }
            })
            .catch(err => res.json({ error: 'Ha ocurrido un error' }));
    }



}

exports.deleteUser = (req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    console.log(payload.sub)

    User.destroy({
        where: {
            idUser: payload.sub
        }
    }).then(user => {
        if (!user) {
            return res.status(401).json({ error: 'No puedes acceder a esta pantalla' })
        } else {
            return res.json({ error: 'Ha ocurrido un error' })
        }

    })

}