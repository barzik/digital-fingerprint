'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const api = require('./api');
const i18n = require('./locales/i18n');

app.set('view engine', 'ejs');
app.listen(port);

app.use(express.static('static-resources'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(i18n);


app.use('/api', api);
app.get('/', (req, res) => {
  res.render('index');
});

module.exports = app;
