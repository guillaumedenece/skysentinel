var express = require('express');
var router = express.Router();
var logGroundStation = require('../models/logGroundStation');
var communicationGroundStation = require('../communicationGroundStation/sender/index.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  logGroundStation.find().sort({date: -1}).limit(1).exec(null, function(err, results){
    if(err)
    {
      throw err;
    }

    console.log(results);
    res.send(results);
    })
});

router.get('/sendtogs', function(req, res, next){
  var jsonObj = new Object();
  jsonObj.flight = true;
  var jsonString = JSON.stringify(jsonObj);
  communicationGroundStation.sendToGS(jsonString);
  res.send("sent");
});

router.get('/insert', function(req, res) {
  // res.render('index', { title: 'Express' });

  var log = new logGroundStation();
  log._id="lolygoouerererguih";
  log.idGroundStation = "1";
  log.date = "2012-05-18T16:00:00Z";
  log.doorState = "open";
  log.batteriesInfos = new Array();
  log.batteriesInfos[0] = new Object();
  log.batteriesInfos[1] = new Object();
  log.batteriesInfos[2] = new Object();
  log.batteriesInfos[3] = new Object();
  log.batteriesInfos[0].batterySlot = '0';
  log.batteriesInfos[0].batteryVoltage = '11';
  log.batteriesInfos[0].batteryPresence = true;
  log.batteriesInfos[1].batterySlot = '1';
  log.batteriesInfos[1].batteryVoltage = '11';
  log.batteriesInfos[1].batteryPresence = true;
  log.batteriesInfos[2].batterySlot = '2';
  log.batteriesInfos[2].batteryVoltage = '11';
  log.batteriesInfos[2].batteryPresence = true;
  log.batteriesInfos[3].batterySlot = '3';
  log.batteriesInfos[3].batteryVoltage = '11';
  log.batteriesInfos[3].batteryPresence = true;
  log.weatherInfos.rain = true;
  log.weatherInfos.wind = '22';
  log.weatherInfos.humidity = '23';
  log.weatherInfos.temperature = '24';

  log.save(function(err){
    if(err)
    {console.log(err); res.send("erreur") }
    else {
      res.send("succes");
    }
  })
});

module.exports = router;
