var mongoose = require('./dbConnect');
var mongoose = require('mongoose');

var missionPlannedSchema = {

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

// module.exports = new mongoose.Schema(missionPlannedSchema);
module.exports = mongoose.model('missionPlanned', missionPlannedSchema);
module.exports.missionPlannedSchema = missionPlannedSchema;