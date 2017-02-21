var zmq      = require('zeromq');
var receiver = zmq.socket('pull');
var logGroundStation = require('../../models/logGroundStation');
 var io = require('../../socket/io.js');

receiver.on("message", function(message){

	obj = JSON.parse(message);
	console.log("\npaquet reçu\n" + JSON.stringify(obj) + "\n");

	//if the subject is the groundStation
	if(obj.subject == "groundStation")
	{
		//avoid crash if an element is missing
		if(obj.batteriesInfos && obj.batteriesInfos[1] && obj.batteriesInfos[2] && obj.batteriesInfos[3] && obj.weatherInfos)
		{
			var log = new logGroundStation();
			log.idGroundStation = obj.idGroundStation;
		  log.date = obj.date;
		  log.doorState = obj.doorState;
		  log.batteriesInfos = new Array();
		  log.batteriesInfos[0] = new Object();
		  log.batteriesInfos[1] = new Object();
		  log.batteriesInfos[2] = new Object();
		  log.batteriesInfos[3] = new Object();
		  log.batteriesInfos[0].batterySlot = obj.batteriesInfos[0].batterySlot;
		  log.batteriesInfos[0].batteryVoltage = obj.batteriesInfos[0].batteryVoltage;
		  log.batteriesInfos[0].batteryPresence = obj.batteriesInfos[0].batteryPresence;
		  log.batteriesInfos[1].batterySlot = obj.batteriesInfos[1].batterySlot;
		  log.batteriesInfos[1].batteryVoltage = obj.batteriesInfos[1].batteryVoltage;
		  log.batteriesInfos[1].batteryPresence = obj.batteriesInfos[1].batteryPresence;
		  log.batteriesInfos[2].batterySlot = obj.batteriesInfos[2].batterySlot;
		  log.batteriesInfos[2].batteryVoltage = obj.batteriesInfos[2].batteryVoltage;
		  log.batteriesInfos[2].batteryPresence = obj.batteriesInfos[2].batteryPresence;
		  log.batteriesInfos[3].batterySlot = obj.batteriesInfos[3].batterySlot;
		  log.batteriesInfos[3].batteryVoltage = obj.batteriesInfos[3].batteryVoltage;
		  log.batteriesInfos[3].batteryPresence = obj.batteriesInfos[3].batteryPresence;
		  log.weatherInfos.rain = obj.weatherInfos.rain;
		  log.weatherInfos.wind = obj.weatherInfos.wind;
		  log.weatherInfos.humidity = obj.weatherInfos.humidity;
		  log.weatherInfos.temperature = obj.weatherInfos.temperature;

			console.log("data received:" + log);

			//saves in the database
		  log.save(function(err){
		    if(err){
		      console.log(err); //res.send("error")
		    }
		    else {
		      console.log("log groundStation saved in the database");
		    }
		  })

			// io.emit('message', 'information about the database received');
			// console.log("message sent to user\n");

		}
	}

  io.emit('message', 'information about the database received');
  console.log("message sent to user\n");


});

receiver.connect('tcp://127.0.0.1:5556');
console.log("Connecting to server with port 5556");
