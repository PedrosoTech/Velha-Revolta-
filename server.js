const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = {};
let currentPlayer = "X";

io.on('connection', (socket) => {
    console.log('Novo jogador conectado');

    socket.on('joinGame', (playerName) => {
        players[socket.id] = { name: playerName, symbol: currentPlayer };
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        socket.emit('startGame', players[socket.id].symbol);
    });

    socket.on('playerMove', (index) => {
        socket.broadcast.emit('opponentMove', index);
    });

    socket.on('disconnect', () => {
        console.log('Jogador desconectado');
        delete players[socket.id];
    });
});

app.use(express.static('public'));

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});