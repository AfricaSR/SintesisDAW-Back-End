const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv/config');
//process.env.DB...

const db = require('./db/config');

db.authenticate()
    .catch(err => console.log(err))

const app = express();

require('./routes/signInRoute')(app);
require('./routes/signUpRoute')(app);
require('./routes/recoveryPassRoute')(app);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(process.env.PORT, console.log(process.env.PORT))