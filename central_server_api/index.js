var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var GSInfos = require("./GSInfos/index.js");

var jsonParser = bodyParser.json();


app.post('/GSInfos', jsonParser, GSInfos.inputs.receive);

var server = app.listen(8000, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http:// %s:%s", host, port)
})
