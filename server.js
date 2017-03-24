// const express = require('express');
// const http = require('http')
// const socketio = require('socket.io');
//
// const app = express();
// const server = http.Server(app);
// const websocket = socketio(server);
// server.listen(3000, () => console.log('listening on *:3000'));
//
// // The event will be called when a client is connected.
// websocket.on('connection', (socket) => {
//   console.log('A client just joined on', socket.id);
// });



const express = require('express');
const app     = express();
const server  = require('http').Server(app);
const io      = require('socket.io')(server);
const port    = process.env.PORT || 3000;

server.listen(3000);


// The event will be called when a client is connected.
io.on('connection', (socket) => {
  console.log("we have a connection @ " + socket.id);
  // socket.on("new-message", (msg) => {
  //   console.log(msg);
  //   io.emit("receive-message", msg);
  // })
});


// Once the server is online
server.listen(port, ()=>console.log("server is running @ ", port));
