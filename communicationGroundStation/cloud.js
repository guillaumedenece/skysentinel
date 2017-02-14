#!/usr/bin/nodejs

var zmq      = require('zeromq');
var sender   = zmq.socket('push');
var receiver = zmq.socket('pull');

sender.bind("tcp://*:5557", function(error){
	if(error){
		console.log("Failed to bind socket : "+error.message);
		process.exit(0);
	}
	else{
		console.log("Server listening on port 5557");
	}
});


function sendToGS(jsonObj){
	sender.send(jsonObj);
}

receiver.on("message", function(message){
	obj = JSON.parse(message);
	console.log("data recu : " + obj.data);
});

receiver.connect('tcp://192.168.1.12:5556');
console.log("Connecting to server with port 5556");


module.exports.sendToGS = sendToGS;

/*
data = {"data" : "dataFromCloud"}
jsonObj = new Object();
jsonObj.data = "dataFromCloud";
jsonString = JSON.stringify(jsonObj)
setTimeout(function(){
	sender.send(jsonString);

},2000);
*/
