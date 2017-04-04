var express = require('express');
var router = express.Router();
var missionGeneration = require('./missionGeneration.js');
var missionPlanned = require('../../../models/missionPlanned.js');

router.post('/', function(req, res, next) {

  var missionGenerated;

  missionGenerated = missionGeneration.missionStock(parseFloat(req.body.inputLat), parseFloat(req.body.inputLong), req.body.inputHaut, req.body.inputLarg, req.body.inputAngle, req.body.inputEsp, req.body.inputDist, req.body.inputAltHome, req.body.inputAltMiss, req.body.delta, false);

  var mission = new missionPlanned();
  mission.missionData = missionGenerated["missionData"];
  mission.missionMapPoints = missionGenerated["missionMap"];
  mission.frequency = req.body.frequency;
  mission.validityDate = req.body.startDate;
  var dateReceived = new Date(req.body.startDate)
  mission.validityDate = new Date(Date.parse(dateReceived) + (dateReceived.getTimezoneOffset()*60000));

  if(req.body.missionDescription){
    mission.missionDescription = req.body.missionDescription;
  }

  if(req.body.missionTitle){
    mission.missionTitle = req.body.missionTitle;
  }

  mission.save(function(err){
    if(err){
      console.log(err); //res.send("error")
    }
    else {
      console.log("mission enregistrée");
    }
  })

  res.redirect('/');
});

module.exports = router;
