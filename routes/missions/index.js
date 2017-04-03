var express = require('express');
var app = express();
var missionGenerator = require('./missionGenerator');
var missionManager = require('./missionManager');

app.use('/missionGenerator', missionGenerator);

app.use('/missionManager', missionManager);

module.exports = app;
