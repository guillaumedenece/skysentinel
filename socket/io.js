var io = require('socket.io')();

io.sockets.on('connection', function (socket) {
  socket.emit('message', 'Vous êtes bien connecté !');
  console.log("client connected");
});

module.exports = io;
