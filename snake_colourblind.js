//Entities

const ctx = document.querySelector("#canvas").getContext("2d");
const unit = 32;

let Food = () => {
	let x = Math.floor(Math.random() * (17 - 1) + 2) * unit;
	let y = Math.floor(Math.random() * (17 - 1) + 3)* unit;
	return {x, y};
};

const GameBoard = (() => {
	const RIGHT_WALL = 17*unit;
	const LEFT_WALL = 2*unit;
	const BOTTOM_WALL = 17*unit;
	const TOP_WALL = 4*unit;
	
	let foodItem = Food();
	
	const newFood = () => {
		foodItem = Food();
	}

	const getFood = () => {
		return foodItem;
	}
	
	return {unit, RIGHT_WALL, LEFT_WALL, BOTTOM_WALL, TOP_WALL, getFood, newFood};
})();


const Snake = (() => {
	let x = 10 * unit;
	let y = 10 * unit;
	let dir = "r";
	let living = true;

	let body = [];
	body.unshift({x, y});

	const moveRight = () => {
		x = body[0].x + unit;
		//console.log("x is: " + x);
		body.unshift({x, y});
		if (collision()){
			dies();
		}
		body.pop();
	}

	const moveLeft = () => {
		x = body[0].x - unit;
		body.unshift({x, y});
		if (collision()){
			dies();
		}
		body.pop();
	}

	const moveUp = () => {
		y = body[0].y - unit;
		body.unshift({x, y});
		if (collision()){
			dies();
		}
		body.pop();
	}

	const moveDown = () => {
		y = body[0].y + unit;
		body.unshift({x, y});
		if (collision()){
			dies();
		};
		body.pop();
	}

	const hasEaten = () => {
		let food = GameBoard.getFood();
		if (body[0].x == food.x && body[0].y == food.y){
			body.push(Object.assign({}, body[0]));
			GamePlay.updateScore();
			return true;
		}
		else{
			return false;
		}
	} 

	const collision = () => {
		for (let i = 0; i < body.length; i++){
			if (i !== 0 && body[0].x == body[i].x && body[0].y == body[i].y){
				return true;
			}
		}
		return false;
	}

	const isAlive = () => {
		return living;
	}

	const dies = () => {
		console.log("dies");
		living = false;
	}

	const reset = () => {
		body = [];
		body.unshift({x: 10*unit, y: 10*unit});

		console.log("x is: " + body[0].x);
		console.log("y is: " + body[0].y);
		dir = "r";
		living = true;
		return body;
	}

	return {body, dir, moveLeft, moveRight, moveDown, moveUp, hasEaten, isAlive, dies, reset};
})();


//Gameplay



//Controls

const Controls = (() => {

	const direction = (event) => {
		if (event.keyCode == 37 && Snake.dir != "r"){
			Snake.dir = "l";
		}
		else if (event.keyCode == 38 && Snake.dir != "d"){
			Snake.dir = "u";
		}
		else if (event.keyCode == 39 && Snake.dir != "l"){
			Snake.dir = "r";
		}
		else if (event.keyCode == 40 && Snake.dir != "u"){
			Snake.dir = "d";
		}
	}

	document.addEventListener("keydown", direction);

})();


//Display

const Display = (() => {

	let boardSwitchCount = 0;

	let greenColors = [{r: 128, g: 132, b: 70}, {r:197, g:194, b:119}, {r:162, g:162, b:109},
	{r:194, g:195, b:119}, {r:165, g:170, b:90}, {r:195, g:196, b:119}, {r:139, g:136, b:68},
	{r:179, g:181, b:132}, {r:196, g:197, b:120}, {r:130, g:136, b:68}, {r:128, g:132, b:70}];

	let redColors = [{r:197, g:94, b:69}, {r:250, g:185, b:146}, {r:227, g:185, b:131}, 
	{r:192, g:104, b:89}, {r:207, g:149, b:122}, {r:240, g:186, b:128}, {r:214, g:169, b:137},
	{r:193, g:135, b:93}];

	let boardMap = []; //empty array, to be 2D
	

	let scoreBoard = document.querySelector("#scoreBoard");
	let bg = new Image();
	bg.src = "./images/background_colourblind.jpg";

	const drawBoardBackground = () => {
		ctx.rect(unit, unit, 19*unit, 19*unit);
		ctx.stroke();
		ctx.drawImage(bg, 0, 0);
	}

	const redChoice = () => {
		let x = Math.random();
		if (x < 0.333){
			return true;
		}
		else{
			return false;
		}
	}
	
	const generateColours = () => {
		let xIndex = 0;
			for (let x = unit; x < 19*unit; x += unit){
				boardMap[xIndex] = []; // new x row to be filled with y's
				for (let y = 3*unit; y < 19*unit; y += unit){
					if (redChoice()){
						let redIndex = Math.floor(Math.random() * redColors.length);
						let squareColour = "rgb(" + redColors[redIndex].r + ", " + redColors[redIndex].g +
						", " + redColors[redIndex].b + ")";
						boardMap[xIndex].push(squareColour);
					}
					else{
						let greenIndex = Math.floor(Math.random() * greenColors.length);
						let squareColour = "rgb(" + greenColors[greenIndex].r + ", " + greenColors[greenIndex].g +
						", " + greenColors[greenIndex].b + ")";
						boardMap[xIndex].push(squareColour);
					}
					ctx.fillRect(x, y, x+unit, y+unit);
				}
				xIndex++;
			}
	}

	const makeBoard = () => {
		for (let x = 0; x < boardMap.length; x++){
				for (let y = 0; y <= boardMap[x].length; y++){
					if (y < boardMap[x].length){
						ctx.fillStyle = boardMap[x][y];
						ctx.fillRect((x + 1)*unit, (y+3)*unit, ((x+1)*unit)+unit, ((y+3)*unit)+unit);
					}
					else { //bottom border
						ctx.fillStyle = "#7A904C";
						ctx.fillRect((x + 1)*unit, (y+3)*unit, ((x+1)*unit)+unit, ((y+3)*unit)+unit);
				}
				
				}
				
			}
		//right wall of board
		ctx.fillStyle = "#7A904C";
		for (let y = 0; y < boardMap[0].length; y++){
			ctx.fillRect((boardMap.length + 1)*unit, ((y+2)*unit)+unit, ((boardMap[0].length + 3)*unit)+unit, ((y+3)*unit)+unit);
		}
		
		
	}

	const draw = () => {

		let food = GameBoard.getFood();
		let foodItem = {
			style: "red",
			x_loc: food.x,
			y_loc: food.y,
		};

		drawBoardBackground();
		// the dynamic game board
		if (boardSwitchCount % 5 == 0){
			boardMap = [];
			generateColours();
			boardSwitchCount = 1;
		}
		boardSwitchCount++;
		makeBoard();

		//the snake
		for (let i = 0; i < Snake.body.length; i++){
			ctx.lineWidth = 3;
			if (i % 2 == 0 && boardSwitchCount % 10 < 5){
				ctx.strokeStyle = "rgb(207,149,122)";
			}
			else if (i % 2 == 0 && boardSwitchCount % 10 > 5){
				ctx.strokeStyle = "rgb(197,201,116)";
			}
			else if (i % 2 == 1 && boardSwitchCount % 10 < 5){
				ctx.strokeStyle = "rgb(197,201,116)";
			}
			else{
				ctx.strokeStyle = "rgb(207,149,122)";
			}
			
			ctx.strokeRect((Snake.body[i].x - 1), (Snake.body[i].y - 1), (unit + 1), (unit + 1));
			
			if (i % 2 == 0 && boardSwitchCount % 10 < 5){
				ctx.fillStyle = "rgb(197,201,116)";
			}
			else if (i % 2 == 0 && boardSwitchCount % 10 > 5){
				ctx.fillStyle = "rgb(207,149,122)";
			}
			else if (i % 2 == 1 && boardSwitchCount % 10 < 5){
				ctx.fillStyle = "rgb(207,149,122)";
			}
			else{
				ctx.fillStyle = "rgb(197,201,116)";
			}
			
			ctx.fillRect(Snake.body[i].x, Snake.body[i].y, unit, unit);
		}
		

		ctx.fillStyle = foodItem.style;
		ctx.fillRect(foodItem.x_loc, foodItem.y_loc, unit, unit);

		ctx.fillStyle = "#C3A575";
		ctx.font = "48px serif";
		let theScore = GamePlay.getScore();
		ctx.fillText("Score: " + theScore, unit, 2*unit);

	}

	const gameOverDisplay = () => {
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0,0,20*unit, 20*unit);
		ctx.fillStyle = "white";
		ctx.font = "62px serif";
		ctx.fillText("GAME OVER", 4*unit, 11*unit);
	}

	const updateScoreBoard = () => {
		let r = Math.floor(Math.random() * 255);
		let g = Math.floor(Math.random() * 255);
		let b = Math.floor(Math.random() * 255);

		let row = document.createElement("TR");
		let c = Math.floor(Math.random() * redColors.length);

		row.style.color = "rgb(" + redColors[c].r + "," + redColors[c].g + "," + redColors[c].b + ")";
		let name = row.insertCell(0);
		name.innerHTML = uiElements.getPlayerName();
		let score = row.insertCell(1);
		score.innerHTML = GamePlay.getScore(); 
		scoreBoard.appendChild(row);
	}
	
	return {drawBoardBackground, draw, gameOverDisplay, updateScoreBoard};
})();


const GamePlay = (() => {

	let score = 0;
	let scores = [];

	const update = () => {
		if (Snake.dir == "l" && Snake.body[0].x >= GameBoard.LEFT_WALL){
			Snake.moveLeft();
		}
		else if (Snake.dir == "u" && Snake.body[0].y >= GameBoard.TOP_WALL){
			Snake.moveUp();
		}
		else if (Snake.dir == "r" && (Snake.body[0].x) <= GameBoard.RIGHT_WALL){
			Snake.moveRight();
		}
		else if (Snake.dir == "d" && Snake.body[0].y <= GameBoard.BOTTOM_WALL){
			Snake.moveDown();
		}

		if (Snake.hasEaten()){
			GameBoard.newFood();
		}

		if (!Snake.isAlive()){
			clearInterval(updateInterval);
			clearInterval(drawInterval);
			Display.updateScoreBoard();
			Display.gameOverDisplay();
			uiElements.replayBtn.style.display = "block";
		}

	}


	const updateScore = () => {
		score++;
	}

	const getScore = () => {
		return score;
	}

	const restartGame = () => {
		score = 0;
		Snake.body = Snake.reset();
		uiElements.askPlayerName();
		updateInterval = setInterval(update, 150);
		drawInterval = setInterval(Display.draw, 100);
		uiElements.replayBtn.style.display = "none";
	}
	
	//update
	let updateInterval = setInterval(update, 150);
	//render
	let drawInterval = setInterval(Display.draw, 100);
	
	return {updateScore, getScore, restartGame};
	
})();

const uiElements = (() => {

	const replayBtn = document.querySelector("#replayButton");
	replayBtn.addEventListener("click", GamePlay.restartGame);

	let count = 1;
	let playerName = "Player " + count;
	const askPlayerName = () => {
		let name = prompt("Please enter a name: ", playerName);
		if (name == ""){
			playerName = "No one";
		}
		else {
			playerName = name;
		}
		count++;
	}

	const getPlayerName = () => {
		return playerName;
	}
	

	return {replayBtn, getPlayerName, askPlayerName};
})();

uiElements.askPlayerName();
Display.drawBoardBackground();
