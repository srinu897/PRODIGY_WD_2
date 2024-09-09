const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const gameStatus = document.getElementById('game-status');
const restartButton = document.getElementById('restart-button');
const playerVsPlayerBtn = document.getElementById('player-vs-player');
const playerVsAIBtn = document.getElementById('player-vs-ai');

let currentPlayer = 'X';
let isGameActive = true;
let isPlayerVsAI = false;
let boardState = Array(9).fill(null);

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

playerVsPlayerBtn.addEventListener('click', () => startGame(false));
playerVsAIBtn.addEventListener('click', () => startGame(true));
restartButton.addEventListener('click', restartGame);

function startGame(isAI) {
    isPlayerVsAI = isAI;
    currentPlayer = 'X';
    boardState.fill(null);
    isGameActive = true;
    cells.forEach(cell => {
        cell.classList.remove('x');
        cell.classList.remove('o');
        cell.textContent = '';
        cell.addEventListener('click', handleCellClick, { once: true });
    });
    gameStatus.textContent = `${currentPlayer}'s turn`;
    restartButton.classList.add('hidden');
}

function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (boardState[cellIndex] || !isGameActive) return;

    updateCell(cell, cellIndex);
    checkWinner();

    if (isPlayerVsAI && currentPlayer === 'O' && isGameActive) {
        setTimeout(aiMove, 500);
    }
}

function updateCell(cell, index) {
    boardState[index] = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.textContent = currentPlayer;
}

function swapTurns() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameStatus.textContent = `${currentPlayer} wins!`;
        isGameActive = false;
        restartButton.classList.remove('hidden');
    } else if (!boardState.includes(null)) {
        gameStatus.textContent = "It's a draw!";
        isGameActive = false;
        restartButton.classList.remove('hidden');
    } else {
        swapTurns();
    }
}

function aiMove() {
    const availableCells = boardState.map((cell, index) => cell === null ? index : null).filter(v => v !== null);
    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];

    const cell = cells[randomIndex];
    updateCell(cell, randomIndex);
    checkWinner();
}

function restartGame() {
    startGame(isPlayerVsAI);
}
