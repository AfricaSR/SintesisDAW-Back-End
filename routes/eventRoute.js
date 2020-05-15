var Controller = require('../controllers/eventController');
var verifyToken = require('../middlewares/verifyToken');
module.exports = function(app) {

    app.post('/eventListCreated', verifyToken.verifyLogin, Controller.eventListCreated)
    app.get('/myInvitations', verifyToken.verifyLogin, Controller.myInvitations)
    app.post('/eventCreated', verifyToken.verifyLogin, Controller.eventCreated)
    app.get('/myInvitation/:id', verifyToken.verifyLogin, Controller.myInvitation)
    app.post('/createEvent', verifyToken.verifyLogin, Controller.createEvent)
    app.put('/editEvent/:id', verifyToken.verifyLogin, Controller.editEvent)
    app.delete('/deleteEvent/:id', verifyToken.verifyLogin, Controller.deleteEvent)

}