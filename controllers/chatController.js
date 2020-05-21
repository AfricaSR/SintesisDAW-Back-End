'use strict'
const User = require('../models/User');
const Attend = require('../models/Attendees');
const Event = require('../models/Event');
const Chat = require('../models/Chat');
const jwt = require('jwt-simple');
const moment = require('moment');

exports.sendMessage = async(req, res) => {

    let token = req.body.token;
    let payload = jwt.decode(token, process.env.SECRET_TOKEN)

    if (payload.exp < moment().unix()) {
        return res.status(401).json({ error: 'El Link ha expirado' })
    }

    await Chat.findOneAndUpdate({
            'chats.code': req.body.code,
        }, { $push: { "chats.$.messages": { message: req.body.message } } })
        /*
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
        */
}