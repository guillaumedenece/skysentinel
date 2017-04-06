var express = require('express');
var router = express.Router();
var logGroundStation = require('../../../models/logGroundStation');


//sends the last update of the log collection "logGroundStation"
router.get('/', function(req, res, next) {

  logGroundStation.find().limit(1).sort({time: -1}).exec(null, function(err, results){
    if(err)
    {
      throw err;
    }
    console.log(results);
    res.send(results);
    })

});

router.get('/logs/:begining/:end', function(req, res, next) {

  logGroundStation.find({time:{$gte:ISODate(begining), $lt:ISODate(end)}}).sort({time: -1}).exec(null, function(err, results){
    if(err)
    {
      throw err;
    }
    console.log(results);
    res.send(results);
    })

});

router.get('/door', function(req, res, next){

  logGroundStation.find().sort({time: -1}).limit(1).select({doorState: 1, time:1, idGroundStation:1}).exec(null, function(err, results){
    if(err)
    {
      throw err;
    }
    console.log(results);
    res.send(results);
    })

});

router.get('/batteriesInfos', function(req, res, next){

  logGroundStation.find().sort({time: -1}).limit(1).select({batteriesInfos: 1, time:1, idGroundStation:1}).exec(null, function(err, results){
    if(err)
    {
      throw err;
    }
    console.log(results);
    res.send(results);
    })

});

router.get('/weather', function(req, res, next){

  logGroundStation.find().sort({time: -1}).limit(1).select({weatherInfos: 1, time:1, idGroundStation:1}).exec(null, function(err, results){
    if(err)
    {
      throw err;
    }
    console.log(results);
    res.send(results);
    })

});

// route.get('/')

module.exports = router;
