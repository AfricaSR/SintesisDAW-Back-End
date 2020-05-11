var Controller = require('../controllers/homeController');
var verifyToken = require('../middlewares/verifyToken');
module.exports = function(app) {
    //Accede a la primera pantalla de la intranet comprobando la token de login del usuario
    app.post('/home', verifyToken.verifyLogin, Controller.home)
    app.post('/account', verifyToken.verifyLogin, Controller.account)
    app.post('/exchange', verifyToken.verifyLogin, Controller.exchange)
    app.post('/events', verifyToken.verifyLogin, Controller.events)
    app.post('/notifications', verifyToken.verifyLogin, Controller.notifications)
    app.post('/create', verifyToken.verifyLogin, Controller.create)
    app.post('/my-events', verifyToken.verifyLogin, Controller.myEvents)
    app.post('/my-invitations', verifyToken.verifyLogin, Controller.myInvitations)
    app.post('/wellness', verifyToken.verifyLogin, Controller.wellness)
    app.post('/logout', verifyToken.verifyLogin, Controller.logout)

}