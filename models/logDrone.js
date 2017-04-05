var mongoose = require('./dbConnect');
var mongoose = require('mongoose');

var logDroneSchema = {

 idDrone: {
    type: Number,
    required: false
  },

  idMission: {
    type: String,
    required: true
  },

  time: {
    type : Date,
    required: true
  },

  position: {
    latitude: {type: Number, required : true},
    longitude: {type: Number, required : true},
    altitude: {type: Number, required : true}
  },

  batteryLevel: {
    type: Number,
    required: true
  },

  landed: {
    type: Boolean,
    required: true
  }

};

// module.exports = new mongoose.Schema(logDroneSchema);
module.exports = mongoose.model('logDrone', logDroneSchema);
module.exports.missionPlannedSchema = logDroneSchema;
