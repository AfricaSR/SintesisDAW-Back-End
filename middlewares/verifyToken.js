//Servicio de tokens con caducidad
const jwt = require('jwt-simple');
const moment = require('moment');

//Variables globales
require('dotenv/config');


//Verifica que el token esté vigente
exports.verifyLogin = (req, res, next) => {

    if (req.body.token) {
        const token = req.body.token;

        const payload = jwt.decode(token, process.env.SECRET_TOKEN)

        if (payload.exp < moment().unix()) {
            return res.status(401).json({ error: 'La sesión ha caducado. Vuelve a logearte' })
        }

        req.auth = payload.sub;
        next();

    } else {
        return res.status(401).json({ error: 'No puedes acceder a este contenido' })
    }

}