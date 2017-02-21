var express = require('express');
var app = express();
var groundStation = require('./groundStation');

app.use('/groundStation', groundStation);

module.exports = app;
