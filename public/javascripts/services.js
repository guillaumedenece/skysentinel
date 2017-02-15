var socket = io.connect('http://127.0.0.1:3000')

socket.on('message', function(message) {
        alert('Le serveur a un message pour vous : ' + message);
    })

socket.on('alert', function(message) {
        alert('Le serveur a un message pour vous : ' + message);
    })
