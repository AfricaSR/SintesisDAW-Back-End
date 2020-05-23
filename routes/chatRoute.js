var Controller = require('../controllers/chatController');
var verifyToken = require('../middlewares/verifyToken');
module.exports = function(socket, server, app) {
    const io = socket.listen(server);
    io.sockets.on('connection', (socket) => {

        if (socket.handshake.query.idEvent.split(',').length == 2) {
            let idEvent = socket.handshake.query.idEvent.split(',')[0];
            let idAttend = socket.handshake.query.idEvent.split(',')[1];

            Controller.getChatMessages(idEvent, idAttend).then(messages => {

                socket.emit('messages', messages['chats'].find(x => x.idAttend == idAttend))
            }).catch(err => {
                return err
            })
        } else if (socket.handshake.query.idEvent.split(',').length == 3) {
            let idEvent = socket.handshake.query.idEvent.split(',')[0];
            let idAttend = socket.handshake.query.idEvent.split(',')[1];
            let viewed = socket.handshake.query.idEvent.split(',')[2];

            Controller.viewChatMessages(idEvent, idAttend, viewed).then(messages => {

                socket.emit('viewed', messages)

            }).catch(err => {
                return err
            })
        }


    })

    app.post('/sendMessage', (req, res) => {
        Controller.saveMessage(req.body.idEvent, req.body.idAttend, req.body.message).then(() => {

            io.sockets.emit('sendMessage')
            return res.status(200).json({ msg: 'ok' })
        })

    })


    app.post('/getChats', verifyToken.verifyLogin, Controller.getChats)

    app.post('/getChat', verifyToken.verifyLogin, Controller.getChat)








}