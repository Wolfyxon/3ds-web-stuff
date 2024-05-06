window.addEventListener('load', function() {
	const canv = document.getElementById('canvas'),
		ctx = canv.getContext('2d', {
			alpha: false,
			willReadFrequently: true
		}),
		status = document.getElementById('status'),
		start = document.getElementById('start'),
		foodTxt = document.getElementById('food-eaten'),
		timeTxt = document.getElementById('time'),
		gamemodeContainer = document.getElementById("gamemode-container"),
		btnEnableWalls = document.getElementById("btn-enable-walls"),
		btnDisableWalls = document.getElementById("btn-disable-walls"),
		size = 10,
		rows = canv.height / size,
		cols = canv.width / size,
		back1 = '#6abe30',
		back2 = '#99e550';
	var snake = [],
		moveX,
		moveY,
		foodX,
		foodY,
		foodEaten = 0,
		time = 0,
		paused = true,
		allowKey = true,
		wrapfield = false;

	function drawBackground(x, y) {
		ctx.fillStyle = x%2-y%2 ? back1 : back2;
		ctx.fillRect(x*size, y*size, size, size);
	}
	for (var Y=0; Y<rows; Y++) {
		for (var X=0; X<cols; X++) {
			drawBackground(X, Y)
		}
	}

	function placeFood() {
		const newX = Math.floor(Math.random() * cols),
			newY = Math.floor(Math.random() * rows),
			data = ctx.getImageData(newX * size, newY * size, 1, 1).data;
		if (data[0] === back1 || data[0] === back1 || data[0] === 255) return;
		foodX = newX;
		foodY = newY;
	}

	function setStatus() {
		start.disabled = false;
		start.style.opacity = null;
		status.style.display = 'block';
		gamemodeContainer.style.pointerEvents = null;
		gamemodeContainer.style.opacity = null;
		start.style.removeProperty('display');
		if (lost) {
			status.style.color = 'red';
			status.textContent = 'Game Over!';
		} else if (won) {
			status.style.color = 'green';
			status.textContent = 'You won!';
		}
	}

	function reset() {
		start.disabled = true;
		start.style.opacity = "0.5";
		gamemodeContainer.style.opacity = "0.5";
		gamemodeContainer.style.pointerEvents = 'none';
		status.style.removeProperty('display');
		for (var i=0; i<snake.length; i++) {
			drawBackground(snake[i][0], snake[i][1]);
		}
		if (foodX > -1 && foodY > -1) {
			drawBackground(foodX, foodY);
		}
		paused = false;
		moveX = 1;
		moveY = 0;
		foodX = -1;
		foodY = -1;
		foodEaten = 0;
		time = 0;
		snake = [
			[Math.floor(cols * 0.5), Math.floor(rows * 0.5)]
		];
		updateFoodCounter();
		updateTime();
	}

	function updateFoodCounter() {
		foodTxt.innerText = foodEaten;
	}

	function updateTime() {
		timeTxt.innerText = new Date(time * 1000).toISOString().slice(11,19);
	}

	function die() {
		paused = true;
		lost = true;
		setStatus();
	}

	function updateGamemodes() {
		const bg = "#00AA00";

		btnEnableWalls.style.backgroundColor = "";
		btnDisableWalls.style.backgroundColor = "";

		if(wrapfield) {
			btnDisableWalls.style.backgroundColor = bg;
		} else {
			btnEnableWalls.style.backgroundColor = bg;
		}

	}
	updateGamemodes();

	setInterval(function() {
		if (paused) return;

		if (foodX < 0) placeFood();

		// Add food
		if (foodX > -1 && foodY > -1) {
			ctx.fillStyle = 'red';
			ctx.strokeStyle = 'red';

			//ctx.fillRect(foodX * size, foodY * size, size, size);
			ctx.beginPath();
			ctx.arc((foodX * size) + size / 2,(foodY * size) + size / 2, size*0.4, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
		}

		ctx.fillStyle = 'white';

		// Add new head pos
		const cur = snake[snake.length - 1],
			newX = cur[0] + moveX,
			newY = cur[1] + moveY,
			data = ctx.getImageData(newX * size + 5, newY * size + 5, 1, 1).data;
		if (!wrapfield && ((newX < 0) || (newX >= cols) || (newY < 0) || (newY >= rows))) {
			die();
			return;
		} else if (data[0] === 255 && newX !== foodX && newY !== foodY && newX > 0 && newY > 0) { // Check if you bite yourself
			die();
			return;
		} else if (snake.length === rows * cols) won = true;

		snake.push([(newX < 0) ? cols : ((newX >= cols) ? 0 : newX), (newY < 0) ? rows : ((newY >= rows) ? 0 : newY)]);

		// Draw new head
		const now = snake[snake.length - 1];
		ctx.fillRect(now[0] * size, now[1] * size, size, size);

		// Only remove tail if length < 3
		if (snake.length < 4) return;

		// Eat apple or remove tail
		if (now[0] === foodX && now[1] === foodY) {
			foodX = -1;
			foodY = -1;
			foodEaten++;
			updateFoodCounter();
		} else {
			const old = snake[0];
			drawBackground(old[0], old[1]);
			snake.splice(0, 1);
		}
		allowKey = true;
	}, 150);

	setInterval(function (){
		if(paused) return;
		time++;
		updateTime();
	}, 1000);

	document.addEventListener('keydown', function(e) {
		const k = e.keyCode;
		if (paused && ( (k === 65) || (k === 13) ) ) reset(); // a

		if (!allowKey || paused) return;

		if (k === 37 && moveX === 0) { // left
			moveX = -1;
			moveY = 0;
			allowKey = false;
		} else if (k === 38 && moveY === 0) { // up
			moveX = 0;
			moveY = -1;
			allowKey = false;
		} else if (k === 39 && moveX === 0) { // right
			moveX = 1;
			moveY = 0;
			allowKey = false;
		} else if (k === 40 && moveY === 0) { // down
			moveX = 0;
			moveY = 1;
			allowKey = false;
		}
	});

	start.addEventListener('click', function() {
		reset();
	});

	btnDisableWalls.addEventListener('click', function() {
		wrapfield = true;
		updateGamemodes();
	});

	btnEnableWalls.addEventListener('click', function() {
		wrapfield = false;
		updateGamemodes();
	});
});