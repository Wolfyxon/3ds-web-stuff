window.addEventListener('load', function() {
	const canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		status = document.getElementById('status'),
		start = document.getElementById('start'),
		size = 10,
		rows = 200 / size,
		cols = 400 / size;
	var snake,
		moveX,
		moveY,
		foodX,
		foodY,
		paused = true,
		allowKey = true,
		wrapfield = true;

	function placeFood() {
		const newX = Math.floor(Math.random() * cols),
			newY = Math.floor(Math.random() * rows),
			data = ctx.getImageData(newX * size, newY * size, 1, 1).data;
		if (data[0] === 0) {
			foodX = newX;
			foodY = newY;
		}
	}

	function setStatus() {
		start.disabled = false;
		status.style.display = 'block';
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
		start.style.display = 'none';
		status.style.removeProperty('display');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		paused = false;
		moveX = 1;
		moveY = 0;
		foodX = -1;
		foodY = -1
		snake = [
			[cols * 0.5, rows * 0.5]
		];
	}

	setInterval(function() {
		if (paused) return;

		if (foodX < 0) placeFood();

		// Add food
		if (foodX > -1 && foodY > -1) {
			ctx.fillStyle = 'red';
			ctx.fillRect(foodX * size, foodY * size, size, size);
		}

		ctx.fillStyle = 'white';

		// Add new head pos
		const cur = snake[snake.length - 1],
			newX = cur[0] + moveX,
			newY = cur[1] + moveY,
			data = ctx.getImageData(newX * size, newY * size, 1, 1).data;
		if (!wrapfield && ((newX < 0) || (newX >= cols) || (newY < 0) || (newY >= rows))) {
			paused = true;
			lost = true;
			setStatus();
			return;
		} else if (data[0] !== 0 && newX !== foodX && newY !== foodY && newX > 0 && newY > 0) { // Check if you bite yourself
			paused = true;
			lost = true;
			setStatus();
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
		} else {
			const old = snake[0];
			ctx.clearRect(old[0] * size, old[1] * size, size, size);
			snake.splice(0, 1);
		}
		allowKey = true;
	}, 150);

	document.addEventListener('keydown', function(e) {
		const k = e.keyCode;
		if (paused && k === 65) reset(); // a

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
		start.disabled = true;
		reset();
	})
});