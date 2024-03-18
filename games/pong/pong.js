window.addEventListener('load', function() {
	const field = document.getElementById('field'),
		width = field.offsetWidth,
		height = field.offsetHeight,
		enemyScoreTxt = document.getElementById('score-enemy'),
		playerScoreTxt = document.getElementById('score-player'),
		levelTxt = document.getElementById('level'),
		text = document.getElementById('text'),
		y = height * 0.4,
		countdown = 3,
		originalBallSpeed = 2;

	var level = 1,
		active = false,
		ball = {
			ele: document.getElementById('ball'),
			x: width / 2.1,
			y: height / 2.1,
			w: 4,
			h: 4,
			rot: 0,
			speed: originalBallSpeed,
			accel: 1.06
		},
		player = {
			ele: document.getElementById('player'),
			x: 18,
			y: y,
			w: 8,
			h: 43,
			speed: 2,
			score: 0
		},
		enemy = {
			ele: document.getElementById('enemy'),
			x: width - 26,
			y: y,
			w: 8,
			h: 43,
			speed: 0.01,
			score: 0
		};

	function roundReset() {
		enemy.y = y;
		player.y = y;
		ball.x = width / 2.1;
		ball.y = height / 2.1;
		ball.rot = 0;
		ball.speed = originalBallSpeed;
		text.innerText = '';
		active = true;
	}

	function scheduleNextRound() {
		setTimeout(roundReset, 2000);
	}

	function lerp(a, b, alpha) {
		return a + alpha * ( b - a )
	}

	function moveLocalXY(x_, y_) {
		const angle = deg2rad(ball.rot);
		const localX = x_ * Math.cos(angle) - y_ * Math.sin(angle);
		const localY = x_ * Math.sin(angle) + y_ * Math.cos(angle);
		return [localX, localY];
	}

	function bounce(pad) {
		/*const cY = (pad.y + pad.h) / 2;
        const offsetFromCenter = ball.y - cY;
        const normalizedOffset = offsetFromCenter / ((pad.y + pad.h) / 2);
        const bounceAngle = normalizedOffset * 45;
        ballRotation = 180 - ball.rot + 2 * bounceAngle);*/
		if (ball.rot === 0) {
			ball.rot = randi(1, 10);
			if (randi(0, 1) === 1) ball.rot *= -1;
		}
		ball.rot = 180 - ball.rot;
		ball.speed *= ball.accel;

		const bNew = moveLocalXY(ball.w, 0);
		ball.x += bNew[0];
		ball.y += bNew[1];
	}

	function updateScore() {
		playerScoreTxt.innerText = player.score;
		enemyScoreTxt.innerText = enemy.score;
	}

	function isTouching(target) {
		return !(ball.x > (target.x + target.w) ||
				 (ball.x + ball.w) < target.x ||
				 ball.y > (target.y + target.h) ||
				 (ball.y + ball.h) < target.y);
	}

	function registerCountdownUpdate(i) {
		text.style.color = 'orange';
		setTimeout(function() {
			text.innerText = (countdown-i);
		}, (countdown-(countdown-i)) * 1000);
	}

	for (var i=0; i<countdown; i++) {
		registerCountdownUpdate(i);
	}
	setTimeout(function() {
		active = true;
		text.innerText = '';
	}, countdown * 1000);

	var prevFrameTime = Date.now();
	setInterval(function() {
		const delta = (Date.now() - prevFrameTime) / 16;
		prevFrameTime = Date.now();

		if (active) {
			if (player.y > 0 && isBtnPressed('up')) {
				player.y += -player.speed * delta;
			}
			if ((player.y + player.h) < height && isBtnPressed('down')) {
				player.y += player.speed * delta;
			}

			enemy.y = lerp(Math.min(enemy.y, ball.y), Math.max(ball.y, enemy.y - enemy.h * 0.5), enemy.speed * level * delta);

			const bNew = moveLocalXY(ball.speed * delta, 0);
			ball.x += bNew[0];
			ball.y += bNew[1];

			if (isTouching(enemy)) bounce(enemy);
			if (isTouching(player)) bounce(player);

			if (ball.y <= 0 || ball.y >= height) {
				ball.rot = -ball.rot;
				ball.speed *= ball.accel;
			}

			if (ball.x <= 0) {
				active = false;
				text.innerText = 'AI scored';
				text.style.color = 'red';
				enemy.score++;
				scheduleNextRound();
				updateScore();
			} else if (ball.x > width) {
				active = false;
				text.innerText = 'You scored';
				text.style.color = 'lime';
				player.score++;
				level++;
				levelTxt.innerText = 'Level: ' + level;
				scheduleNextRound();
				updateScore();
			}

		}

		player.ele.style.top = Math.floor(player.y) + 'px';
		enemy.ele.style.top = Math.floor(enemy.y) + 'px';
		ball.ele.style.left = Math.floor(ball.x) + 'px';
		ball.ele.style.top = Math.floor(ball.y) + 'px';
	});
});