const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Rota simples para verificar se o servidor está ativo
app.get('/', (req, res) => {
    res.send('Servidor de Velha Revolta está ativo.');
});

// Gerenciar conexões de jogadores
io.on('connection', (socket) => {
    console.log('Novo jogador conectado:', socket.id);

    socket.on('move', (data) => {
        socket.broadcast.emit('opponentMove', data); // Envia o movimento para o oponente
    });

    socket.on('disconnect', () => {
        console.log('Jogador desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
