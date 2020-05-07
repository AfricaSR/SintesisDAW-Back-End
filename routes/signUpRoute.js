var Controller = require('../controllers/usersController');
module.exports = function(app) {
    //Crea una cuenta de usuario
    app.post('/create-account', Controller.create);
    //Verifica el mail del usuario
    app.get('/create-account/verify', Controller.verified);
}