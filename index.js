var app = require('express')();
var http = require('http').createServer(app);
const io = require("socket.io")(http, {
    cors: {
        cors:true,
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {    
    socket.on("create-game", () => {
        socket.emit("room-created", {roomId: socket.id})
    })

    socket.on("join-game", (params) => {
        socket.join(params.roomId);
        socket.emit("game-accepted", {roomId: params.roomId});
        socket.to(params.roomId).emit("user-joined")
    })

    socket.on('initialize', (params) => {
        console.log(params);
        io.to(params.roomId).emit("game-started", {initialValue: params.initialValue})
    })

    socket.on("make-move", (params) => {
        console.log('Move Received', params)
        io.to(params.roomId).emit("move-received", params);
    })
});


http.listen(process.env.PORT || 80, () => {
    console.log('listening on *:1234');
});