var express = require('express');
var app = express();
var groundStation = require('./groundStation');
var drone = require('./drone');
var admin = require('./admin');

app.use('/groundStation', groundStation);

app.use('/drone', drone);

app.use('/', admin);

module.exports = app;
