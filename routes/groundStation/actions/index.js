var express = require('express');
var router = express.Router();
var logLiveCommands = require('../../../models/logLiveCommands');
var communicationGroundStation = require('../../../communicationGroundStation/sender/index.js');


//controls the door
router.get('/door/:action', function(req, res, next) {

  var action = req.params.action;

  var log = new logLiveCommands();

  log.commandTarget = "door";
  log.commandType = action;

  // send action to the GS
  var jsonString = JSON.stringify(log);
  communicationGroundStation.sendToGS(jsonString);

  res.send("sent");

  log.save(function(err){
    if(err){
      console.log(err); //res.send("error")
    }
    else {
      //res.send("Command saved");
    }
  })
});

//controls wheel
router.get('/wheel/:action', function(req, res, next) {

  var action = req.params.action;

  var log = new logLiveCommands();

  log.commandTarget = "wheel";
  log.commandType = action;

  // send action to the GS
  var jsonString = JSON.stringify(log);
  communicationGroundStation.sendToGS(jsonString);
  res.send("sent");

  //saves in the database
  log.save(function(err){
    if(err){
      console.log(err); //res.send("error")
    }
    else {
      //res.send("Command saved");
    }
  })
});


module.exports = router;
