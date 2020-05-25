var Controller = require('../controllers/socketController');
var verifyToken = require('../middlewares/verifyToken');
module.exports = function(socket, server, app) {
    const io = socket.listen(server);
    io.sockets.on('connection', (socket) => {

        if (socket.handshake.query.idEvent) {
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
        } else if (socket.handshake.query.token) {

            Controller.getNotifications(socket.handshake.query.token).then(notifications => {
                io.sockets.emit('sendNotifications', notifications)
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

    app.post('/viewNotifications', (req, res) => {
        Controller.viewNotifications(req.body.token).then(notifications => {
            io.sockets.emit('viewNotifications')
            return res.status(200).json({ msg: 'ok' })
        })
    })

    app.post('/postNews', (req, res) => {
        Controller.postNewsNotification(req.body.idEvent, req.body.title).then(notifications => {
            io.sockets.emit('sendNews')
            return res.status(200).json({ msg: 'ok' })
        })
    })

    app.post('/postAttend', (req, res) => {
        Controller.postAttend(req.body.idEvent, req.body.user).then(notifications => {
            io.sockets.emit('sendAttends')
            return res.status(200).json({ msg: 'ok' })
        })
    })

    app.post('/postWellness', (req, res) => {
        Controller.postWellness(req.body.token).then(notifications => {
            io.sockets.emit('sendWellness')
            return res.status(200).json({ msg: 'ok' })
        })
    })

    app.post('/eventUnavailable', (req, res) => {
        Controller.eventUnavailable(req.body.idEvent).then(notifications => {
            io.sockets.emit('sendUnavailable')
            return res.status(200).json({ msg: 'ok' })
        })
    })

    app.post('/eventNewQuestion', (req, res) => {
        Controller.eventNewQuestion(req.body.idEvent, req.body.title).then(notifications => {
            io.sockets.emit('sendNewQuestions')
            return res.status(200).json({ msg: 'ok' })
        })
    })

    app.post('/postReponses', (req, res) => {

        Controller.postReponses(
            req.body.idUser,
            req.body.title,
            req.body.name,
            req.body.surname).then(notifications => {
            io.sockets.emit('sendResponses')
            return res.status(200).json({ msg: 'ok' })
        })
    })


}