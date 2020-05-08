const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
require('dotenv/config');


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



app.listen(process.env.PORT, console.log(process.env.PORT))