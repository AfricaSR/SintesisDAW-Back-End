var Controller = require('../controllers/usersController');
module.exports = function(app) {
    //Recupera la contraseña del usuario
    app.post('/recovery', Controller.recovery)
        //Renueva la contraseña del usuario
    app.get('/recovery/renew', Controller.renew)
}