const port = process.env.PORT || 8888;
const server = require('http').createServer();

const io = require("socket.io")(server, {
    cors: {
      origin: ["http://localhost:3000", "https://umutcnkus.github.io/game-of-third"],
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

server.listen(port);