var Controller = require('../controllers/chatController');
var verifyToken = require('../middlewares/verifyToken');
module.exports = function(socket, server, app) {
    const io = socket.listen(server);
    io.sockets.on('connection', (socket) => {
        let idEvent = socket.handshake.query.idEvent.split(',')[0];
        let idAttend = socket.handshake.query.idEvent.split(',')[1];

        Controller.getChatMessages(idEvent, idAttend).then(messages => {
            io.emit('messages', messages)

        })

    })

    app.post('/sendMessage', (req, res) => {
        Controller.saveMessage(req.body.idEvent, req.body.idAttend, req.body.message).then(messages => {
            io.emit('sendMessage', (messages))
            res.status(200)
        })

    })

    app.post('/getChats', verifyToken.verifyLogin, Controller.getChats)








}