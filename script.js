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
