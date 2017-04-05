var express = require('express');
var router = express.Router();
var missionPlanned = require('../../../models/missionPlanned.js');

router.get('/getMissionsPlanned', function(req, res, next){
  missionPlanned.find().sort({validityDate: -1}).select({missionTitle: 1, missionDescription: 1, validityDate:1, missionMapPoints:1, frequency:1}).exec(null, function(err, results){
    if(err)
    {
      throw err;
    }

    res.send(results);
    })
});

module.exports = router;
