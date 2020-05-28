const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require('socket.io');
const multer = require('multer');
require('dotenv/config');

// Configuracion para acceder a la base de datos en MongoDB
mongoose.connect(process.env.MONGO_CONNECTION +
    process.env.MONGO_USER + ':' +
    process.env.MONGO_PASS + '@' +
    process.env.MONGO_HOST + ':' +
    process.env.MONGO_PORT + '/' +
    process.env.MONGO_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
);

// Configuracion para acceder a la base de datos en MySQL
const db = require('./models/db');

const app = express();
const storage = multer.diskStorage({
    destination: function(req, file, cb) { //Indica la carpeta de destino
        cb(null, path.join(__dirname, '/public/uploads'));
    },
    filename: function(req, file, cb) { //Indica el nombre del archivo
        cb(null, `${file.originalname}`);
    }
});
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uploader = multer({ storage: storage }); //Se guardara la imagen en el servidor
app.use(express.static(path.join(__dirname, '/public'))); //Directorio para archivos staticos
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); //Directorio de imagenes
app.use('/EvenfyLe', express.static(path.join(__dirname, '/EvenfyLe'))); //Directorio del programa de Escritorio

require('./routes/signInRoute')(app);
require('./routes/signUpRoute')(app);
require('./routes/recoveryPassRoute')(app);
require('./routes/homeRoute')(app);
require('./routes/profileRoute')(app, uploader);
require('./routes/wellnessRoute')(app);
require('./routes/eventRoute')(app);
require('./routes/attendeesRoute')(app);
require('./routes/dashboardRoute')(app);

const server = app.listen(process.env.PORT, () => {
    db.main();
})

require('./routes/socketRoute')(socket, server, app);
require('./controllers/timerController')(app);