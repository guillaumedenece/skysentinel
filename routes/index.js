var express = require('express');
var app = express();
var groundStation = require('./groundStation');
var admin = require('./admin');

app.use('/groundStation', groundStation);

app.use('/', admin);

module.exports = app;
