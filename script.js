console.log("Tic-Tac-Toe");

const gameBoard = (function () {
	let board = [0, 0, 0, 0, 0, 0, 0, 0, 0];

	function resetBoard() {
		board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	}

	function _printBoard() {
		// Only for testing purposes
		let result = "";
		for (let i = 0; i < board.length; i++) {
			if (i !== 0 && i % 3 === 0) result += "\n";
			result += `  ${board[i]}`;
		}
		console.log(result);
	}

	function _isValidPosition(position) {
		return position >= 0 && position < board.length;
	}

	function _isPositionAvailable(position) {
		return board[position] === 0;
	}

	function placeMark(mark, position) {
		if (!_isValidPosition(position) || !_isPositionAvailable(position)) {
			console.log("[ERROR]: Position is not available or out of range");
			return false;
		}
		board[position] = mark;
		_printBoard();
		return true;
	}

	function checkWinner(mark) {
		const winningConditions = [
			//Rows
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			//Columns
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			//Diagonals
			[0, 4, 8],
			[6, 4, 2],
		];

		for (let winCondition of winningConditions) {
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

	return { resetBoard, placeMark, checkWinner };
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
	let winner = false;

	function initGame(namePlayer1, namePlayer2) {
		players = [createPlayer(namePlayer1, "x"), createPlayer(namePlayer2, "o")];
		gameBoard.resetBoard();
		draw = false;
		winner = false;
	}

	function takeTurn(position) {
		if (draw || winner) return;

		const currentPlayer = players[currentTurn];

		const markWasPlaced = gameBoard.placeMark(
			currentPlayer.getPlayerMark(),
			position
		);

		if (!markWasPlaced) return;
		movesCounter++;

		if (
			movesCounter >= 5 && // At least 5 moves are required before a win is possible
			gameBoard.checkWinner(currentPlayer.getPlayerMark())
		) {
			console.log(`🏆 ${currentPlayer.getPlayerName()} won the game! 🏆`);
			winner = true;
			return;
		}

		if (movesCounter === 9) {
			console.log(`It's a Draw 🤝`);
			draw = true;
			return;
		}

		_shiftTurn();
	}

	function _shiftTurn() {
		currentTurn = (currentTurn + 1) % players.length;
	}

	return { initGame, takeTurn };
})();
