console.log("Tic-Tac-Toe");

const BOARD_SIZE = 9;

const gameBoard = (function () {
	const board = [];

	function initBoard() {
		clearBoard();
		for (let i = 0; i < BOARD_SIZE; i++) {
			board.push(0);
		}
		_printBoard();
	}

	function clearBoard() {
		board.length = 0;
	}

	function placeMark(position, mark) {
		if (!_isValidPosition(position) || !_isPositionAvailable(position)) {
			console.log("[ERROR]: Position is not available or out of range.");
			return false;
		}
		board[position] = mark;
		_printBoard();
		return true;
	}

	function isWinner(mark) {
		const winConditions = [
			// Rows
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],

			// Columns
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],

			// Diagonals
			[0, 4, 8],
			[6, 4, 2],
		];
		for (let winCondition of winConditions) {
			if (
				board[winCondition[0]] === mark &&
				board[winCondition[1]] === mark &&
				board[winCondition[2]] === mark
			) {
				return true;
			}
		}
		return false;
	}

	function _isValidPosition(position) {
		return position >= 0 && position < board.length;
	}

	function _isPositionAvailable(position) {
		return board[position] === 0;
	}

	function _printBoard() {
		// Only for testing purposes
		let result = "";
		for (let i = 0; i < BOARD_SIZE; i++) {
			if (i !== 0 && i % 3 === 0) result += "\n";
			result += `  ${board[i]}`;
		}
		console.log(result);
	}

	return { initBoard, placeMark, isWinner };
})();

function createPlayer(name, mark) {
	const playerName = name;
	const playerMark = mark;

	function getPlayerName() {
		return playerName;
	}

	function getPlayerMark() {
		return playerMark;
	}

	return { getPlayerName, getPlayerMark };
}

const gameController = (function () {
	let players = [];
	let currentTurn = 0;
	let movesCounter = 0;
	let draw = false;
	let win = false;

	function initPlayers(playerName1, playerName2) {
		const player1 = createPlayer(playerName1, "x");
		const player2 = createPlayer(playerName2, "o");
		players = [player1, player2];
	}

	function initGame() {
		gameBoard.initBoard();
		currentTurn = 0;
		movesCounter = 0;
		draw = false;
		win = false;
	}

	function takeTurn(position) {
		if (!gameContinue()) {
			return {
				status: "error",
			};
		}

		let currentPlayer = getCurrentPlayer();
		const moveConfirmation = makeMove(position, currentPlayer);

		if (!moveConfirmation) {
			return {
				status: "error",
			};
		}

		if (checkWinner(currentPlayer)) {
			return {
				status: "winner",
				currentPlayerMark: currentPlayer.getPlayerMark(),
				winner: currentPlayer.getPlayerName(),
			};
		}

		if (checkDraw()) {
			return {
				status: "draw",
				currentPlayerMark: currentPlayer.getPlayerMark(),
			};
		}

		shiftTurn();
		let nextPlayer = getCurrentPlayer();
		return {
			status: "continue",
			currentPlayerMark: currentPlayer.getPlayerMark(),
			nextPlayer: nextPlayer.getPlayerName(),
		};
	}

	function makeMove(position, currentPlayer) {
		const markPlaced = gameBoard.placeMark(
			position,
			currentPlayer.getPlayerMark()
		);
		if (!markPlaced) {
			return false;
		}
		movesCounter++;
		return true;
	}

	function gameContinue() {
		return movesCounter < 9 && draw === false && win === false;
	}

	function checkDraw() {
		if (movesCounter === 9) {
			draw = true;
			return true;
		}
		return false;
	}

	function checkWinner(currentPlayer) {
		if (
			movesCounter >= 5 &&
			gameBoard.isWinner(currentPlayer.getPlayerMark())
		) {
			win = true;
			return true;
		}
		return false;
	}

	function getCurrentPlayer() {
		return players[currentTurn];
	}

	function shiftTurn() {
		currentTurn = (currentTurn + 1) % players.length;
	}

	return { initPlayers, initGame, takeTurn };
})();

const UIController = (function () {
	// DOM Cache
	const playerSetupContainer = document.querySelector("#playerSetupContainer");
	const gameContainer = document.querySelector("#gameContainer");

	const playerCreationForm = document.querySelector("#playerCreationForm");
	const inputPlayerName1 = document.querySelector("#inputPlayerName1");
	const inputPlayerName2 = document.querySelector("#inputPlayerName2");

	const playerName1 = document.querySelector("#playerName1");
	const playerName2 = document.querySelector("#playerName2");
	const display = document.querySelector("#display");

	const gameBoard = document.querySelector("#gameBoard");
	const cells = document.querySelectorAll(".cell");

	const newGameButton = document.querySelector("#newGameButton");

	const xMarkTemplate = document.querySelector("#xMarkTemplate");
	const oMarkTemplate = document.querySelector("#oMarkTemplate");

	// Bind events
	playerCreationForm.addEventListener("submit", handleGameStart);
	gameBoard.addEventListener("click", handleClickOnBoard);
	newGameButton.addEventListener("click", handleNewGame);

	// Handlers
	function handleClickOnBoard(e) {
		if (!e.target.classList.contains("cell")) return;

		const selectedCell = e.target;

		const gameOutput = gameController.takeTurn(selectedCell.dataset.position);
		if (gameOutput.status === "error") return;

		displayMark(selectedCell, gameOutput.currentPlayerMark);
		disableCell(selectedCell);

		if (gameOutput.status === "winner") {
			displayMessage(`🏆 ${gameOutput.winner} won the game! 🏆`);
			disableAllCells();
			return;
		}

		if (gameOutput.status === "draw") {
			displayMessage("It's a Draw 🤝");
			disableAllCells();
			return;
		}

		displayMessage(`It's ${gameOutput.nextPlayer}'s turn! ☝️`);
	}

	function handleGameStart(e) {
		e.preventDefault();

		const namePlayer1 = inputPlayerName1.value;
		const namePlayer2 = inputPlayerName2.value;
		gameController.initPlayers(namePlayer1, namePlayer2);

		displayPlayerNames(namePlayer1, namePlayer2);

		displayMessage(`${namePlayer1} takes the first turn! 🙌`);
		gameController.initGame();

		resetBoard();

		toggleVisibility(playerSetupContainer);
		toggleVisibility(gameContainer);

		playerCreationForm.reset();
	}

	function handleNewGame() {
		toggleVisibility(gameContainer);
		toggleVisibility(playerSetupContainer);
	}

	// UI Helpers
	function displayPlayerNames(name1, name2) {
		playerName1.textContent = name1;
		playerName2.textContent = name2;
	}

	function displayMessage(message) {
		display.textContent = message;
	}

	function displayMark(cell, mark) {
		const marks = {
			x: xMarkTemplate.content.cloneNode(true),
			o: oMarkTemplate.content.cloneNode(true),
		};
		cell.appendChild(marks[mark]);
	}

	function disableCell(cell) {
		cell.classList.add("disabled");
	}

	function disableAllCells() {
		cells.forEach((cell) => {
			cell.classList.add("disabled");
		});
	}

	function resetBoard() {
		cells.forEach((cell) => {
			cell.replaceChildren();
			cell.classList.remove("disabled");
		});
	}

	function toggleVisibility(element) {
		element.classList.contains("hidden")
			? element.classList.remove("hidden")
			: element.classList.add("hidden");
	}
})();
