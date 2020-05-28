var Controller = require('../controllers/eventController');
var verifyToken = require('../middlewares/verifyToken');
module.exports = function(app) {

    app.post('/eventListCreated', verifyToken.verifyLogin, Controller.eventListCreated)
    app.post('/createInvitation', verifyToken.verifyLogin, Controller.createInvitation)
    app.post('/getEventInvitations', verifyToken.verifyLogin, Controller.getEventInvitations)
    app.post('/getEventInvitation', verifyToken.verifyLogin, Controller.getEventInvitation)
    app.post('/deleteEventInvitation', verifyToken.verifyLogin, Controller.deleteEventInvitation)
    app.post('/editEventInvitation', verifyToken.verifyLogin, Controller.editEventInvitation)

    app.post('/eventCreated', verifyToken.verifyLogin, Controller.eventCreated)
    app.post('/eventNonCreated', verifyToken.verifyLogin, Controller.eventNonCreated)

    app.post('/createEvent', verifyToken.verifyLogin, Controller.createEvent)
    app.post('/editEvent', verifyToken.verifyLogin, Controller.editEvent)
    app.post('/deleteEvent', verifyToken.verifyLogin, Controller.deleteEvent)
    app.post('/makeQuestion', verifyToken.verifyLogin, Controller.makeQuestion)
    app.post('/dropQuestion', verifyToken.verifyLogin, Controller.dropQuestion)
    app.post('/getResponses', verifyToken.verifyLogin, Controller.getResponses)
    app.post('/getQuestions', verifyToken.verifyLogin, Controller.getQuestions)
    app.post('/makeNews', verifyToken.verifyLogin, Controller.makeNews)
    app.post('/getNews', verifyToken.verifyLogin, Controller.getNews)
    app.post('/dropNews', verifyToken.verifyLogin, Controller.dropNews)

}