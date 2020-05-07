'use strict'

const jwt = require('jwt-simple');
const moment = require('moment')
require('dotenv/config');

exports.verifyMail = (user) => {
    const payload = {
        sub: user,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix()
    }

    return jwt.encode(payload, process.env.SECRET_TOKEN)
}

exports.loginUser = (user) => {
    const payload = {
        sub: user,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    }

    return jwt.encode(payload, process.env.SECRET_TOKEN)
}