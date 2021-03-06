var zmq      = require('zeromq');
var receiver = zmq.socket('pull');
var logGroundStation = require('../../models/logGroundStation');
var missionPlanned = require('../../models/missionPlanned');
var logDrone = require('../../models/logDrone');
var io = require('../../socket/io.js');

receiver.on("message", function(message){

	obj = JSON.parse(message);
	// console.log("\npaquet reçu\n" + JSON.stringify(obj) + "\n");

	console.log(obj.subject);

	//if the subject is the groundStation
	if(obj.subject == "groundStation")
	{
		console.log("log groundStation received");

		//avoid crash if an element is missing
		if(obj.batteriesInfos && obj.batteriesInfos[1] && obj.batteriesInfos[2] && obj.batteriesInfos[3] && obj.weatherInfos)
		{
			var log = new logGroundStation();
			log.idGroundStation = obj.idGroundStation;
			log.time = new Date(obj.time);
			log.elevatorState = obj.elevatorState;
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
			log.boxInfos.humidity = obj.boxInfos.humidity;
			log.boxInfos.temperature = obj.boxInfos.temperature;
			log.boxInfos.pressure = obj.boxInfos.pressure;

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

			//sends the information in real time to the client
			io.emit('logGroundStation', obj);
			console.log("logGroundStation sent to user\n");
		}
	}

	if(obj.subject == "drone"){
		console.log("log drone received");

		var log = new logDrone();

		log.idMission = obj.idMission;
		log.time = obj.time;
		if(obj.position){
			log.position.latitude = obj.position.latitude;
			log.position.longitude = obj.position.longitude;
			log.position.altitude = obj.position.altitude;
		}
		log.batteryLevel = obj.batteryLevel;
		log.landed = obj.landed;

		console.log("data received:" + log);

		//saves in the database
		log.save(function(err){
			if(err){
				console.log(err); //res.send("error")
			}
			else {
				console.log("log drone saved in the database");
			}
		})

		missionPlanned.find({"_id": obj.idMission}).limit(1).exec(null, function(err, mission){

			var liveDroneInfo = new Object();

			liveDroneInfo.time = log.time;
			liveDroneInfo.idMission = log.idMission;
			liveDroneInfo.batteryLevel = log.batteryLevel;
			liveDroneInfo.landed = log.landed;
			liveDroneInfo.position = new Object();
			liveDroneInfo.position.latitude = log.position.latitude;
			liveDroneInfo.position.longitude = log.position.longitude;
			liveDroneInfo.position.altitude = log.position.altitude;


			if(log.idMission != "none"){
				//if a mission matching the mission in the logDrone is found
				if(mission){
					//if that mission has a title
					if(mission[0].missionTitle){
						liveDroneInfo.missionTitle = mission[0].missionTitle;
					}
					//if that mission has no title
					else{
						liveDroneInfo.missionTitle = "Title";
					}
				}
				//if no mission matches the mission in the logDrone
				else{
					liveDroneInfo.missionTitle = "Title";
				}
			}
			else{
				liveDroneInfo.missionTitle = "No mission loaded";
			}

			//sends the information in real time to the client
			io.emit('logDrone', liveDroneInfo);
			console.log("message sent to user\n" + JSON.stringify(liveDroneInfo));

		})

	}


});

receiver.connect('tcp://192.168.31.152:5556');
// receiver.connect('tcp://127.0.0.1:5556');
console.log("Connecting to server with port 5556");
