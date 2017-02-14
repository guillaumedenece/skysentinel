var mongoose = require('./dbConnect');
var mongoose = require('mongoose');

var logDroneSchema = {

 droneId: {
    type: Number,
    required: true
  },

  time: {
    type : Date,
    required: true
  },

  position: {
    type : String,
    required: true
  },

  batteryLevel: {
    type: Number,
    required: true
  },

  landed: {
    type: Boolean,
    required: true
  },
  
};

// module.exports = new mongoose.Schema(logDroneSchema);
module.exports = mongoose.model('logDrone', logDroneSchema);
module.exports.missionPlannedSchema = logDroneSchema;