var Controller = require('../controllers/homeController');
var verifyToken = require('../middlewares/verifyToken');
module.exports = function(app) {
    //Accede a la primera pantalla de la intranet comprobando la token de login del usuario
    app.post('/home', verifyToken.verifyLogin, Controller.home)
    app.post('/exchange', verifyToken.verifyLogin, Controller.exchange)
    app.post('/events', verifyToken.verifyLogin, Controller.events)
    app.post('/notifications', verifyToken.verifyLogin, Controller.notifications)
    app.post('/create', verifyToken.verifyLogin, Controller.create)
    app.post('/wellness', verifyToken.verifyLogin, Controller.wellness)
    app.get('/wellness/alergenics', Controller.wellnessAList)
    app.get('/wellness/diversity', Controller.wellnessDList)
    app.post('/logout', verifyToken.verifyLogin, Controller.logout)

}