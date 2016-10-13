
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
    socket.broadcast.emit('user-connected', `<b>${username} has connected</b>`)
    io.sockets.emit('user-update', users)
  })

  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', `<b>${socket.username} says:</b> ${msg}`)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', `<b>${socket.username} disconnected</b>`)
    io.sockets.emit('user-update', users)
    delete users[socket.username]
  })

  socket.on('typing', () => {
    socket.broadcast.emit('is-typing', `<b>${socket.username}</b> is typing!`)
  })
})
