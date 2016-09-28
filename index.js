
'use strict'

var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var users = {}

server.listen(3099, () => {
  console.log('listening on *:3099')
})

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

io.on('connection', (socket) => {
  socket.on('add-user', (username) => {
    socket.username = users[username] = username
    socket.broadcast.emit('user-connected', 'A user connected')
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message', `<b>${socket.username} says:</b> ${msg}`)
  })

  socket.on('disconnect', () => {
    delete users[socket.username]
    socket.broadcast.emit('user-disconnected', 'A user disconnected')
  })
})
