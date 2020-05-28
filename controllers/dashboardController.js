'use strict'

const News = require('../models/News');
const sequelize = require('../db/config');

//Servicio de tokens con caducidad
const jwt = require('jwt-simple');
const moment = require('moment');

//Variables globales
require('dotenv/config');

//Noticias que sólo pueden mostrarse al usuario dado de alta en el evento
class User_News {

    constructor() {
        this.un = new Array();
    }

    setNews(event_title, new_title, new_body, created) {
        this.un.push({
            event_title: event_title,
            new_title: new_title,
            new_body: new_body,
            created: created
        })
    }
}

exports.getEventsNews = async(req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)
    let id = payload.sub;

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    let query = ('SELECT ' +
        'a.idAttend, ' +
        'e.idEvent, ' +
        'e.title ' +
        'FROM ' +
        'attends a ' +
        'JOIN EVENTS e ON ' +
        'a.EventIdEvent = e.idEvent ' +
        'WHERE ' +
        'a.UserIdUser = ' + id + ' ' +
        'AND a.confirmed = 1 ' +
        'AND e.closed = 0'

    );

    //Encontrar aquellos eventos los cuales el invitado ha confirmado su asiatencia
    let results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

    let r = new Array();

    results.forEach(e => {
        r.push(e['idEvent']);
    });

    let us_news = await News.find({
        idEvent: { $in: r }
    }).exec().catch(err => { return res.status(500).json({ error: err }) })



    let un = new User_News();
    for (let i = 0; i < results.length; i++) {

        us_news[i]['News'].forEach(e => {
            un.setNews(results[i]['title'], e['title'], e['body'], e['createdAt']);
        });
    }

    un.un = un.un.sort((a, b) => a.created < b.created);

    return res.status(200).json({ news: un.un })

}

exports.getEventsTimeline = async(req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)
    let id = payload.sub;

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    let query = ('SELECT ' +
        'e.idEvent, ' +
        'e.title, ' +
        'e.description, ' +
        'e.date, ' +
        'e.location, ' +
        'e.street, ' +
        'e.postalCode, ' +
        'u.idUser, ' +
        'u.name, ' +
        'u.surname, ' +
        'a.idAttend ' +
        'FROM ' +
        'attends a ' +
        'JOIN EVENTS e ON ' +
        'a.EventIdEvent = e.idEvent ' +
        'JOIN users u ON ' +
        'u.idUser = e.host ' +
        'WHERE ' +
        'e.closed = 0 AND ' +
        'a.confirmed = 1 AND a.UserIdUser = ' + id

    );

    //Encontrar aquellos eventos los cuales el invitado ha confirmado su asistencia
    let results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

    if (results) {
        return res.status(200).send(results);
    }

}