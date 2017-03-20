var express = require('express');
var app = express();
var groundStation = require('./groundStation');
var drone = require('./drone');
var missions = require('./missions')
var admin = require('./admin');

app.use('/groundStation', groundStation);

app.use('/drone', drone);

app.use('/missions', missions);

app.use('/', admin);

module.exports = app;
