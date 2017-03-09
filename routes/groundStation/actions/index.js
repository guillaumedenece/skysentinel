var express = require('express');
var router = express.Router();
var logLiveCommands = require('../../../models/logLiveCommands');
var communicationGroundStation = require('../../../communicationGroundStation/sender/index.js');


//controls the door
router.get('/door/:action', function(req, res, next) {

  var action = req.params.action;

  //creating the command to send to the GS
  var command = new Object();
  command.commandType = action;
  command.commandTarget = "door";
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

//controls wheel
router.get('/wheel/:action', function(req, res, next) {

    var action = req.params.action;

    //creating the command to send to the GS
    var command = new Object();
    command.commandType = action;
    command.commandTarget = "wheel";
    //limit time after executing the command: 15 secs
    command.timeLimit = new Date(Date.now() + 15000);//Date.now() + 15000;
    console.log(command.timeLimit);

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

//controls system
router.get('/system/:action', function(req, res, next) {

    var action = req.params.action;

    //creating the command to send to the GS
    var command = new Object();
    command.commandType = action;
    command.commandTarget = "system";
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

//controls elevator
router.get('/elevator/:action', function(req, res, next) {

    var action = req.params.action;

    //creating the command to send to the GS
    var command = new Object();
    command.commandType = action;
    command.commandTarget = "elevator";
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
