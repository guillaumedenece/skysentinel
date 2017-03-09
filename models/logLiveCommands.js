var mongoose = require('./dbConnect');
var mongoose = require('mongoose');

var logLiveCommandSchema = {

  idTargetGroundStation : {
    //required: true,
    type: String
  },

  time : {
    type: Date,
    default: Date.now
  },

  commandTarget : {
    type: String,
    enum: ['door', 'drone', 'elevator', 'wheel', 'system'],
    required: true
  },

  commandType : {
    type: String,
    enum: ['open', 'close', 'stop', 'up', 'down', 'clockwise', 'counterclockwise', '0', '1', '2', '3', 'rth', 'land', 'shutdown'],
    required: true
  }
};

module.exports = mongoose.model('logLiveCommand', logLiveCommandSchema);
module.exports.logLiveCommandSchema = logLiveCommandSchema;
