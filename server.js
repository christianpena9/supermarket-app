const express = require('express');
const app     = express();
const server  = require('http').Server(app);
const io      = require('socket.io')(server);
const port    = process.env.PORT || 3000;

server.listen(3000);


// The event will be called when a client is connected.
io.on('connection', (socket) => {
  console.log("we have a connection @ " + socket.id);
  
});


// Once the server is online
server.listen(port, ()=>console.log("server is running @ ", port));
