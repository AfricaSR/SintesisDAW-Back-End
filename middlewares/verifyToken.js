//Servicio de tokens con caducidad
const jwt = require('jwt-simple');
const moment = require('moment');

//Variables globales
require('dotenv/config');


//Verifica que el token esté vigente
exports.verifyLogin = (req, res, next) => {

    if (req.body.token) {
        let token = req.body.token;

        let payload = jwt.decode(token, process.env.SECRET_TOKEN)

        if (payload.exp < moment().unix()) {
            return res.status(401).json({ error: 'La sesión ha caducado. Vuelve a logearte' })
        }

        req.body.token = token;
        next();

    } else {
        return res.status(401).json({ error: 'No puedes acceder a este contenido' })
    }

}