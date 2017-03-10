var express = require('express');
var router = express.Router();
var logLiveCommands = require('../../../models/logLiveCommands');
var communicationGroundStation = require('../../../communicationGroundStation/sender/index.js');


//send a mission to the drone
router.get('/mission/:idMission', function(req, res, next) {

  var idMission = req.params.idMission;

  //creating the command to send to the GS
  var command = new Object();
  command.idMission = idMission;

  // send action to the GS
  var jsonString = JSON.stringify(command);
  communicationGroundStation.sendToGS(jsonString);
  res.send("sent");
});

//contols the drone
router.get('/control/:action', function(req, res, next) {

  var action = req.params.action;

  //creating the command to send to the GS
  var command = new Object();
  command.commandType = action;
  command.commandTarget = "drone";
  //limit time after executing the command: 15 secs
  command.timeLimit = Date.now() + 15000;

  //creating the log
  var log = new logLiveCommands();
  log.time = Date.now();
  log.commandTarget = command.commandTarget;
  log.commandType = command.commandType;

  log.save(function(err){
    if(err){
      console.log(err); //res.send("error")
    }
    else {
      // send action to the GS
      var jsonString = JSON.stringify(command);
      communicationGroundStation.sendToGS(jsonString);
      res.send("sent");
    }
  })
});

module.exports = router;
