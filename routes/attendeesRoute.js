var Controller = require('../controllers/attendeesController');
var verifyToken = require('../middlewares/verifyToken');
module.exports = function(app) {

    app.post('/createAttend', verifyToken.verifyLogin, Controller.createAttend)


}