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

// Para evitar la falta de referencia de algún módulo u objeto dentro de un módulo, declaro todo aquí al principio.
// Luego uso Object.freeze() para congelar los módulos y objetos declarados.
// Declarar todo como funciones vacías
/** Modules declarations **/
let Gameboard = () => {};
let GameController = () => {};
let DisplayController = () => {};

// ¡¡¡Cuidado!!! Estos objetos deben ser usados una vez se hayan definido correctamente. Incluir una funcion de inicialiciacion que se llame una vez se hayan definido estos objetos (si hacemos const player = Player(...) antes de definir definitivamente el objeto, creará un objeto vacío
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
	const noPlayer = {}; // defined in init()
	const players = []; // populated in init()
	
	let gameOver = false;
	let whoPlays = noPlayer;
	let turn = 1;
	
	// These attributes are saved in persistent memory in function after each game
	let numberOfUserVictories = 0;
	let numberOfCPUVictories = 0;
	let lastWinner = null;
	let lastWinnerName = ""; // for display purpioses only
	
	/** Public Attributes (constants or references) **/
	
	/** Private Methods **/
	const _resetWhoPlays = () => {
		whoPlays = players[0];
	}
	
	const _resetGameboard = () => {
		Gameboard.buildGameboard(GRID_SIZE, GRID_SIZE, EMPTY_CELL);
	}
	
	const _resetTurn = () => {
		turn = 1;
	}
	
	
	/** Public Methods **/
	
	const setLastWinner = (value) => { 
		lastWinner = value; 
		lastWinnerName = lastWinner.getName();
	}
	
	const getLastWinner = () => { return lastWinner; };
	const getLastWinnerName = () => { return lastWinnerName; };
	
	const getPlayer = (playerId) => {
		let returnPlayer = players.find( (player) => player.getId() == playerId);
		if (returnPlayer === undefined) { returnPlayer = noPlayer; }
		return returnPlayer;
	};
	
	const getWhoPlays = () => { return whoPlays; };
	const getTurn = () => { return turn; };
	
	const getCellValue = (row, column) => {return Gameboard.getCellValue(row, column);};
	
	const whoWon = () => {
		let winner = players.find((player) => (Gameboard.threeInARow(player.getId()) 
			|| Gameboard.threeInAColumn(player.getId()) 
			|| Gameboard.threeInADiagonal(player.getId()))
		);
		if (winner === undefined) { winner = noPlayer; };
		return winner;
	};
	
	const getGameOver = () => { return gameOver; }
	
	const checkGameOver = () => {
		gameOver =(whoWon() != noPlayer || Gameboard.isFull())
		return gameOver;
	};
	
	const endTurn = () => { 
		++turn;
		let nextPlayerIndex = players.findIndex((player) => player == whoPlays) + 1;
		if (nextPlayerIndex > players.length-1) {
			nextPlayerIndex = 0;
		}
		whoPlays = players[nextPlayerIndex];
	};

	const init = () => {
		Object.assign(noPlayer, Player(NO_WINNER, "No One", " "));
		players.push(Player(PLAYER1, "Player", "X", "blue"));
		players.push(Player(PLAYER2, "CPU", "0", "red"));
	}

	const reset = () => {
		_resetWhoPlays();
		_resetTurn();
		_resetGameboard();
		loadScoreboard();
	}

	const updateGameboard = (player, play) => {
		Gameboard.setCellValue(player, play.row, play.column);
	}
	
	const loadScoreboard = () => {
		// Recover from local storage but only if variables exist in local storage
		let recoveredValue = null;
		players.forEach((player, index, array) => {
			recoveredValue = localStorage.getItem(player.getName() + ".numberOfVictories");
			if (recoveredValue !== null) {
				player.setNumberOfVictories(parseInt(recoveredValue));
			}
		});
		recoveredValue = localStorage.getItem(noPlayer.getName() + ".numberOfVictories");
		// number of ties
		if (recoveredValue !== null) {
			noPlayer.setNumberOfVictories(parseInt(recoveredValue));
		}
		recoveredValue = localStorage.getItem("lastWinnerName")
		if ( recoveredValue !== null) {
			lastWinnerName = recoveredValue;
		}
	}

	const saveScoreboard = () => {
		players.forEach((player, index, array) => {
			localStorage.setItem(player.getName() + ".numberOfVictories", player.getNumberOfVictories());
		});
		localStorage.setItem(noPlayer.getName() + ".numberOfVictories", noPlayer.getNumberOfVictories());
		localStorage.setItem("lastWinnerName", lastWinner.getName());
	}
	
	// Object returned
	return {
		setLastWinner,
		getLastWinner,
		getLastWinnerName,
		getPlayer,
		getWhoPlays,
		getTurn,
		getCellValue,
		whoWon,
		getGameOver,
		checkGameOver,
		endTurn,
		init,
		reset,
		updateGameboard,
		loadScoreboard,
		saveScoreboard,
	};
})(Gameboard, Player);
Object.freeze(GameController, Player);

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
	const updateGameboardCell = (row, column, graph, color) => { 
		
		let columnTd = document.querySelector("td.cell[data-row='" + row + "'][data-column='" + column + "']");
		columnTd.innerText = graph;
		columnTd.style = "color: " + color + ";";
	};

	const displayGameboard = () => { 
		
		let contentDiv = document.getElementsByClassName("content")[0];
		contentDiv.innerHTML = "";
		
		// Usar table (en vez de div), tr (en vez de ul) y td (en vez de li) mejor
		let gameboardTable = document.createElement("table");
		gameboardTable.setAttribute("id", "gameboard");
		gameboardTable.className = "gameboard";
		
		let rowTr = null;
		let columnTd = null;
		
		let output = "";
		for (let row = 0; row < GRID_SIZE; row++) {
			rowTr = document.createElement("tr");
			rowTr.className = "gameboard";
			//gameboardTable.setAttribute("data-row", row);
			
			for (let column = 0; column < GRID_SIZE; column++) {
				columnTd = document.createElement("td");
				columnTd.className = "cell gameboard";
				columnTd.setAttribute("data-column", column);
				columnTd.setAttribute("data-row", row);
				columnTd.innerText = GameController.getPlayer(GameController.getCellValue(row, column)).getGraph();
				columnTd.style = "color: " + GameController.getPlayer(GameController.getCellValue(row, column)).getCSSColor() + ";";
				rowTr.appendChild(columnTd);
			}
			gameboardTable.appendChild(rowTr);
		}
		contentDiv.appendChild(gameboardTable);
	};

	const displayScoreboard = () => {
		//console.log("The winner is: " + winner);
		document.getElementById("player1Name").innerText = GameController.getPlayer(PLAYER1).getName();
		document.getElementById("player2Name").innerText = GameController.getPlayer(PLAYER2).getName();
		document.getElementById("numberOfUserVictories").innerText = GameController.getPlayer(PLAYER1).getNumberOfVictories();
		document.getElementById("numberOfCPUVictories").innerText = GameController.getPlayer(PLAYER2).getNumberOfVictories();
		document.getElementById("lastWinnerName").innerText = GameController.getLastWinnerName();
	}

	// Object returned
	return {
		updateGameboardCell,
		displayGameboard,
		displayScoreboard,
	};
})(GameController);
Object.freeze(DisplayController);

/** Factory object Player implementation **/
Player = (playerId, name, graph, color) => {
	
	/** Private Attributes **/
	let cssColor = color;
	let id = playerId;
	let numberOfVictories = 0;
	
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
	const setNumberOfVictories = (value) => { numberOfVictories = value; };
	const incNumberOfVictories = () => { numberOfVictories++; };
	const resetNumberOfVictories = () => { numberOfVictories = 0; };
	
	const getNumberOfVictories = () => { return numberOfVictories; };
	const getId = () => { return id; };
	const getName = () => { return name; };
	const getGraph = () => { return graph; };
	const getCSSColor = () => { return cssColor; };
	
	const play = (event) => {
		let row = event.currentTarget.dataset.row;
		let column = event.currentTarget.dataset.column;
		return {row, column};
	};
	

	// Object returned
	return {
		setNumberOfVictories,
		incNumberOfVictories,
		resetNumberOfVictories,
		getNumberOfVictories,
		getId,
		getName,
		getGraph,
		getCSSColor,
		play,
	}
};
Object.freeze(Player);

/** Global variables **/
// none

function startGame() {
	
	hideWinMessageModal();
	
	// init: Create players
	GameController.init();
	// resets game values (gameboard, etc)
	GameController.reset();
	
	DisplayController.displayGameboard();
	addCellEventListeners();
	DisplayController.displayScoreboard();

	// Print: turn_number, whoplays
	
}

function restartGame() {
	GameController.reset();
	DisplayController.displayGameboard();
	addCellEventListeners();
}

function endGame() {
	// Disable event listeners
	removeCellEventListeners();
}


function computePlay(event) {
		
	console.log("TURN: " + GameController.getTurn());
	console.log ("Turn for Player" + GameController.getWhoPlays().getName() + "\n\n");
	
	let player = GameController.getWhoPlays();
	let play = player.play(event);
	if (!Gameboard.isEmptyCell(play.row, play.column)) {
			// square not free: emit a sound or do something...
			return;
		}
	GameController.updateGameboard(player.getId(), play);
	DisplayController.updateGameboardCell(play.row, play.column, player.getGraph(), player.getCSSColor());
	
	console.log("END OF TURN: " + GameController.getTurn());

	if (GameController.checkGameOver()) {
		GameController.setLastWinner(GameController.whoWon());
		GameController.getLastWinner().incNumberOfVictories();
		GameController.saveScoreboard();
		DisplayController.displayScoreboard();
		showWinMessageModal(GameController.getLastWinner());
		endGame();
		return;
	}
	
	GameController.endTurn();
	console.log ("====================================\n\n");
	
}

/** Main **/
startGame();

/** Listeners **/

function addClicked(event) {
	event.preventDefault();
	event.currentTarget.classList.add("clicked");
	}

function removeClicked(event) {
	event.currentTarget.classList.remove("clicked");
	}

function addCellEventListeners() {
	// Eventlistener on each cell: computePlay()
	let cellElements = document.getElementsByClassName("cell");
	// uso del spread operator para transformar la HTMLCollection en Array y poder usar forEach
	[...cellElements].forEach((element, index, array) => {
		element.addEventListener("click", computePlay, {once:true});
	});
}

function removeCellEventListeners() {
	// Eventlistener on each cell: computePlay()
	let cellElements = document.getElementsByClassName("cell");
	// uso del spread operator para transformar la HTMLCollection en Array y poder usar forEach
	[...cellElements].forEach((element, index, array) => {
		element.removeEventListener('click', computePlay);
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
	document.getElementById("message").innerText = "THE WINNER IS: " + winner.getName();
}

function hideWinMessageModal() {
	document.getElementById("winMessage").style.display = "none";
}

