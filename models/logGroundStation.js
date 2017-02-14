var mongoose = require('./dbConnect');
var mongoose = require('mongoose');

var logGroundStationSchema = {
  _id: { type: String},
  idGroundStation: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  doorState: {
    type: String,
    enum: ['open', 'close', 'opening', 'closing', 'stopped'],
    required: true
  },
  batteriesInfos:[{
    batterySlot: {type: Number, min: 0, max: 3, required: true},
    batteryVoltage: {type: Number, required: true},
    batteryPresence: {type: Boolean, required: true}
  }],
  weatherInfos:{
    rain: {type: Boolean, required: true},
    wind: {type: Number, required: true},
    humidity: {type: Number, required: true},
    temperature: {type: Number, required: true}
  }
};

// module.exports = new mongoose.Schema(logGroundStationSchema);
module.exports = mongoose.model('logGroundStation', logGroundStationSchema)
module.exports.logGroundStationSchema = logGroundStationSchema;
