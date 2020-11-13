var app = require('express')();
var http = require('http').createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('newGame', () => {
        socket.roomId = socket.id
        socket.isHost = true;
        socket.emit("room-created", { gameId: socket.id })
    });
    socket.on('join-game', (params) => {
        socket.join(params.roomId);
        socket.roomId = params.roomId;
        socket.isHost = false;
        socket.emit("join-game", { gameId: socket.roomId });
        io.to(socket.roomId).emit("game-started", { total: Math.floor((Math.random() * 1000) + 1) })
    });
    socket.on('moved', (params) => {
        console.log(params);
        const { previousValue, playedMove } = params;
        const newValue = (previousValue + playedMove) / 3;
        const remainder = (previousValue + playedMove) % 3;
        const isFinished = newValue == 1;
        io.to(socket.roomId).emit("move-played", { played: playedMove, oldValue: previousValue, newValue: remainder, isFinished: isFinished })
    })
});


http.listen(1234, () => {
    console.log('listening on *:1234');
});