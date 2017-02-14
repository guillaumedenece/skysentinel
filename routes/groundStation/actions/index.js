var express = require('express');
var router = express.Router();
var logLiveCommands = require('../../../models/logLiveCommands');


//controls the door
router.get('/door/:action', function(req, res, next) {

  var action = req.params.action;

  var log = new logLiveCommands();

  log.commandTarget = "door";
  log.commandType = action;

  //send action to the GS

  log.save(function(err){
    if(err)
    {console.log(err); res.send("error") }
    else {
      res.send("Command saved");
    }
  })

  // res.send(action);

});


module.exports = router;
