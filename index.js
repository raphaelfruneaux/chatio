var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, function() {
  console.log('listening on *:3000');
});

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

io.on('connection', function(socket) {
  socket.broadcast.emit('user-connected', 'A user connected');

  socket.on('chat message', function(obj) {
    io.emit('chat message', '<b>' + obj.nick + ':</b>' + obj.msg);
  });

  socket.on('disconnect', function() {
    socket.broadcast.emit('user-disconnected', 'A user disconnected');
  });
});
