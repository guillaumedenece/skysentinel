var mongoose = require('./dbConnect');
var mongoose = require('mongoose');

var logLiveCommandSchema = {

  idTargetGroundStation : {
    //required: true,
    type: String
  },

  date : {
    type: Date,
    default: Date.now
  },

  commandTarget : {
    type: String,
    enum: ['door', 'drone', 'elevator', 'wheel'],
    required: true
  },

  commandType : {
    type: String,
    enum: ['open', 'close', 'stop', 'up', 'down', 'clockwise', 'counterclockwise'],
    required: true
  }
};

module.exports = mongoose.model('logLiveCommand', logLiveCommandSchema);
module.exports.logLiveCommandSchema = logLiveCommandSchema;
