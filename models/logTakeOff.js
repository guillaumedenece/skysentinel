var mongoose = require('./dbConnect');
var mongoose = require('mongoose');

var logTakeOffSchema = {


 time: {
    type: Date,
    required: true
  },

 idMission: {
    type: String,
    required: true
 },


  weatherCond: {
    rain: {type: Boolean, required: true},
    wind: {type: Boolean, required: true},
    humidity: {type: Boolean, required: true},
    temperature: {type: Boolean, required: true}
  },

  launched: {
    type : Boolean,
    required: true
  },

  available: {
    type : Boolean,
    required: true
  },

  missionData: {
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