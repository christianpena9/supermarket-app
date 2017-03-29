const express = require('express');
const app     = express();
const server  = require('http').Server(app);
const io      = require('socket.io')(server);
const port    = process.env.PORT || 3000;


// The event will be called when a client is connected.
// io.on('connection', (socket) => {
//   console.log("we have a new connection @ " + socket.id);
//   socket.emit('hello', 'can you hear me?', 1, 2, 'abc');
//
// });


io.on('connection', function (socket) {
    console.log("we have a new connection @ " + socket.id);
    socket.on('message', function (data) {
        socket.broadcast.emit('message', data);
    });
});

// Once the server is online
server.listen(port, ()=>console.log("server is running @ ", port));
