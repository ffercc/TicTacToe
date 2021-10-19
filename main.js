"use strict"

/** Constants and Global Variables **/

const EMPTY_CELL = 0;
const NO_WINNER = 0;
const PLAYER1 = 1;
const PLAYER2 = 2;

//const GRID_SIZE = 5; // number of row == number of columns
var gridSize = 3; // number of row == number of columns

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
	const getGameboardLength = () => { return gameboard.length; };
	const setCellValue = (value, row, column) => { gameboard[row][column] = value; };
	const getCellValue = (row, column) => { return gameboard[row][column]; };
	const isEmptyCell = (row, column) => { return getCellValue(row, column) == EMPTY_CELL ? true : false; };
	const isFull = () => { 
		let returnValue = true;
		for (let row = 0; row < gameboard.length; row++) {
			returnValue = returnValue && gameboard[row].every((value) => value != EMPTY_CELL);
		}
		return returnValue;
		};
	
	const threeInARow = (value) => {
		let returnValue = -1;
		for (let row = 0; row < gameboard.length; row++) {
			if (gameboard[row].every( (val) => val == value)) {returnValue = row;}
		}
		return returnValue; // returns the winning row or -1 (no win condition met)
	};
	
	const threeInAColumn = (value) => {
		let returnValue = -1;
		let columnTempArray = [];
		for (let column = 0; column < gameboard.length; column++) {
			columnTempArray = [];
			for (let row = 0; row < gameboard.length; row++) {
				columnTempArray.push(gameboard[row][column]);
			}
			if (columnTempArray.every( (val) => val == value )) {returnValue = column;}
		}
		return returnValue; // returns the winning column or -1 (no win condition met)
	};
	
	const threeInADiagonal = (value) => {
		let returnValue = -1;
		let diagonalTempArray1 = [];
		let diagonalTempArray2 = [];
		for (let row = 0; row < gameboard.length; row++) {
			diagonalTempArray1.push(gameboard[row][row]);
			diagonalTempArray2.push(gameboard[row][(gameboard.length-1)-row]);
		}
		if (diagonalTempArray1.every( (val) => val == value )) returnValue = 0;
		if (diagonalTempArray2.every( (val) => val == value )) returnValue = 1;
		return returnValue; // returns the winning diagonal (0 or 1) or -1 (no win condition met) 
	};
	
	// Object returned
	return {
		buildGameboard,
		getGameboard,
		getGameboardLength,
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
	
	const winningConditions = {};
	
	//let gameOver = false;
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
		Gameboard.buildGameboard(gridSize, gridSize, EMPTY_CELL);
	}
	
	const _resetTurn = () => {
		turn = 1;
	}
	
	const _resetWinningConditions = () => {
		winningConditions.winner = noPlayer;
		winningConditions.winningComboType = "none";
		winningConditions.winningComboNumber = -1;
		winningConditions.gameOver = false;
	}
	
	
	/** Public Methods **/
	
	const setLastWinner = (value) => { 
		lastWinner = value; 
		lastWinnerName = lastWinner.getName();
	};
	
	const getGameboardLength = () => { return Gameboard.getGameboardLength(); }; 
	
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
	
	const whoWonAndHow = () => {
		/*
		let winner = players.find((player) => (Gameboard.threeInARow(player.getId()) 
			|| Gameboard.threeInAColumn(player.getId()) 
			|| Gameboard.threeInADiagonal(player.getId()))
		);
		if (winner === undefined) { winner = noPlayer; };
		*/
		let winningRow = -1;
		let winningColumn = -1;
		let winningDiagonal = -1;
		let winConditionMet = false;
		
		players.forEach((player, index, array) => {
			if (! winConditionMet) {
				winningRow = Gameboard.threeInARow(player.getId());
				winningColumn = Gameboard.threeInAColumn(player.getId());
				winningDiagonal = Gameboard.threeInADiagonal(player.getId());
				
				if (winningRow != -1) {
					winningConditions.winner = player;
					winningConditions.winningComboType = "row";
					winningConditions.winningComboNumber = winningRow;
					winConditionMet = true;
				} else if (winningColumn != -1) {
					winningConditions.winner = player;
					winningConditions.winningComboType = "column";
					winningConditions.winningComboNumber = winningColumn;
					winConditionMet = true;
				} else if (winningDiagonal != -1) {
					winningConditions.winner = player;
					winningConditions.winningComboType = "diagonal";
					winningConditions.winningComboNumber = winningDiagonal;
					winConditionMet = true;
				}
			}
		});
		return;
	};
	
	const getGameOver = () => { return gameOver; }
	
	const checkWinningConditions = () => {
		whoWonAndHow(); // populates winningConditions
		winningConditions.gameOver =(winningConditions.winner != noPlayer || Gameboard.isFull());
		return winningConditions;
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
		Object.assign(noPlayer, Player(NO_WINNER, "No One", " ", "gray"));
		players.push(Player(PLAYER1, "X", "X", "blue"));
		players.push(Player(PLAYER2, "0", "0", "red"));
	}

	const reset = () => {
		_resetWhoPlays();
		_resetTurn();
		_resetGameboard();
		_resetWinningConditions();
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
	
	const resetScore = () => {
		players.forEach((player, index, array) => {
			player.resetNumberOfVictories();
		});
		lastWinner = noPlayer;
		lastWinnerName = lastWinner.getName();
		saveScoreboard();
	}
	
	// Object returned
	return {
		setLastWinner,
		getGameboardLength,
		getLastWinner,
		getLastWinnerName,
		getPlayer,
		getWhoPlays,
		getTurn,
		getCellValue,
		whoWonAndHow,
		getGameOver,
		checkWinningConditions,
		endTurn,
		init,
		reset,
		updateGameboard,
		loadScoreboard,
		saveScoreboard,
		resetScore,
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
		for (let row = 0; row < GameController.getGameboardLength(); row++) {
			rowTr = document.createElement("tr");
			rowTr.className = "gameboard";
			gameboardTable.setAttribute("data-row", row);
			
			for (let column = 0; column < GameController.getGameboardLength(); column++) {
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

	const markWinningCells = (winningConditions) => {
		let cellList = [];
		switch (winningConditions.winningComboType) {
			case "row":
				cellList = document.querySelectorAll("[data-row='" + winningConditions.winningComboNumber + "']");

			break;
			case "column":
				cellList = document.querySelectorAll("[data-column='" + winningConditions.winningComboNumber + "']");
			break;
			case "diagonal":
			
				if (winningConditions.winningComboNumber == 0) {
					for (let row = 0; row < GameController.getGameboardLength(); row++) {
						cellList.push(document.querySelector("[data-row='" + row + "'][data-column='" + row + "'] "));
					}
					//cellList.push(document.querySelector("[data-row='0'][data-column='0'] "));
					//cellList.push(document.querySelector("[data-row='1'][data-column='1'] "));
					//cellList.push(document.querySelector("[data-row='2'][data-column='2'] "));
				} else if (winningConditions.winningComboNumber == 1) {
					for (let row = 0; row < GameController.getGameboardLength(); row++) {
						cellList.push(document.querySelector("[data-row='" + row + "'][data-column='" + (GameController.getGameboardLength()-1-row) + "'] "));
					}
					//cellList.push(document.querySelector("[data-row='0'][data-column='2'] "));
					//cellList.push(document.querySelector("[data-row='1'][data-column='1'] "));
					//cellList.push(document.querySelector("[data-row='2'][data-column='0'] "));
				}
			break;
			default:
		}
		for (let i = 0; i < cellList.length; i++) {
			cellList[i].classList.add('winnerCell');
		}
	}

	const displayScoreboard = () => {
		document.getElementById("player1Name").innerText = GameController.getPlayer(PLAYER1).getName();
		document.getElementById("player2Name").innerText = GameController.getPlayer(PLAYER2).getName();
		document.getElementById("numberOfUserVictories").innerText = GameController.getPlayer(PLAYER1).getNumberOfVictories();
		document.getElementById("numberOfCPUVictories").innerText = GameController.getPlayer(PLAYER2).getNumberOfVictories();
		let lastWinnerCell = document.getElementById("lastWinnerName")
		let winner = GameController.getLastWinner();
		lastWinnerCell.innerText = winner.getName();
		lastWinnerCell.style = "color:" + winner.getCSSColor() + ";animation: thAnimation 1s infinite;"
	}

	// Object returned
	return {
		updateGameboardCell,
		displayGameboard,
		markWinningCells,
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

function startGame() {
	
	hideWinMessageModal();
	
	// init: Create players
	GameController.init();
	addOutcomeTableStyles()
	// resets game values (gameboard, etc)
	GameController.reset();
	
	DisplayController.displayGameboard();
	addCellEventListeners();
	DisplayController.displayScoreboard();

	// Print: turn_number, whoplays
	
}

function restartGame() {
	hideWinMessageModal();
	GameController.reset();
	DisplayController.displayGameboard();
	addCellEventListeners();
	//document.querySelectorAll(".cell").classList.remove("winnerCell");
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

	let winningConditions = GameController.checkWinningConditions();
	if (winningConditions.gameOver) {
		GameController.setLastWinner(winningConditions.winner);
		GameController.getLastWinner().incNumberOfVictories();
		DisplayController.markWinningCells(winningConditions);
		
		GameController.saveScoreboard();
		DisplayController.displayScoreboard();
		showWinMessageModal(GameController.getLastWinner());
		endGame();
		return;
	}
	
	GameController.endTurn();
	console.log ("====================================\n\n");
	
}

/** Styles **/

function addOutcomeTableStyles() {
	// Add some Style to outcome tables (call after initializing game!)
	let header1 = document.getElementById("player1Name");
	let header2 = document.getElementById("player2Name");
	header1.style = "color:" + GameController.getPlayer(PLAYER1).getCSSColor() + ";animation: thAnimation 1s infinite;";
	header2.style = "color:" + GameController.getPlayer(PLAYER2).getCSSColor() + ";animation: thAnimation 1s infinite;";
}

/** Sliders **/

let slider = document.getElementById("gridSizeSlider");
let output = document.getElementById("gridSizeOutput");
gridSize = slider.value;
output.innerText = "Grid Size: " + gridSize; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
	gridSize = this.value;
	output.innerText = "Grid Size: " + gridSize;
	startGame();
}

/** Listeners **/

function addClicked(event) {
	event.preventDefault();
	//event.currentTarget.classList.add("clicked");
	}

//function removeClicked(event) {
	//event.currentTarget.classList.remove("clicked");
	//}

function resetScore() {
	event.preventDefault();
	GameController.resetScore();
	DisplayController.displayScoreboard();
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
	let message = document.getElementById("message")
	message.innerHTML = "THE WINNER IS: <p id='msgWinner'>" + winner.getName() + "<p>";
	message.querySelector("#msgWinner").style = "\
		color:" + winner.getCSSColor() + ";\
		font-size: 80px;"
	
	let elements = document.querySelectorAll("body > *:not(.modal)")
	for (let i=0; i< elements.length; i++) {
		elements[i].classList.add("blurred");
	}
	
	//document.getElementsByTagName("body")[0].classList.add("blurred");
}

function hideWinMessageModal() {
	document.getElementById("winMessage").style.display = "none";
	let elements = document.querySelectorAll("body > *:not(.modal)")
	for (let i=0; i< elements.length; i++) {
		elements[i].classList.remove("blurred");
	}
}

/** Main **/
startGame();
