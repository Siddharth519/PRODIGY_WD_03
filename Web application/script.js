const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const playerXNameInput = document.getElementById("playerXName");
const playerONameInput = document.getElementById("playerOName");
const currentPlayerSpan = document.getElementById("currentPlayer");
const winnerSpan = document.getElementById("winner");
let currentPlayer = "X";
let gameActive = true;
let gameMode = "human";

playerXNameInput.addEventListener("input", updatePlayerName);
playerONameInput.addEventListener("input", updatePlayerName);

cells.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
});

const gameModeRadios = document.querySelectorAll('input[name="mode"]');
gameModeRadios.forEach((radio) => {
    radio.addEventListener("change", handleGameModeChange);
});

function handleGameModeChange(event) {
    gameMode = event.target.value;
    updatePlayerName();

    // Remove the "winning" class from all cells
    cells.forEach((cell) => {
        cell.classList.remove('winning');
    });

    currentPlayerSpan.textContent = "";
    winnerSpan.textContent = "";
    
    // Disable the second textbox when playing against the computer
    playerONameInput.disabled = gameMode === "computer";

    // Clear the cells when switching to human mode
    if (gameMode === "human") {
        cells.forEach((cell) => {
            cell.textContent = "";
            cell.setAttribute("data-cell", "");
            cell.classList.remove("clicked");
        });
    }
}



function updatePlayerName() {
    const playerXName = playerXNameInput.value.trim() || "Player X";
    const playerOName = playerONameInput.value.trim() || "Player O";

    currentPlayerSpan.textContent = playerXName;

    if (gameMode === "human") {
        // Enable both input fields
        playerXNameInput.disabled = false;
        playerONameInput.disabled = false;

        // Update the placeholder text
        playerXNameInput.placeholder = "Player X";
        playerONameInput.placeholder = "Player O";
    } else {
        // Disable the second input field in computer mode
        playerXNameInput.disabled = false;
        playerONameInput.disabled = true;

        // Update the placeholder text and value for Player O
        playerXNameInput.placeholder = "Player X (You)";
        playerONameInput.placeholder = "Computer (O)";
        playerONameInput.value = "Computer";
    }

    cells.forEach((cell) => {
        cell.textContent = "";
        cell.setAttribute("data-cell", "");
        cell.classList.remove("clicked");
        cell.removeEventListener("click", handleClick);
        cell.addEventListener("click", handleClick, { once: true });
    });

    currentPlayer = "X";
    gameActive = true;

    currentPlayerSpan.textContent = playerXName;

    if (gameMode === "computer" && currentPlayer === "O") {
        makeComputerMove();
    }
}

function makeComputerMove() {
    const emptyCells = [...cells].filter((cell) => cell.textContent === "");
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const randomCell = emptyCells[randomIndex];
        setTimeout(() => {
            randomCell.click();
        }, 500); // Add a delay for better visualization
    }
}

function handleClick(event) {
    const cell = event.target;
    if (!gameActive || cell.textContent !== "") return;

    cell.textContent = currentPlayer;
    cell.setAttribute("data-cell", currentPlayer);
    cell.classList.add("clicked");

    if (checkWin()) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        cells.forEach((cell) => {
            cell.removeEventListener("click", handleClick);
            cell.addEventListener("click", handleClick, { once: true });
        });

        currentPlayerSpan.textContent = currentPlayer === "X" ? playerXNameInput.value : playerONameInput.value;

        if (gameMode === "computer" && currentPlayer === "O") {
            makeComputerMove();
        }
    }
}

function checkWin() {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (
            cells[a].textContent === currentPlayer &&
            cells[b].textContent === currentPlayer &&
            cells[c].textContent === currentPlayer
        ) {
            cells[a].classList.add('winning');
            cells[b].classList.add('winning');
            cells[c].classList.add('winning');
            return true;
        }
    }

    return false;
}


function isDraw() {
    return [...cells].every((cell) => cell.textContent !== "");
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        showWinner("It's a Draw!");
    } else {
        const winnerName = currentPlayer === "X" ? playerXNameInput.value : playerONameInput.value;
        showWinner(` ${winnerName} Wins!`);
    }
    playerXNameInput.disabled = false;
    playerONameInput.disabled = false;
}

function showWinner(message) {
    const winnerAlert = document.createElement("div");
    winnerAlert.classList.add("alert");
    
    document.body.appendChild(winnerAlert);

    winnerSpan.textContent = message; // Update winner display
}

const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

function startGame() {
    updatePlayerName();
    startButton.disabled = true;
    resetButton.disabled = false;

    // Enable the game board cells
    cells.forEach((cell) => {
        cell.disabled = false;
    });
}

function resetGame() {
    cells.forEach((cell) => {
        cell.textContent = "";
        cell.setAttribute("data-cell", "");
        cell.classList.remove("clicked");
        cell.removeEventListener("click", handleClick);
        cell.addEventListener("click", handleClick, { once: true });
    });

    playerXNameInput.disabled = false;
    playerONameInput.disabled = false;
    startButton.disabled = false;
    resetButton.disabled = true;
    currentPlayerSpan.textContent = "";
    winnerSpan.textContent = "";

    currentPlayer = "X";
    gameActive = true;

    if (gameMode === "computer" && currentPlayer === "O") {
        makeComputerMove();
    }
}