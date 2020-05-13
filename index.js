const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv/config');

// Configuracion para acceder a la base de datos en MongoDB
mongoose.connect(process.env.MONGO_CONNECTION +
    process.env.MONGO_USER + ':' +
    process.env.MONGO_PASS + '@' +
    process.env.MONGO_HOST + ':' +
    process.env.MONGO_PORT + '/' +
    process.env.MONGO_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

// Configuracion para acceder a la base de datos en MySQL
const db = require('./db/config');

db.authenticate()
    .catch(err => console.log(err))

const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('./routes/signInRoute')(app);
require('./routes/signUpRoute')(app);
require('./routes/recoveryPassRoute')(app);
require('./routes/homeRoute')(app);
require('./routes/profileRoute')(app);
require('./routes/wellnessRoute')(app);

app.listen(process.env.PORT, console.log(process.env.PORT))