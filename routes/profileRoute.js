var Controller = require('../controllers/accountController');
var verifyToken = require('../middlewares/verifyToken');
module.exports = function(app, uploader) {


    app.post('/account', verifyToken.verifyLogin, Controller.myAccount)
    app.put('/updateAccount', verifyToken.verifyLogin, Controller.editUser)
    app.post('/addPicture', uploader.single('image'), Controller.addPicture)
    app.put('/updatePassword', verifyToken.verifyLogin, Controller.editPassword)
    app.post('/deleteUser', verifyToken.verifyLogin, Controller.deleteUser)

}