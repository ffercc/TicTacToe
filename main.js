"use strict"

const EMPTY_CELL = 0;
const NO_WINNER = 0;
const PLAYER1 = 1;
const PLAYER2 = 2;

const GRID_SIZE = 3; // number of row == number of columns

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

// Para evitar la falta de referencia de algún módulo u objeto dentro de un módulo, declaro todo aquí al principio.
// Luego uso Object.freeze() para congelar los módulos y objetos declarados.
// Declarar todo como funciones vacías
/** Modules declarations **/
let Gameboard = () => {};
let GameController = () => {};
let DisplayController = () => {};

/** Factory Objects declarations **/
let Player = () => {};

/** Gameboard module implementation **/
Gameboard = (() => {
	
		/** Private Attributes **/
	let gameboard = [];
	
	/** Private Methods **/
	
	/** Public Methods **/
	
	const buildGameboard = (rows, columns, value) => {
		let returnArray = [];
		let rowArray = [];
		for (let row = 0; row < rows; row++) {
			rowArray = [];
			for (let column = 0; column < columns; column++) {
				rowArray.push(value);
			}
		returnArray.push(rowArray);
		} 
		gameboard = returnArray;
	}
	
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
		buildGameboard,
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
Object.freeze(Gameboard);

/** GameController module implementation **/
GameController = ((gb) => {
	
	/** Private Attributes **/
	let gameOver = false;
	let whoPlays = PLAYER1;
	let turn = 1;
	
	/** Public Attributes (constants or references) **/
	
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
	
	const resetGameboard = () => {
		Gameboard.buildGameboard(GRID_SIZE, GRID_SIZE, EMPTY_CELL);
	}
	
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
		resetGameboard,
		getWinner,
		getGameOver,
		checkGameOver,
		endTurn,
		updateBoard,
	};
})(Gameboard, Player);
Object.freeze(GameController);

/** DisplayController module implementation **/
DisplayController = ((gb) => {
	
	/** Private Attributes **/
	
	/** Private Methods **/
	/*
	const _privateMethod1 = () => {
		// code of _privateMethod1
	};
	*/
	
	/** Public Methods **/
/*
	const displayMainScreen = () => {
		
		//let contentDiv = document.getElementsByClassName("content")[0];
		//contentDiv.innerHTML = "";
		let headerDiv = document.getElementsByClassName("header")[0];
		headerDiv.innerHTML = "";
		let startButton = document.createElement("button");
		startButton.innerText = "START GAME";
		headerDiv.appendChild(startButton);
		startButton.onclick = startGame();
	}
*/

	const displayGameboard = (graph1, graph2) => { 
		
		let contentDiv = document.getElementsByClassName("content")[0];
		contentDiv.innerHTML = "";
		
		let gameboardDiv = document.createElement("div");
		gameboardDiv.setAttribute("id", "gameboard");
		gameboardDiv.className = "gameboard";
		
		let rowUl = null;
		let columnLi = null;
		
		let output = "";
		for (let row = 0; row < GRID_SIZE; row++) {
			rowUl = document.createElement("ul");
			//gameboardDiv.setAttribute("data-row", row);
			
			for (let column = 0; column < GRID_SIZE; column++) {
				columnLi = document.createElement("li");
				columnLi.className = "cell";
				columnLi.setAttribute("data-column", column);
				columnLi.setAttribute("data-row", row);
				
				if (Gameboard.getCellValue(row, column) == PLAYER1) {
					/*
					columnLi.style = "\
								list-style-image: url(./images/graphPlayer1.png);\
					"
					*/
					columnLi.innerText = graph1;
				}
				else if (Gameboard.getCellValue(row, column) == PLAYER2) {
					/*
					columnLi.style = "\
								list-style-image: url(./images/graphPlayer2.png);\
					"
					*/
					columnLi.innerText = graph2;
				}
				else if (Gameboard.isEmptyCell(row, column)) {
					columnLi.innerText = "";
				}
				rowUl.appendChild(columnLi);
			}
			gameboardDiv.appendChild(rowUl);
		}
		contentDiv.appendChild(gameboardDiv);
		
		// Don't forget to add the EventListener to each cell
		addEventListeners();
	};

	const displayWinner = (winner, numberOfUserVictories, numberOfCPUVictories) => {
		//console.log("The winner is: " + winner);
		document.getElementById("numberOfUserVictories").innerText = numberOfUserVictories;
		document.getElementById("numberOfCPUVictories").innerText = numberOfCPUVictories;
		document.getElementById("winner").innerText = winnerToString(winner);
	}

	// Object returned
	return {
		displayGameboard,
		displayWinner,
	};
})(Gameboard);
Object.freeze(DisplayController);

/** Factory object Player implementation **/
Player = (playerId, name, graph) => {
	
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
	
	const play = (event) => {
		let row = event.currentTarget.dataset.row;
		let column = event.currentTarget.dataset.column;
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
Object.freeze(Player);

/** Global variables **/
const player1 = Player(PLAYER1, "Player 1", "X");
const player2 = Player(PLAYER2, "Player 2", "0");

let numberOfUserVictories = 0; // Player1
let numberOfCPUVictories = 0; // Player2

function winnerToString(winner) {
		switch(winner) {
			case PLAYER1:
				return "PLAYER 1";
				break;
			case PLAYER2:
				return "PLAYER 2";
				break;
			case NO_WINNER:
				return "TIE";
				break;
			default:
				// code block
		}
}

function startGame() {
	
	hideWinMessageModal();
	
	// Game screen: reset and draw gameboard, player names, ...
	GameController.resetGameboard();
	DisplayController.displayGameboard(player1.getGraph(), player2.getGraph());
	
	// The start player is PLAYER_1 (set in GameController constructor)
	
	// Print: turn_number, whoplays
	
	
}

function restartGame() {
	//GameController.resetGameboard();
	
	// Añadir un modal con el MENSAJE DE VICTORIA
}

function computePlay(event) {
		
	let play = null;
	console.log("TURN: " + GameController.getTurn());
	console.log ("Turn for Player" + GameController.getWhoPlays() + "\n\n");
	
	if (GameController.getWhoPlays() == PLAYER1) {
		play = player1.play(event);
		if (!Gameboard.isEmptyCell(play.row, play.column)) {
			// square not free: emit a sound or do something...
			return;
		}
		GameController.updateBoard(PLAYER1, play);
		
	} else if (GameController.getWhoPlays() == PLAYER2) {
		play = player2.play(event);
		if (!Gameboard.isEmptyCell(play.row, play.column)) {
			// square not free: emit a sound or do something...
			return;
		}
		GameController.updateBoard(PLAYER2, play);
	};
	
	DisplayController.displayGameboard(player1.getGraph(), player2.getGraph());
	
	console.log("END OF TURN: " + GameController.getTurn());

	// Check for gameover
	if (GameController.checkGameOver()) {
		let winner = GameController.getWinner();
		winner = PLAYER1 ? numberOfUserVictories++ : numberOfCPUVictories++;
		DisplayController.displayWinner(winner, numberOfUserVictories, numberOfCPUVictories);
		showWinMessageModal(winner); // show win message
	}
	
	GameController.endTurn();
	
	console.log ("====================================\n\n");
	
}

/*
function main() {
	
	// Main screen: add js code to regenerate it (for each restart)
	// Button with Eventlistener: startGame()
	DisplayController.displayMainScreen();
	
}
*/

/** Main **/
//main();

/** Listeners **/

function addEventListeners() {
	// Eventlistener on each cell: computePlay()
	let cellElements = document.getElementsByClassName("cell");
	// uso del spread operator para transformar la HTMLCollection en Array y poder usar forEach
	[...cellElements].forEach((element, index, array) => {
		element.onclick = computePlay;
	});
}


/** Modals **/

// Get the modal
let winMessageModal = document.getElementById("winMessage");

// Get the <span> element that closes the modal
let closeModal = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
closeModal.onclick = hideWinMessageModal;

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == winMessageModal) {
		hideWinMessageModal(winMessageModal);
	}
}

function showWinMessageModal(winner) {
	document.getElementById("winMessage").style.display = "block";
	document.getElementById("message").innerText = "WINNER: " + winnerToString(winner);
}

function hideWinMessageModal() {
	document.getElementById("winMessage").style.display = "none";
}

