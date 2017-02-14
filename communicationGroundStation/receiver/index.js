var zmq      = require('zeromq');
var receiver = zmq.socket('pull');

receiver.on("message", function(message){

	obj = JSON.parse(message);

	// if(obj.subject == "groundStation")
	// {
	// 	console.log("Paul est beau");
	// }


	console.log("data recu : " + obj.data);
});

receiver.connect('tcp://192.168.1.12:5556');
console.log("Connecting to server with port 5556");
