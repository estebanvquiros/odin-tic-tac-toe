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
