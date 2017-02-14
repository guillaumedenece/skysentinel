var mongoose = require('./dbConnect');
var mongoose = require('mongoose');

var logTakeOffSchema = {


 time: {
    type: Date,
    required: true
  },

  tookOff: {
    type : Boolean,
    required: true
  },

  weatherCond: {
    type : String,
    required: true
  },

  landed: {
    type : Boolean,
    required: true
  },

  missionPlan: {
    type: String,
    required: true
  },

  frequency: {
    type: Number,
    required: true
  },
  validityDate: {
    type: Date,
    required: true
  },
  GSConcerned:{
    type: Number,
    required: true
  },
  missionDescription:{
    type: String,
    required : false
  }
};

// module.exports = new mongoose.Schema(logTakeOffSchema);
module.exports = mongoose.model('logTakeOff', logTakeOffSchema);
module.exports.missionPlannedSchema = logTakeOffSchema;