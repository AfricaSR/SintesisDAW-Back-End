var Controller = require('../controllers/wellnessController');
var verifyToken = require('../middlewares/verifyToken');
module.exports = function(app) {
    app.post('/userWellness', verifyToken.verifyLogin, Controller.userWellness)
    app.get('/wellness/alergenics', Controller.wellnessAList)
    app.get('/wellness/diversity', Controller.wellnessDList)
    app.put('/updateWellness', verifyToken.verifyLogin, Controller.updateWellness)
    app.post('/updateAlFromEvent', verifyToken.verifyLogin, Controller.updateAlFromEvent)
    app.post('/updateFuFromEvent', verifyToken.verifyLogin, Controller.updateFuFromEvent)
}