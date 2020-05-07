var Controller = require('../controllers/usersController');

module.exports = function(app) {
    // Comprueba si el usuario es correcto
    app.post('/inicio', Controller.login);
}