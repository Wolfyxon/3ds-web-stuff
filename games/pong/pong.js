window.addEventListener('load', function() {
	const canv = document.getElementById('canv'),
		ctx = canv.getContext('2d', {alpha: false}),
		width = canv.width,
		height = canv.height,

		enemyScoreTxt = document.getElementById('score-enemy'),
		playerScoreTxt = document.getElementById('score-player'),
		levelTxt = document.getElementById('level'),
		text = document.getElementById('text'),
		y = height * 0.4,
		countdown = 3,
		originalBallSpeed = 2,
		maxBallSpeed = 7;

	var level = 1,
		active = false,
		ball = {
			x: width / 2.1,
			y: height / 2.1,
			w: 6,
			h: 6,
			rot: 0,
			speed: originalBallSpeed,
			accel: 1.06
		},
		player = {
			x: 18,
			y: y,
			w: 8,
			h: 43,
			speed: 2,
			score: 0
		},
		enemy = {
			x: width - 26,
			y: y,
			w: 8,
			h: 43,
			speed: 0.01,
			score: 0
		};

	enemy.rect = new Rect2D(new Vector2(width - player.x * 1.5, y), enemy.w, enemy.h);

	ctx.fillStyle = '#5700ff';
	ctx.fillRect(0, 0, canv.width, canv.height);
	ctx.fillStyle = '#fff';

	function removeOld() {
		ctx.fillStyle = '#5700ff';
		ctx.fillRect(player.x, Math.floor(player.oldY), player.w, player.h);
		ctx.fillRect(enemy.x, Math.floor(enemy.oldY), enemy.w, enemy.h);
		ctx.fillRect(Math.floor(ball.oldX), Math.floor(ball.oldY), ball.w, ball.h);
	}

	function saveOld() {
		player.oldY = player.y;
		enemy.oldY = enemy.y;
		ball.oldX = ball.x;
		ball.oldY = ball.y;
	}

	function roundReset() {
		saveOld();
		removeOld();
		enemy.y = y;
		player.y = y;
		enemy.rect.area.moveTo(new Vector2(enemy.x, enemy.y));
		ball.x = width / 2.1;
		ball.y = height / 2.1;
		ball.rot = 0;
		ball.speed = originalBallSpeed;
		text.textContent = '';
		active = true;
	}

	function scheduleNextRound() {
		setTimeout(roundReset, 2000);
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
		if(ball.speed < maxBallSpeed) {
			ball.speed *= ball.accel + (level * 0.01);
		}


		const bNew = moveLocalXY(ball.w, 0);
		ball.x += bNew[0];
		ball.y += bNew[1];
	}

	function updateScore() {
		playerScoreTxt.textContent = player.score;
		enemyScoreTxt.textContent = enemy.score;
	}

	function isBallTouching(target) {
		return !(ball.x > (target.x + target.w) ||
				 (ball.x + ball.w) < target.x ||
				 ball.y > (target.y + target.h) ||
				 (ball.y + ball.h) < target.y);
	}

	function registerCountdownUpdate(i) {
		text.style.color = 'orange';
		setTimeout(function() {
			text.textContent = (countdown-i);
		}, (countdown-(countdown-i)) * 1000);
	}

	for (var i=0; i<countdown; i++) {
		registerCountdownUpdate(i);
	}
	setTimeout(function() {
		active = true;
		text.textContent = '';
	}, countdown * 1000);

	var prevFrameTime = Date.now();
	setInterval(function() {
		const delta = (Date.now() - prevFrameTime) / 16;
		prevFrameTime = Date.now();

		saveOld();
		if (active) {
			if (player.y > 0 && isBtnPressed('up')) {
				player.y += -player.speed * delta;
			} else if ((player.y + player.h) < height && isBtnPressed('down')) {
				player.y += player.speed * delta;
			}
			enemy.rect.area.moveTo(
				enemy.rect.area.startVec.getLerped(new Vector2(enemy.x, ball.y - enemy.h * 0.5), enemy.speed * level * delta)
			);
			var gTL = enemy.rect.area.getTopLeft();
			enemy.y = Math.floor(gTL.y);
			if (enemy.y < 0) enemy.y = 0;
			if (enemy.y + enemy.h > height) enemy.y = height - enemy.h;

			const bNew = moveLocalXY(ball.speed * delta, 0);
			ball.x += bNew[0];
			ball.y += bNew[1];

			if (isBallTouching(enemy)) bounce(enemy);
			if (isBallTouching(player)) bounce(player);

			if (ball.y <= 0 || ball.y+ball.h >= height) {
				ball.rot = -ball.rot;
				ball.speed *= ball.accel;
			}

			if (ball.x <= 0) {
				active = false;
				text.textContent = 'AI scored';
				text.style.color = 'red';
				enemy.score++;
				scheduleNextRound();
				updateScore();
			} else if (ball.x+ball.w >= width) {
				active = false;
				text.textContent = 'You scored';
				text.style.color = 'lime';
				player.score++;
				level++;
				levelTxt.textContent = 'Level: ' + level;
				scheduleNextRound();
				updateScore();
			}

		}

		removeOld();
		ctx.fillStyle = '#fff';
		ctx.fillRect(player.x, Math.floor(player.y), player.w, player.h);
		ctx.fillRect(enemy.x, Math.floor(enemy.y), enemy.w, enemy.h);
		ctx.beginPath();
		ctx.arc(Math.floor(ball.x)+ball.w*0.5, Math.floor(ball.y)+ball.h*0.5, ball.w*0.5, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();
	});
}, false);
