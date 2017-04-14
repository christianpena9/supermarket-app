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

  socket.on("client-send", (data) => {
    console.log("incoming msg---> "+ data);
    io.sockets.emit("server-send", data);
  });

  socket.on('client-data', (data) => {
      console.log(data);
      io.emit('client-data', data);
  });

  socket.on("switch-stat", (data) =>{
    console.log("the switch = ", data);
    io.sockets.emit("on-off", data)
  });

});



// Once the server is online
server.listen(port, ()=>console.log("server is running @ ", port));
