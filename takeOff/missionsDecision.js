var ObjectID = require('mongodb').ObjectId;
// var sleep = require('sleep');


////////////////////////////////////////////// ALGO PREVISION //////////////////////////////////////////////

var seuilVitesseVent = 15;
var seuilHumidite = 92;
var seuilTemperature = 0;
available = true;

var communicationGroundStation = require('../communicationGroundStation/sender/index.js');


 logGroundStation= require('../models/logGroundStation');
var logTakeOff= require('../models/logTakeOff');
var missionPlanned= require('../models/missionPlanned');


function takeOffDecision(){
	missionPlanned.find().sort({validityDate: 1}).limit(1).exec(null, function(err, mp){
		if(err){throw err;}
		if(mp[0]==undefined){console.log("No mission at all");}
		else if(Date.parse(mp[0].validityDate) < Date.parse(new Date())) {
			validityDate = mp[0].validityDate
  			frequency = mp[0].frequency
			GSConcerned = mp[0].GSConcerned;
			missionDescription = mp[0].missionDescription;
			missionData = mp[0].missionData;
			idMissionPlanned = mp[0]._id;
			logGroundStation.find().sort({time: -1}).limit(1).exec(null, function(err, GSLog){
				if(err){throw err;}
				var mission = new Object();
				mission.commandTarget = "drone";
				mission.commandType = "mission";
				var objectId = 	new ObjectID();
				var idMission = mp[0]._id;
				mission.missionData = mp[0].missionData;
				mission.timeLimit = Date.now()+10*60*1000;

				var jsonString = JSON.stringify(mission);
				communicationGroundStation.sendToGS(jsonString);

				console.log("New mission sent [" + new Date()+"]");

				var addTO = new logTakeOff();

				addTO.idMission = idMission;
				addTO.time = new Date();
				addTO.weatherCond = algoWeather(GSLog);
				addTO.launched = true;
				addTO.missionData = missionData;
				addTO.frequency = frequency;
				addTO.validityDate = validityDate;
				addTO.GSConcerned = GSConcerned;
				addTO.missionDescription = missionDescription;


				addTO.save(function(err){
				    if(err){
				      console.log(err);
				    }

		  		});



				if(frequency==0)
				{
					missionPlanned.remove().where('_id').equals(idMissionPlanned).exec(null, function(err){
						if(err){throw err;}
						console.log("remove in Mission Table(no frequency)");
					});
				}
				else
				{
					missionPlanned.update({_id: idMissionPlanned},{$set : {validityDate : new Date(Date.parse(validityDate)+frequency*60*60*1000)}},function(err){
						if(err){throw err;}
						console.log("update in Mission Table(frequency : " + frequency +")" );
					});


				}
			});



		}
	});
}


function algoWeather(GSLog)
{
	var weatherdata = GSLog[0].weatherInfos;
	var weatherCond = new Object();
	weatherCond.rain = true;
	weatherCond.wind = true;
	weatherCond.humidity = true;
	weatherCond.temperature = true;

	if(weatherdata.rain==true)
	{
		console.log("il pleut");
		weatherCond.rain = false;
	}

	if(weatherdata.wind>seuilVitesseVent)
	{
		console.log("Temps agité");
		weatherCond.wind = false;
	}
	if(weatherdata.temperature<seuilTemperature)
	{
		console.log("Temperature non convenable");
		weatherCond.temperature = false;
	}
	if(weatherdata.humidity>seuilHumidite)
	{
		console.log("Humidite non convenable");
		weatherCond.humidity = false;
	}

	return weatherCond;

}


////////////////////////////////////////////////////////////////////////////////////////////////



module.exports.takeOffDecision = takeOffDecision;
