var express = require('express');
var app = express();
var actions = require('./actions');
var informations = require('./informations');

app.use('/actions', actions);

app.use('/informations', informations);

// app.use('/informations', informations);

module.exports = app;
