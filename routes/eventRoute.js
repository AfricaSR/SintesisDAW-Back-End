var Controller = require('../controllers/eventController');
var verifyToken = require('../middlewares/verifyToken');
module.exports = function(app) {

    app.post('/eventListCreated', verifyToken.verifyLogin, Controller.eventListCreated)
    app.post('/createInvitation', verifyToken.verifyLogin, Controller.createInvitation)
    app.post('/getEventInvitations', verifyToken.verifyLogin, Controller.getEventInvitations)
    app.post('/getEventInvitation', verifyToken.verifyLogin, Controller.getEventInvitation)
    app.post('/deleteEventInvitation', verifyToken.verifyLogin, Controller.deleteEventInvitation)
    app.post('/editEventInvitation', verifyToken.verifyLogin, Controller.editEventInvitation)
    app.get('/myInvitations', verifyToken.verifyLogin, Controller.myInvitations)
    app.post('/eventCreated', verifyToken.verifyLogin, Controller.eventCreated)
    app.post('/eventNonCreated', verifyToken.verifyLogin, Controller.eventNonCreated)
    app.get('/myInvitation/:id', verifyToken.verifyLogin, Controller.myInvitation)
    app.post('/createEvent', verifyToken.verifyLogin, Controller.createEvent)
    app.put('/editEvent/:id', verifyToken.verifyLogin, Controller.editEvent)
    app.delete('/deleteEvent/:id', verifyToken.verifyLogin, Controller.deleteEvent)

}