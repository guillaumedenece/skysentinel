var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var async = require('async');
var request = require('request')
//var parseString = require('xml2js').parseString;



////////////////////////////////////////////// ALGO PREVISION //////////////////////////////////////////////

var seuilVitesseVent = 15;
var seuilHumidite = 80;
var seuilTemperature = 273.15; 
var dec = 5;

var logGroundStation= require('../models/logGroundStation');
var logDrone= require('../models/logDrone');
var logTakeOff= require('../models/logTakeOff');
var missionPlanned= require('../models/missionPlanned');

var dd = new Date();
var dd2 = new Date(2017,3,13,0,0,0);
console.log(dd);
console.log(dd2);
console.log((dd-dd2)/(60*60*24*1000));



/*
logDrone.find().sort({date: -1}).limit(1).exec(null, function(err, land){
	if(err){throw err;}
	var landed = land[0].landed;
	console.log("test");
	if(!landed)
	{
		console.log("Drone not landed");
	}
	else
	{
		console.log("Drone landed");
		var oldMission = false;
		logTakeOff.find().sort({date: -1}).exec(null, function(err, to){
			if(err){throw err;}
			//.where('time').equals("2017-08-28T13:20:20")
			for(var i=to.length-1; i>=0;i--){
				if(to[i].weatherCond!="Good" || !(to[i].landed))
				{
					var weatherCond = algoWeather(to);
					var missionPlan = to[i].missionPlan;
					var frequency = to[i].frequency;
					var validityDate = to[i].validityDate;
					var GSConcerned = to[i].GSConcerned;
					var missionDescription = to[i].missionDescription;
					console.log("old mission");
					oldMission = true;
					break;
				}
				
			}
			if(!oldMission)
			{
				missionPlanned.find().sort({date: -1}).limit(1).exec(null, function(err, mp){
					if(err){throw err;}
					var weatherCond = algoWeather(mp);
					var missionPlan = mp[0].missionPlan;
					var frequency = mp[0].frequency;
					var validityDate = mp[0].validityDate;
					var GSConcerned = mp[0].GSConcerned;
					var missionDescription = mp[0].missionDescription;
					console.log("new mission");
				});
			}

			var addTO = new logTakeOff();
			addTO.time = new Date();
			addTO.tookOff = true; //a traiter
			addTO.weatherCond = weatherCond;
			addTO.landed = landed;
			addTO.missionPlan = missionPlan;
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
	
	



});
*/

function algoWeather(mission)
{	
	var mission = mission;
	var checksum = 0;

	logGroundStation.find().sort({date: -1}).limit(1).exec(null, function(err, GSLog){
		if(err)
		{
			throw err;
		}
		var weatherdata = GSLog[0].weatherInfos;

		var condition = "Good";
			
		if(weatherdata.rain!=0)
		{
			console.log("il pleut");
			condition = "Il pleut";
		}

		if(weatherdata.wind>seuilVitesseVent)
		{
			console.log("Temps agité");
			condition = "Vent violent";
		}
		if(weatherdata.temperature>seuilTemperature)
		{
			console.log("Temperature non convenable");	
			condition = "Temperature non convenable";
		}	
		if(weatherdata.humidity>seuilHumidite)
		{
			console.log("Humidite non convenable");	
			condition = "Humidite non convenable";
		}
			
		
		if(condition=="Good")
		{
			//send json to GS
		}

		return condition;
		

		
		
	});
}


/*

function algoWeather2(data1,data2)
{	
   
	//console.log(data2);
	var apiMeteo = Object.keys(data1).map(function (key) { return data1[key]; });
	var apiPluie = Object.keys(data2).map(function (key) { return data2[key]; });
	
	
	if(apiPluie[5][0].substring(18,39)=='Pas de précipitations') // il ne pleut pas sur 1h d'apres les previsions
	{
		//weatherData.findOne({ 't' :  0 }, function(err, weatherdata) 
		//{
		//	if (err) {throw err; }
			if(weatherdata['rain']==0) // capteur de pluie detect qu'il ne pleut pas
			{
				console.log("il ne pleut pas (capteur + prevision)");
				//Vol autorisé
			}
			else // capteur de pluie detect qu'il pleut
			{
				console.log("il pleut d'apres le capteur");
				//Vol non autorisé
			}
			
		//});
	}
	else // il pleut dans les 3h d'apres les previsions
	{
		//weatherData.findOne({ 't' :  0 }, function(err, weatherdata) 
		//{
			//if (err) {throw err; }
			if(weatherdata['rain']==0)
			{
				console.log("Il pleut d'apres les previsions");
				//Vol non autorisé
			}
			else
			{
				console.log("il pleut (capteur + previsions)");
				//Vol non autorisé
			}
			
		//});
	}
	
		
	
	
	if(apiMeteo[0+dec]['vent_moyen']['10m']<=seuilVitesseVent) // Vitesse de vent convenable sur 3h d'apres les previsions
	{
		//weatherData.findOne({ 't' :  0 }, function(err, weatherdata) 
		//{
			//if (err) {throw err; }
			if(weatherdata['windSpeed']<=seuilVitesseVent) // anenomètre detecte vitesse de vent convenable
			{
				console.log("Temps calme (capteur + previsions)");
				//Vol autorisé	
			}
			else // anenomètre detecte vitesse de vent non convenable
			{
				console.log("Temps agité d'après le capteur");
				//Vol non autorisé	
			}
			
		//});
	}
	else // Vitesse de vent non convenable sur 3h d'apres les previsions
	{
		//weatherData.findOne({ 't' :  0 }, function(err, weatherdata) 
		//{
			//if (err) {throw err; }
			if(weatherdata['windSpeed']<=seuilVitesseVent) 
			{
				console.log("Temps agité d'après prévisions");
				//Vol non autorisé	
			}
			else
			{
				console.log("Temps agité d'après (capteurs + previsons)");
				//Vol non autorisé	
			}
			
		//});
	}


	if(apiMeteo[0+dec]['humidite']['2m']<=seuilHumidite) // Humidité convenable sur 3h d'apres les previsions
	{
		//weatherData.findOne({ 't' :  0 }, function(err, weatherdata) 
		//{
			//if (err) {throw err; }
			if(weatherdata['humidity']<=seuilHumidite) // capteur detecte humidité convenable
			{
				console.log("Humidite convenable (capteur + previsions)");
				//Vol autorisé	
			}
			else // capteur detecte humidité non convenable
			{
				console.log("Humidite non convenabme d'après le capteur");
				//Vol non autorisé	
			}
			
		//});
	}
	else // Humidité non convenable sur 3h d'apres les previsions
	{
		//weatherData.findOne({ 't' :  0 }, function(err, weatherdata) 
		//{
			//if (err) {throw err; }
			if(weatherdata['humidity']<=seuilHumidite) 
			{
				console.log("Humidite non convenable d'après prévisions");
				//Vol non autorisé	
			}
			else
			{
				console.log("Humidite non convenable(capteurs + previsons)");
				//Vol non autorisé	
			}
			
		//});
	}
	
	if(apiMeteo[0+dec]['temperature']['2m']>=seuilTemperature) // Température convenable sur 3h d'apres les previsions
	{
		//weatherData.findOne({ 't' :  0 }, function(err, weatherdata) 
		//{
			//if (err) {throw err; }
			if(weatherdata['temperature']<=seuilTemperature) // capteur detecte Température convenable
			{
				console.log("Temperature convenable (capteur + previsions)");
				//Vol autorisé	
			}
			else // capteur detecte Température non convenable
			{
				console.log("Temperature non convenable  d'après le capteur");
				//Vol non autorisé	
			}
			
		//});
	}
	else // Température non convenable sur 3h d'apres les previsions
	{
		//weatherData.findOne({ 't' :  0 }, function(err, weatherdata) 
		//{
			//if (err) {throw err; }
			if(weatherdata['temperature']<=seuilTemperature) 
			{
				console.log("temperature non convenable d'après prévisions");
				//Vol non autorisé	
			}
			else
			{
				console.log("temperature non convenable d'après (capteurs + previsons)");
				//Vol non autorisé	
			}
			
		//});
	}
	
	
	
}

var urls = ['http://www.infoclimat.fr/public-api/gfs/json?_ll=48.85341,2.3488&_auth=BhxSRQJ8VXdUeVBnAXcBKANrUmcIfgMkVytVNglsUy5TOABhUjIHYVM9B3pXeAo8BypVNl5lUmIAawtzDH4EZQZsUj4CaVUyVDtQNQEuASoDLVIzCCgDJFc8VToJelMxUzkAZVIvB2RTOAdlV3kKPQc3VSpeflJrAGcLZAxhBGIGZFIwAmJVP1Q%2FUC0BLgEwAzhSMQhiA25XN1UwCWRTYlMxAGRSNwdlUzsHe1dvCjcHMlU8XmJSbQBgC20MfgR4BhxSRQJ8VXdUeVBnAXcBKANlUmwIYw%3D%3D&_c=a5313e9dede01fc88fa3fbcb0aa92e18',
 'http://www.meteofrance.com/mf3-rpc-portlet/rest/pluie/751010'];


async.map(urls, function(url, callback) {
	request(url, function(error, response, html) {
		callback(error, html);
  });
}, function(err, results) {
	algoWeather(JSON.parse(results[0]),JSON.parse(results[1]));
	
})*/
	












////////////////////////////////////////////////////////////////////////////////////////////////



/*module.exports = app;*/
