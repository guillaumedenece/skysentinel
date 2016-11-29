var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var GSInfos = require("./GSInfos/index.js");

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();


app.get('/', function (req, res) {
   res.send('Hello World');
   console.log("get request received");
})

app.post('/', urlencodedParser, function (req, res) {
   res.send('Hello World');
   console.log("POST");
   console.log(req.body.first_name);
})

app.post('/GSInfos', jsonParser, GSInfos.inputs.receive);

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http:// %s:%s", host, port)
})


//request post exemple:
//curl --data "{"doorPosition": "open"}" http://127.0.0.1:3000/GSInfos
//curl -H "Content-Type: application/json" -X POST -d '{"doorPosition": "open","batteryInfos": {"voltage": {"one": "12,1","two": "11,6","three": "9,5"}}}' http://localhost:3000/GSInfos
