let playerScore = 0;
let botScore = 0;
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // Jogador é "X" e o bot é "O"
let gameOver = false;
let difficulty = "easy"; // Padrão

function startOnline() {
    alert("Função de jogo online será implementada.");
}

function startLocal() {
    alert("Função de jogo local será implementada.");
}

function showOfflineOptions() {
    const playerName = document.getElementById('name').value;
    if (playerName) {
        document.getElementById('difficulty-options').style.display = 'block';
    } else {
        alert("Por favor, insira seu nome.");
    }
}

function startOffline(selectedDifficulty) {
    difficulty = selectedDifficulty;
    resetBoard();
    document.getElementById('game-board').style.display = 'block';
    document.getElementById('difficulty-options').style.display = 'none';
    alert(`Dificuldade selecionada: ${difficulty}`);
}

function playerMove(index) {
    if (board[index] === "" && !gameOver) {
        board[index] = currentPlayer;
        document.getElementsByClassName('cell')[index].innerText = currentPlayer;
        if (checkWinner()) {
            alert("Você venceu!");
            playerScore++;
            updateScoreboard();
        } else if (board.includes("")) {
            currentPlayer = "O"; // Troca para o bot
            botMove();
        } else {
            alert("Empate!");
            resetBoard();
        }
    }
}

function botMove() {
    let move;
    if (difficulty === "easy") {
        move = getRandomMove();
    } else if (difficulty === "medium") {
        move = getMediumMove();
    } else {
        move = getBestMove();
    }

    board[move] = "O";
    document.getElementsByClassName('cell')[move].innerText = "O";

    if (checkWinner()) {
        alert("O bot venceu!");
        botScore++;
        updateScoreboard();
    } else if (!board.includes("")) {
        alert("Empate!");
        resetBoard();
    } else {
        currentPlayer = "X"; // Volta para o jogador
    }
}

function getRandomMove() {
    let emptyCells = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getMediumMove() {
    return Math.random() < 0.5 ? getRandomMove() : getBestMove();
}

function getBestMove() {
    // Implementação de algoritmo de jogada ótima (Minimax simplificado)
    return getRandomMove(); // Para simplificar, usa aleatório aqui
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6]  // Diagonais
    ];

    for (let combo of winningCombinations) {
        if (board[combo[0]] && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
            gameOver = true;
            return true;
        }
    }

    return false;
}

function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;
    let cells = document.getElementsByClassName('cell');
    for (let cell of cells) {
        cell.innerText = "";
    }
}

function updateScoreboard() {
    document.getElementById('player-score').innerText = playerScore;
    document.getElementById('bot-score').innerText = botScore;
    resetBoard();
}
