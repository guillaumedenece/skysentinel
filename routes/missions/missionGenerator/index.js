var express = require('express');
var router = express.Router();
var missionGeneration = require('./missionGeneration.js');
var missionPlanned = require('../../../models/missionPlanned.js');

router.post('/', function(req, res, next) {

  var missionGenerated;
  //
  // var lat=47.230110; //-35.3632621765 //43.785273
  // var longi=-1.464834; //149.165237427 //4.957509
  // var largeur=72;//71.33
  // var hauteur=88; //51.91
  // var angle_ini=-0.65135688; //-37.32° --> 0.65135688  //-10°; -0.18238691
  // var espacement=8;
  // var pt_m=2.0; //freq des points
  // var home_alt=0.0; //3.00
  // var mission_alt=2.0; //590.0//2.00
  // var inputAR = false; //aller retour
  // var delta = 0;

  // missionGenerated = missionGeneration.missionStock(lat, longi, hauteur, largeur, angle_ini, espacement, pt_m, home_alt, mission_alt, delta, inputAR);
  //
  // console.log("lat " + req.body.inputLat);
  // console.log("longi " + req.body.inputLong);
  // console.log("largeur " + req.body.inputLarg);
  // console.log("hauteur " + req.body.inputHaut);
  // console.log("angle_ini " + req.body.inputAngle);
  // console.log("espacement " + req.body.inputEsp);
  // console.log("pt_m " + req.body.inputDist);
  // console.log("home_alt " + req.body.inputAltHome);
  // console.log("mission_alt " + req.body.inputAltMiss);
  // console.log("inputAR " + req.body.inputAR);
  // console.log("delta " + req.body.delta);

  missionGenerated = missionGeneration.missionStock(parseFloat(req.body.inputLat), parseFloat(req.body.inputLong), req.body.inputHaut, req.body.inputLarg, req.body.inputAngle, req.body.inputEsp, req.body.inputDist, req.body.inputAltHome, req.body.inputAltMiss, req.body.delta, false);

  var mission = new missionPlanned();
  mission.missionData = missionGenerated["missionData"];
  mission.missionMapPoints = missionGenerated["missionMap"];
  mission.frequency = req.body.frequency;
  mission.validityDate = req.body.startDate;
  if(req.body.missionDescription){
    mission.missionDescription = req.body.missionDescription;
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
