var Controller = require('../controllers/dashboardController');
var verifyToken = require('../middlewares/verifyToken');
module.exports = function(app) {

    app.post('/getEventsNews', verifyToken.verifyLogin, Controller.getEventsNews)
    app.post('/getEventsTimeline', verifyToken.verifyLogin, Controller.getEventsTimeline)

}