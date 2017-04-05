var express = require('express');
var router = express.Router();
var logDrone = require('../../../models/logDrone');


//sends the last update of the log collection "logGroundStation"
router.get('/', function(req, res, next) {

  logDrone.find().limit(1).sort({time: -1}).exec(null, function(err, results){
    if(err)
    {
      throw err;
    }
    console.log(results);
    res.send(results);
    })
});

module.exports = router;
