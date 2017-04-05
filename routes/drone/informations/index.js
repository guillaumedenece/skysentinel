var express = require('express');
var router = express.Router();
var logDrone = require('../../../models/logDrone');
var missionPlanned = require('../../../models/missionPlanned');


//sends the last update of the log collection "logGroundStation"
router.get('/', function(req, res, next) {

  logDrone.find().limit(1).sort({time: -1}).exec(null, function(err, results){
    if(err){
      throw err;
    }
    else if(results[0]){

      var logDrone = new Object();
      logDrone.date = results[0].date;
      logDrone.idMission = results[0].idMission;
      logDrone.batteryLevel = results[0].batteryLevel;
      logDrone.landed = results[0].landed;
      logDrone.position = new Object();
      logDrone.position.latitude = results[0].position.latitude;
      logDrone.position.longitude = results[0].position.longitude;
      logDrone.position.altitude = results[0].position.altitude;

      if(results[0].idMission != "none"){
        missionPlanned.find({"_id": results[0].idMission}).limit(1).exec(null, function(err, mission){
          if(err){
            throw err;
          }
          else{
            //if a mission matching the mission in the logDrone is found
            if(mission[0]){
              //if that mission has a title
              if(mission[0].missionTitle){
                logDrone.missionTitle = mission[0].missionTitle;
                res.send(JSON.stringify(logDrone));
              }
              //if that mission has no title
              else{
                logDrone.missionTitle = "Title";
                res.send(JSON.stringify(logDrone));
              }
            }
            //if no mission matches the mission in the logDrone
            else{
              results[0] = new Object(results[0]);
              logDrone.missionTitle = "Title";
              res.send(JSON.stringify(logDrone));
            }
          }
        })
      }
      else{
        res.send(results);
      }
    }
    else{
      console.log("no log drone found");
      res.send(results)
    }
  })
});

module.exports = router;
