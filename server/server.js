const express = require('express');
const app     = express();
const server  = require('http').Server(app);
const io      = require('socket.io')(server);
const port    = process.env.PORT || 3000;


// The event will be called when a client is connected.
io.on('connection', (socket) => {
  console.log("we have a new connection @ " + socket.id);

  socket.on('disconnect', () => {
    console.log(socket.id, " has signed out!");
  });



  socket.on('isSwitchOn-client', (data) => {
      console.log("is switch on? =>", data);
      io.sockets.emit('isSwitchOn-server', data);
  });

  socket.on('calling-client', (data) => {
      console.log("calling data=>", data);
      io.sockets.emit('calling-server', data);
  });



});



// Once the server is online
server.listen(port, ()=>console.log("server is running @ ", port));
