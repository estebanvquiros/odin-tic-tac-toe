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

	return { resetBoard, placeMark };
})();
