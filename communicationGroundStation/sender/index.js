#!/usr/bin/nodejs

var zmq      = require('zeromq');
var sender   = zmq.socket('push');


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

module.exports.sendToGS = sendToGS;
