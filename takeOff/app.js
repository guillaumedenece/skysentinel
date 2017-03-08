var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var async = require('async');
var request = require('request')
var ObjectID = require('mongodb').ObjectId;
var sleep = require('sleep');




////////////////////////////////////////////// ALGO PREVISION //////////////////////////////////////////////

var seuilVitesseVent = 15;
var seuilHumidite = 92;
var seuilTemperature = 273.15; 

var communicationGroundStation = require('../communicationGroundStation/sender/index.js');

var logGroundStation= require('../models/logGroundStation');
var logDrone= require('../models/logDrone');
var logTakeOff= require('../models/logTakeOff');
var missionPlanned= require('../models/missionPlanned');


var urls = ['http://www.infoclimat.fr/public-api/gfs/json?_ll=48.884416,2.296728&_auth=BhxSRQJ8VXdUeVBnAXcBKANrUmcIfgMkVytVNglsUy5TOABhUjIHYVM9B3pXeAo8BypVNl5lUmIAawtzDH4EZQZsUj4CaVUyVDtQNQEuASoDLVIzCCgDJFc8VToJelMxUzkAZVIvB2RTOAdlV3kKPQc3VSpeflJrAGcLZAxhBGIGZFIwAmJVP1Q%2FUC0BLgEwAzhSMQhiA25XN1UwCWRTYlMxAGRSNwdlUzsHe1dvCjcHMlU8XmJSbQBgC20MfgR4BhxSRQJ8VXdUeVBnAXcBKANlUmwIYw%3D%3D&_c=a5313e9dede01fc88fa3fbcb0aa92e18',
 'http://www.meteofrance.com/mf3-rpc-portlet/rest/pluie/751010'];

function repeat(urls) //fonction à appeler avec setIntervall
{
	async.map(urls, function(url, callback) {
		request(url, function(error, response, html) {
			callback(error, html);
	  });
	}, function(err, results) {
		var weatherPrevInfo = algoPrevWeather(JSON.parse(results[0]),JSON.parse(results[1]));
		takeOffDecision(weatherPrevInfo);
	});
}



function takeOffDecision(weatherPrevInfo)
{

logDrone.find().sort({time: -1}).limit(1).exec(null, function(err, lg){
	if(err){throw err;}
	var landed = lg[0].landed;
	var idMission = lg[0].idMission;
	
	if(idMission == "none" && landed == true) 
	{
		var available = true;
		console.log("Drone available [" + new Date() + "] ");
	}
	else
	{
		var available = false;
		console.log("Drone not available");
	}

	
	console.log("Drone landed");
	var oldMission = false;
	var actualDate = new Date();
	logTakeOff.aggregate(
		{$match:{time: {$gt: new Date(actualDate.getFullYear(),actualDate.getMonth(),actualDate.getDate()-1
		, actualDate.getHours())}}}, {$group:{"_id": "$idMission", "time": {"$max": "$time"}
		, weatherCond: {$first :"$weatherCond"},launched: {$first :"$launched"}
		, available: {$first : "$available"}, missionData: {$first : "$missionData"}
		, frequency: {$first : "$frequency"}, validityDate: {$first : "$validityDate"}
		, GSConcerned: {$first : "$GSConcerned"}
		, missionDescription: {$first : "$missionDescription"}}},{$sort: {time: -1}}, function(err,to){
		if(err){throw err;}
		for(var i=to.length-1; i>=0;i--){ 
			if((!(to[i].weatherCond.rain) || !(to[i].weatherCond.wind) || !(to[i].weatherCond.humidity) || !(to[i].weatherCond.temperature)) || !(to[i].launched) || !(to[i].available))
			{
				console.log("logTakeOff reseach");
				logGroundStation.find().sort({time: -1}).limit(5).exec(null, function(err, GSLog){
						if(err){throw err;}
						var idMission = to[i]._id;
						var missionData = to[i].missionData;
						var weatherCond = algoWeather(idMission, missionData, GSLog, weatherPrevInfo);
						var frequency = to[i].frequency; 
						var validityDate = to[i].validityDate;
						var GSConcerned = to[i].GSConcerned;
						var missionDescription = to[i].missionDescription;
						var missionOk = false;
						if(weatherCond.rain && weatherCond.wind && weatherCond.humidity && weatherCond.temperature && available)
						{
							//{idMission: idMission, missionData : missionData, timeLimit : 5 }
							//send json to GS
							var mission = new Object();

							mission.idMission = idMission;
							mission.missionData = missionData;
							mission.timeLimit = 5;

							// send action to the GS
							var jsonString = JSON.stringify(mission);
							communicationGroundStation.sendToGS(jsonString);
							missionOk = true;
							console.log("Old mission sent");
						}

						if(missionOk)
						{
							console.log("mission tentative ...");
							//time.sleep(5*60);
							sleep.sleep(1*20);
						
							logDrone.find().sort({time: -1}).where("idMission").equals(idMission).limit(1).exec(null, function(err, backLog){
								if(err){throw err;}
								if(backLog[0] == undefined)
								{
									var launched = false;
									var available = false;
									console.log("Not mission !");
								}
								else if(!backLog[0].landed)
								{
									var launched = true;
									var available = false;
									console.log("mission correctly launched");
								}
								else
								{
									var launched = false;
									var available = true;
									console.log("Drone not launched by mistake");
								}
								

								var addTO = new logTakeOff();

								addTO.idMission = idMission;
								addTO.time = new Date();
								addTO.weatherCond = weatherCond;
								addTO.launched = launched;
								addTO.available = available;
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
							
							});
						}
						else{
							console.log("mission not sent !");

							logTakeOff.find({idMission : idMission, weatherCond: weatherCond
							,launched: false, available: available, validityDate: validityDate}
							, function(err, existingLogTO)
							{
								if(existingLogTO[0] == undefined)
								{
									var addTO = new logTakeOff();

									addTO.idMission = idMission;
									addTO.time = new Date();
									addTO.weatherCond = weatherCond;
									addTO.launched = false;
									addTO.available = available;
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
								}
								else
								{
									logTakeOff.update({idMission : idMission
									, weatherCond: weatherCond
									,launched: false, available: available
									, validityDate: validityDate},{$set :{time: new Date()}}
									,function(err){
										if(err){throw err;}	
									});
								}	
								
							});

							

						}

						
				});

				oldMission = true;
				break;
			}
			
		}
		if(!oldMission)
		{
			missionPlanned.find().sort({validityDate: 1}).limit(1).exec(null, function(err, mp){ //de la plus vieille a la plus recente
				if(err){throw err;}
				if(mp[0]==undefined){console.log("No mission in missionPlanned Table !");}
				else if(Date.parse(mp[0].validityDate) < Date.parse(new Date())) // si l'heure de mission de la plus vieille est supérieure a la date actuelle
				{
					logGroundStation.find().sort({time: -1}).limit(5).exec(null, function(err, GSLog){
						if(err){throw err;}
						console.log("Mission Planned reseach");						
						var idMissionPlanned = mp[0]._id;
						var objectId = 	new ObjectID();					
						var idMission = objectId.toHexString();
						//var idMission = "7";							
						var missionData = mp[0].missionData;
						var weatherCond = algoWeather(idMission, missionData, GSLog, weatherPrevInfo);
						var frequency = mp[0].frequency; //condition1
						var validityDate = mp[0].validityDate;
						var GSConcerned = mp[0].GSConcerned;
						var missionDescription = mp[0].missionDescription;
						var missionOk =false;

						if(weatherCond.rain && weatherCond.wind && weatherCond.humidity && weatherCond.temperature && available)
						{
							//{idMission: idMission, missionData : missionData, timeLimit : 5 }
							//send json to GS
							var mission = new Object();

							mission.idMission = idMission;
							mission.missionData = missionData;
							mission.timeLimit = 5;

							// send action to the GS
							var jsonString = JSON.stringify(mission);
							communicationGroundStation.sendToGS(jsonString);
							missionOk = true;
							console.log("New mission sent");
						}

						if(missionOk)
						{
							console.log("mission tentative ...");
							//time.sleep(5*60);
							sleep.sleep(20);
					
							logDrone.find().sort({time: -1}).where("idMission").equals(idMission).limit(1).exec(null, function(err, backLog){
								if(err){throw err;}
								if(backLog[0] == undefined)
								{
									var launched = false;
									var available = false;
									console.log("No mission !");
								}
								else if(!backLog[0].landed)
								{
									var launched = true;
									var available = false;
									console.log("mission correctly launched");
								}
								else
								{
									var launched = false;
									var available = true;
									console.log("Drone not launched by mistake");
								}
								

								var addTO = new logTakeOff();

								addTO.idMission = idMission;
								addTO.time = new Date();
								addTO.weatherCond = weatherCond;
								addTO.launched = launched;
								addTO.available = available;
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
						
							});
						}
						else{
							console.log("mission not launched !");
							var addTO = new logTakeOff();

							addTO.idMission = idMission;
							addTO.time = new Date();
							addTO.weatherCond = weatherCond;
							addTO.launched = false;
							addTO.available = available;
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

						}	
					
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
								console.log("update in Mission Table(frequency)");
							});

						}						

					});
				}
			});
		}						
	});
	
});
}

function algoWeather(idMission, missionData, GSLog, weatherPrevInfo)
{	
	var weatherdata = GSLog[0].weatherInfos;

	var windAVG = 0;
	for(var i=0; i<5;i++) {windAVG += GSLog[i].weatherInfos.wind;}
	windAVG = windAVG/5;

	var weatherCond = new Object();
	weatherCond.rain = true;
	weatherCond.wind = true;
	weatherCond.humidity = true;
	weatherCond.temperature = true;		

	if(weatherdata.rain!=0)
	{
		console.log("il pleut");
		weatherCond.rain = false; 
	}

	if(windAVG>seuilVitesseVent)
	{
		console.log("Temps agité");
		weatherCond.wind = false; 
	}
	if(weatherdata.temperature>seuilTemperature)
	{
		console.log("Temperature non convenable");	
		weatherCond.temperature = false; 
	}	
	if(weatherdata.humidity>seuilHumidite)
	{
		console.log("Humidite non convenable");	
		weatherCond.humidity = false; 
	}

	weatherCond.rain = (weatherCond.rain && weatherPrevInfo.rain);
	weatherCond.wind = (weatherCond.wind && weatherPrevInfo.wind);
	weatherCond.humidity = (weatherCond.humidity && weatherPrevInfo.humidity);
	weatherCond.temperature = (weatherCond.temperature && weatherPrevInfo.temperature);
	

	return weatherCond;
		
}

function algoPrevWeather(data1,data2)
{	
	var keys = Object.keys(data1);

	//var actualDate = Date.parse(new Date(2017, 3-1, 10, 10+1, 30));
	var actualDate = Date.now();	
	for(var i=5;i<10;i++)
	{
		if(actualDate > Date.parse(keys[i]) && actualDate < Date.parse(keys[i+1]))
		{
			var key = keys[i];
		}

	}

	var apiMeteo = data1[key];
	
	var apiPluie = Object.keys(data2).map(function (key) { return data2[key]; });

	var weatherPrevInfo = new Object();

	

	weatherPrevInfo.rain = true;
	weatherPrevInfo.wind = true;
	weatherPrevInfo.humidity = true;
	weatherPrevInfo.temperature = true;

	
	if(apiPluie[5][0].substring(18,39)!='Pas de précipitations')
	{ 
		console.log("[Prev]Pluie");
		weatherPrevInfo.rain = false;
	}
	if(apiMeteo['vent_moyen']['10m']>seuilVitesseVent)
	{
		console.log("[Prev]Vent fort");
		weatherPrevInfo.wind = false;
	}
	if(apiMeteo['humidite']['2m']>seuilHumidite)
	{
		console.log("[Prev]humidite non correct");
		weatherPrevInfo.humidity = false;
	}
	if(apiMeteo['temperature']['2m']<seuilTemperature)
	{
		console.log("[Prev]temperature non correct");
		weatherPrevInfo.temperature = false;
	}
	
	return weatherPrevInfo;
}

setInterval(function(){repeat(urls);}, 3000);


////////////////////////////////////////////////////////////////////////////////////////////////



/*module.exports = app;*/
