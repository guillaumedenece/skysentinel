var express = require('express');
var app = express();
var missionGenerator = require('./missionGenerator');

app.use('/missionGenerator', missionGenerator);

module.exports = app;
