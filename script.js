let player1Name = "";
let player2Name = "";
let player1Score = 0;
let player2Score = 0;
let botScore = 0;
let currentPlayer = "X"; // Jogador 1 é "X" e o Jogador 2 ou o bot é "O"
let gameOver = false;
let difficulty = "easy"; // Padrão para o modo offline
let isOffline = false; // Flag para verificar se o jogo é offline
let isLocal = false; // Flag para verificar se o jogo é local

// Função para iniciar o modo local (dois jogadores no mesmo dispositivo)
function startLocal() {
    const playerName1 = document.getElementById('name').value;
    if (!playerName1) {
        alert("Por favor, insira o nome do Jogador 1.");
        return;
    }

    // Exibe o campo para o segundo jogador
    document.getElementById('second-player-name').style.display = 'block';

    const playerName2 = document.getElementById('name2').value;
    if (!playerName2) {
        alert("Por favor, insira o nome do Jogador 2.");
        return;
    }

    player1Name = playerName1;
    player2Name = playerName2;

    // Atualiza o placar com os nomes dos jogadores
    document.getElementById('player-score-label').innerText = `${player1Name}: `;
    document.getElementById('bot-score-label').innerText = `${player2Name}: `;

    isLocal = true;
    isOffline = false;
    resetBoard();
    document.getElementById('game-board').style.display = 'block';
}

// Função para mostrar as opções de dificuldade offline
function showOfflineOptions() {
    const playerName = document.getElementById('name').value;
    if (playerName) {
        player1Name = playerName;
        document.getElementById('difficulty-options').style.display = 'block';
    } else {
        alert("Por favor, insira seu nome.");
    }
}

// Função para iniciar o modo offline (jogador contra o bot)
function startOffline(selectedDifficulty) {
    difficulty = selectedDifficulty;
    resetBoard();
    document.getElementById('game-board').style.display = 'block';
    document.getElementById('difficulty-options').style.display = 'none';
    alert(`Dificuldade selecionada: ${difficulty}`);
    isOffline = true;
    isLocal = false;

    // Atualiza o placar para o modo offline
    document.getElementById('player-score-label').innerText = `${player1Name}: `;
    document.getElementById('bot-score-label').innerText = `Bot: `;
}

// Função para realizar a jogada do jogador
function playerMove(index) {
    if (board[index] === "" && !gameOver) {
        board[index] = currentPlayer;
        document.getElementsByClassName('cell')[index].innerText = currentPlayer;

        if (checkWinner()) {
            if (currentPlayer === "X") {
                alert(`${player1Name} venceu!`);
                player1Score++;
            } else if (isOffline) {
                alert("O bot venceu!");
                botScore++;
            } else {
                alert(`${player2Name} venceu!`);
                player2Score++;
            }
            updateScoreboard();
        } else if (!board.includes("")) {
            alert("Empate!");
            resetBoard();
        } else {
            if (isOffline) {
                currentPlayer = "O"; // Agora é a vez do bot
                botMove(); // Chama a função para o bot jogar
            } else {
                currentPlayer = currentPlayer === "X" ? "O" : "X"; // Alterna entre os jogadores no modo local
            }
        }
    }
}

// Função para o bot realizar uma jogada
function botMove() {
    let botIndex;
    if (difficulty === "easy") {
        botIndex = getRandomMove();
    } else if (difficulty === "medium") {
        botIndex = getMediumMove();
    } else if (difficulty === "hard") {
        botIndex = getBestMove();
    }

    if (botIndex !== -1) {
        board[botIndex] = "O";
        document.getElementsByClassName('cell')[botIndex].innerText = "O";
        if (checkWinner()) {
            alert("O bot venceu!");
            botScore++;
            updateScoreboard();
        } else if (!board.includes("")) {
            alert("Empate!");
            resetBoard();
        } else {
            currentPlayer = "X"; // Volta a vez do jogador
        }
    }
}

// Funções auxiliares para o bot
function getRandomMove() {
    let availableMoves = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    return -1;
}

function getMediumMove() {
    let move = getBlockingMove();
    return move !== -1 ? move : getRandomMove();
}

function getBestMove() {
    return getMediumMove(); // Aqui você pode implementar uma lógica mais avançada, como o algoritmo Minimax
}

function getBlockingMove() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6] // Diagonais
    ];

    for (let combo of winningCombinations) {
        let [a, b, c] = combo;
        if (board[a] === "X" && board[b] === "X" && board[c] === "") return c;
        if (board[a] === "X" && board[b] === "" && board[c] === "X") return b;
        if (board[a] === "" && board[b] === "X" && board[c] === "X") return a;
    }
    return -1;
}

// Função para verificar o vencedor
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6] // Diagonais
    ];

    for (let combo of winningCombinations) {
        if (board[combo[0]] && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
            gameOver = true;
            return true;
        }
    }
    return false;
}

// Função para resetar o tabuleiro
function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    let cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.innerText = "";
    }
}

// Função para atualizar o placar
function updateScoreboard() {
    document.getElementById('player-score').innerText = player1Score;
    document.getElementById('bot-score').innerText = isOffline ? botScore : player2Score;
    resetBoard();
}