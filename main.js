"use strict"

const EMPTY_CELL = 0;
const NO_WINNER = 0;
const PLAYER1 = 1;
const PLAYER2 = 2;

const GRID_SIZE = 5; // number of row == number of columns

/*
// Para debug en nodejs
const prompt = require('prompt');
prompt.start();
*/

/*
function createStyleSheet() {
	let styleSheet = document.createElement("style");
	styleSheet.type = 'text/css';
	styleSheet.innerText = "\
		html {\
			background-image: url('./images/background_wood.jpeg');\
		}\
		body {\
			padding: 20px;\
			}\		p {\
			font-size: 16px;\
			font-weight: normal;\
			height: 100px;\
			width:400px;\
			color: black;\
			padding: 10px;\
			}\
		.content {\
			display: flex;\
			align-items: flex-start;\
			justify-content: center;\
			flex-wrap: wrap;\
			padding: 20px;\
			}\
		#addBook {\
			text-align: center;\
			color: white;\
			background-color: green;\
			border-style: solid;\
			border-color: gray;\
			border-width: 1px;\
			border-radius: 10px;\
			width: 160px;\
			max-height: 44px;\
			font-size: 24px;\
			padding: 10px ;\
			cursor:pointer;\
			}\
		";
	document.head.appendChild(styleSheet);
}
*/

/** Gameboard module **/
const Gameboard = (() => {
	
	/** Private Methods **/
	const _buildGameboard = (rows, columns, value) => {
		let returnArray = [];
		let rowArray = [];
		for (let row = 0; row < rows; row++) {
			rowArray = [];
			for (let column = 0; column < columns; column++) {
				rowArray.push(value);
			}
		returnArray.push(rowArray);
		} 
		return returnArray;
	}
	
	/** Private Attributes **/
	let gameboard = _buildGameboard(GRID_SIZE, GRID_SIZE, EMPTY_CELL);
	
	/** Public Methods **/
	// Getters and Setters
	const getGameboard = () => { return gameboard; };
	const setCellValue = (value, row, column) => { gameboard[row][column] = value; };
	const getCellValue = (row, column) => { return gameboard[row][column]; };
	const isEmptyCell = (row, column) => { return getCellValue(row, column) == EMPTY_CELL ? true : false; };
	const isFull = () => { 
		let returnValue = true;
		for (let row = 0; row < GRID_SIZE; row++) {
			returnValue = returnValue && gameboard[row].every((value) => value != EMPTY_CELL);
		}
		return returnValue;
		};
	
	const threeInARow = (value) => {
		let returnValue = false;
		for (let row = 0; row < GRID_SIZE; row++) {
			returnValue = returnValue || gameboard[row].every( (val) => val == value );
		}
		return returnValue;
	};
	
	const threeInAColumn = (value) => {
		let returnValue = false;
		let columnTempArray = [];
		for (let column = 0; column < GRID_SIZE; column++) {
			columnTempArray = [];
			for (let row = 0; row < GRID_SIZE; row++) {
				columnTempArray.push(gameboard[row][column]);
			}
			returnValue = returnValue || columnTempArray.every( (val) => val == value );
		}
		return returnValue;
	};
	
	const threeInADiagonal = (value) => {
		let returnValue;
		let diagonalTempArray1 = [];
		let diagonalTempArray2 = [];
		for (let row = 0; row < GRID_SIZE; row++) {
			diagonalTempArray1.push(gameboard[row][row]);
			diagonalTempArray2.push(gameboard[row][(GRID_SIZE-1)-row]);
		}
		returnValue = diagonalTempArray1.every( (val) => val == value ) 
			|| diagonalTempArray2.every( (val) => val == value );
		return returnValue;
	};
	
	
	// Object returned
	return {
		getGameboard,
		setCellValue, 
		getCellValue, 
		isEmptyCell,
		isFull,
		threeInARow,
		threeInAColumn,
		threeInADiagonal,
	};
})();

/** GameController module **/
const GameController = ((gb) => {
	
	/** Private Attributes **/
	let gameOver = false;
	let whoPlays = PLAYER1;
	let turn = 1;
	
	/** Private Methods **/
	/*
	const _privateMethod1 = () => {
		// code of _privateMethod1
	};
	*/
	
	/** Public Methods **/
	// Getters and Setters
	const getWhoPlays = () => { return whoPlays; };
	const getTurn = () => { return turn; };
	
	const getWinner = () => {
		if (Gameboard.threeInARow(PLAYER1) || Gameboard.threeInAColumn(PLAYER1) 
		|| Gameboard.threeInADiagonal(PLAYER1)) {
			return PLAYER1;
		}
		if (Gameboard.threeInARow(PLAYER2) || Gameboard.threeInAColumn(PLAYER2) 
		|| Gameboard.threeInADiagonal(PLAYER2)) {
			return PLAYER2;
		}
		return NO_WINNER;
	};
	
	const getGameOver = () => { return gameOver; }
	
	const checkGameOver = () => {
		gameOver =(getWinner() != NO_WINNER || Gameboard.isFull())
		return gameOver;
	};
	
	const endTurn = () => { 
		++turn;
		if (whoPlays == PLAYER1) {
			whoPlays = PLAYER2;
			return whoPlays;
		} else {
			whoPlays = PLAYER1;
			return whoPlays;
		}
	};

	const updateBoard = (player, play) => {
		Gameboard.setCellValue(player, play.row, play.column);
	}

	// Object returned
	return {
		getWhoPlays,
		getTurn,
		getWinner,
		getGameOver,
		checkGameOver,
		endTurn,
		updateBoard,
	};
})(Gameboard);

/** DisplayController module **/
const DisplayController = ((gb) => {
	
	/** Private Attributes **/
	
	/** Private Methods **/
	/*
	const _privateMethod1 = () => {
		// code of _privateMethod1
	};
	*/
	
	/** Public Methods **/
	// Getters and Setters
	const displayGameboard = (graph1, graph2) => { 
		let output = "";
		for (let row = 0; row < GRID_SIZE; row++) {
			for (let column = 0; column < GRID_SIZE; column++) {
				if (Gameboard.getCellValue(row, column) == PLAYER1) output += graph1 + "|";
				else if (Gameboard.getCellValue(row, column) == PLAYER2) output += graph2 + "|";
				else if (Gameboard.isEmptyCell(row, column)) output += " |";
			}
			output +="\n"
			if (row != 3) output += "-----\n";
		}
		console.log(output);
	};

	const displayWinner = (winner) => {
		console.log("The winner is: " + winner);
	}

	// Object returned
	return {
		displayGameboard,
		displayWinner,
	};
})(Gameboard);

/** Factory object Player **/
const Player = (playerId, name, graph) => {
	
	/** Private Attributes **/
	let id = playerId;
	
	/** Private Methods **/
	/*
	const _privateMethod1 = () => {
		// code of _privateMethod1
	};
	*/
	
	/** Public Attributes **/
	//let publicAtts = {}; // container for public attributes
	//publicAtts.attr2 = 2;
	
	/** Public Methods **/
	// Getters and Setters
	const getId = () => { return id; };
	const getName = () => { return name; };
	const getGraph = () => { return graph; };
	
	const play = () => {
		let row = null;
		let column = null;
		let input = null
		
		const properties = [
			{
				row: 'row',
				validator: /^[1-3]$/,
				warning: 'Row must be a number between 0 and 2'
			},
			{
				column: 'column',
				validator: /^[1-3]$/,
				warning: 'Column must be a number between 0 and 2'
			}
		];
		/*
		prompt.get(properties, function (err, input) {
			if (err) { return onErr(err); }
		});
		* */
		
		while (input == null) {
			input = prompt("Select Row and Column (type 13 for Row=1 and Col=3): ");
			
			if (! Number.isInteger(parseInt(input))) { 
				console.log("Wrong input!");
				input = null; 
				}
			else if (input[0] < 1 || input[1] < 1 || input[0] > GRID_SIZE || input[1] > GRID_SIZE) { 
					console.log("Wrong input!");
					input = null; 
			}
		}
		row = parseInt(input[0]) - 1;
		column = parseInt(input[1]) - 1;
		return {row, column};
	};
	

	// Object returned
	return {
		getId,
		getName,
		getGraph,
		play,
	}
};


/** Main **/
//createStyleSheet()

const player1 = Player(PLAYER1, "Player 1", "X");
const player2 = Player(PLAYER2, "Player 2", "0");

let play = null;

while (! GameController.getGameOver()) {
	
	console.log("TURN: " + GameController.getTurn());
	
	if (GameController.getWhoPlays() == PLAYER1) {
		do {
			play = player1.play();
		} while (!Gameboard.isEmptyCell(play.row, play.column));
		GameController.updateBoard(PLAYER1, play);
		
	} else if (GameController.getWhoPlays() == PLAYER2) {
		do {
			play = player2.play();
		} while (!Gameboard.isEmptyCell(play.row, play.column));
		GameController.updateBoard(PLAYER2, play);
	};
	
	DisplayController.displayGameboard(player1.getGraph(), player2.getGraph());
	
	if (GameController.checkGameOver()) {
		DisplayController.displayWinner(GameController.getWinner());
	}
	
	console.log("END OF TURN: " + GameController.getTurn());
	GameController.endTurn();
}

/*

// Add buttons Event listener
// let buttonElem = document.getElementById("addBook");
// buttonElem.addEventListener("click", addBookToLibrary);

// Modal 'addBookModal'
function hideAddBookForm() {
	document.getElementById("addBookModal").style.display = "none";
}

function showAddBookForm(modalElement) {
	document.getElementById("addBookModal").style.display = "block";
}

// Get the modal
let addBookModal = document.getElementById("addBookModal");

// Get the button that opens the modal
let buttonElem = document.getElementById("addBook");
buttonElem.onclick = showAddBookForm; // When the user clicks on the button, open the modal

// OK button
let okButtonElem = document.getElementById("okButton");
okButtonElem.addEventListener("click", hideAddBookForm);
okButtonElem.addEventListener("click", addBookToLibrary);

// Cancel button
let  cancelButtonElem = document.getElementById("cancelButton");
cancelButtonElem.addEventListener("click", hideAddBookForm);

// Get the <span> element that closes the modal
let closeModal = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
closeModal.onclick = hideAddBookForm;
*/




