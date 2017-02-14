var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/skysentinel8');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("database connection succes");
});
