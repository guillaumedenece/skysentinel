var mongoose = require('./dbConnect');
var mongoose = require('mongoose');

var missionPlannedSchema = {

  missionData: {
    type: String,
    required: true
  },
  missionMapPoints: {
    type: Array,
    required: true
  },
  //Fréquence de mission en heure
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
    required: false
  },
  missionDescription:{
    type: String,
    required : false
  },
  missionTitle:{
    type: String,
    required: false,
    default: "mission"
  }
};

// module.exports = new mongoose.Schema(missionPlannedSchema);
module.exports = mongoose.model('missionPlanned', missionPlannedSchema);
module.exports.missionPlannedSchema = missionPlannedSchema;
