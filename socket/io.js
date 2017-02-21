var io = require('socket.io')();

io.sockets.on('connection', function (socket) {
  socket.emit('message', 'Vous êtes bien connecté !');
  console.log("client connected");
});

module.exports = io;


//To send a message, require that file and use the following code:
//io.emit('message', 'information about the database received');
