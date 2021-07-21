// Now, in order to create a real-time interaction system, we need to use sockets in order to make it to be
// real time. 
//Just create a http server , and then pass it to the socket.io and get the object io , which will then be used
// 


const express = require("express");
// const server = express();
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static("public"))
// 127.0.0.1-> localhost
// web socket enabled

io.on('connection', (socket) => {
    // console.log('a user connected');
    socket.on("message", function (data) {
        console.log(socket.id);
        console.log(data);

        socket.broadcast.emit("broadcast",data);
    })
});
http.listen(3000, function () {
    console.log('listening on *:3000');
});
// server.listen(3000, function () {
//     console.log("server is running at port 3000");
// })