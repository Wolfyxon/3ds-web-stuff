window.addEventListener('load', function() {
	//'use strict';
	const canvas = document.getElementById('canv'),
		canvas2 = document.getElementById('canv2'),
		ctx = canvas.getContext('2d'),
		ctx2 = canvas2.getContext('2d', {alpha: false}),
		btnStart = document.getElementById('btn-start'),
		hearts = document.getElementById('lives').children,
		overlay = document.getElementById('overlay'),
		overlayTitle = document.getElementById('title'),
		overlayGameover = document.getElementById('gameover'),
		usePerformance = typeof(performance) !== 'undefined',
		background = '#000b1c',
		blockH = 8,
		rowColors = [
			'red',
			'orange',
			'yellow',
			'lime',
			'cyan',
			'blue',
			'purple',
			'magenta'
		],
		fps = is3DS() ? 30 : 60,
		speed = 5;
	var active = false,
		lives = hearts.length,
		time,
		blocks,
		blockW = 0,
		lives = 5,
		ball = {
			'x': 0,
			'y': 0,
			'd': 4,
			'oldX': 0,
			'oldY': 0,
			'rot': 0
		},
		player = {
			'x': 0,
			'y': 370,
			'w': 30,
			'h': 5,
			'oldX': 0
		};

	ball.oldX = ball.x;
	ball.oldY = ball.y;

	function isBallTouching(target) {
		return !(ball.x > (target.x + target.w) ||
				 (ball.x + ball.d) < target.x ||
				 ball.y > (target.y + target.h) ||
				 (ball.y + ball.d) < target.y);
	}

	function moveLocalXY(x_, y_) {
		const angle = deg2rad(ball.rot);
		return [
			x_ * Math.cos(angle) - y_ * Math.sin(angle),
			x_ * Math.sin(angle) + y_ * Math.cos(angle)
		]
	}

	function drawBlock(block) {
		ctx2.fillStyle = rowColors[block.r % rowColors.length];
		ctx2.outlineSize = 1;
		ctx2.outlineOpacity = 0.5;
		ctx2.outlineStyle = rowColors[block.r % rowColors.length];
		ctx2.fillRect(block.x, block.y, blockW, blockH);
	}
	function createBlocks(columns, rows) {
		blocks = [];
		const padding = 5,
			spacing = 4,
			totalSpacing = spacing * (columns - 1);
		blockW = clamp((canvas.width - totalSpacing) / columns - padding * 0.5, 0, 60);

		for (var row=0; row < rows; row++) {
			for (var col=0; col < columns; col++) {
				const block = {
					x: (canvas.width - (columns * (blockW + spacing) - spacing)) * 0.5 + col * (blockW + spacing),
					y: row * (blockH + spacing) + padding + 10,
					w: blockW,
					h: blockH,
					r: row
				};
				blocks.push(block);
				drawBlock(block);
			}
		}
	}

	function showOverlay() {
		btnStart.style.removeProperty('display');
		overlay.targetOpaticy = 1;
	}
	function hideOverlay() {
		btnStart.style.display = 'none';
		overlay.targetOpaticy = 0;
	}

	function updateHearts() {
		for(var i=0; i<hearts.length; i++) {
			const heart = hearts[hearts.length - 1 - i];
			if(i >= lives) {
				heart.src = "img/noLife.png";
			} else {
				heart.src = "img/life.png";
			}
		}
	}
	updateHearts();

	function drawBall() {
		ctx.clearRect(Math.floor(ball.oldX), Math.floor(ball.oldY), ball.d, ball.d);
		ctx.fillStyle = '#FFF';
		ctx.beginPath();
		ctx.arc(Math.floor(ball.x)+ball.d*0.5, Math.floor(ball.y)+ball.d*0.5, ball.d*0.5, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();
		ball.oldX = ball.x;
		ball.oldY = ball.y;
	}

	function drawPlayer() {
		if (player.oldX === player.x) return;
		if (player.x < 0) player.x = 0;
		if (player.x + player.w > canv.width) player.x = canv.width - player.w;
		ctx2.fillStyle = background;
		ctx2.fillRect(player.oldX-1, player.y, player.w+2, player.h);
		ctx2.fillStyle = '#8C7BFF';
		ctx2.fillRect(player.x, player.y, player.w, player.h);
		player.oldX = player.x;
	}

	function touchMove(e){
		if (!active) return;
		const rect = canvas.getBoundingClientRect(),
			scaleX = canvas.width / rect.width,
			touch = e.touches[0];
		player.x = (touch.clientX - rect.left) * scaleX;
		e.preventDefault();
		drawPlayer();
	}

	function mouseMove(e){
		if (!active || e.buttons === 0) return;
		const rect = canvas.getBoundingClientRect(),
			scaleX = canvas.width / rect.width;
		player.x = (e.clientX - rect.left) * scaleX;
		drawPlayer();
	}

	function getTimeStamp() {
		return usePerformance ? performance.now() : new Date().getTime();
	}

	function resetBall() {
		ball.x = canvas.width * 0.5 - ball.d * 0.5;
		ball.y = canvas.height * 0.5 - 100 - ball.d * 0.5;
		//ballSpeed = ballInitSpeed;
		var offset = randf(5,20);
		if(randi(0,1) === 1) offset *= -1;
		ball.rot = 180 + offset;
	}

	var lastBounce = 0;
	const bounceCooldown = 100;

	function preBounce(){
		const now = Date.now();
		if(now < lastBounce+bounceCooldown) return false;
		lastBounce = now;
		return true;
	}

	function bounce(){
		if(!preBounce()) return;

		if(ball.rot === 0) ball.rot += 1;
		ball.rot = 180 - ball.rot;
		const bNew = moveLocalXY(0, -ball.d);
		ball.x += bNew[0];
		ball.y += bNew[1];
		drawBall();

		if(active) {
			//ballSpeed *= ballAccel;
			//ballSpeed = clamp(ballSpeed, 0, ballMaxSpeed);
		}
	}

	function reset() {
		lives = hearts.length;
		updateHearts();
		resetBall();
		createBlocks(8, 5);
		drawPlayer();
		drawBall();
	}
	function start() {
		if (active) return;
		reset();
		hideOverlay();
		active = true;
	}

	function update() {
		var now = getTimeStamp(),
			deltaTime = now - (time || now),
			increment = Math.floor(speed * (fps / 1000) * deltaTime);
		time = now;

		const bNew = moveLocalXY(0, increment);
		ball.x += bNew[0];
		ball.y += bNew[1];
		drawBall();

		if ( (ball.y <= 0 || ball.x <= 0 || ball.x >= canvas.width) && preBounce()) {
			if(ball.y <= 0) {
				ball.rot = 180 - ball.rot;
			} else {
				ball.rot = -ball.rot;
			}
			if(active) {
				//ballSpeed *= ballAccel;
				//ballSpeed = clamp(ballSpeed, 0, ballMaxSpeed);
			}
		}

		if (ball.y >= canvas.height) {
			if (active) {
				lives -= 1;
				updateHearts();

				if (lives <= 0) {
					active = false;
					resetBall();
					showOverlay();
					overlayTitle.style.display = 'none';
					overlayGameover.style.display = '';
				} else {
					resetBall();
				}

			} else {
				ball.rotation = 180 - ball.rotation;
			}
		}

		if (ball.y > 360 && isBallTouching(player)) bounce();

		// Check block collision
		if (ball.y < 80) {
			for (var i=0; i < blocks.length; i++) {
				const block = blocks[i];
	
				if (isBallTouching(block)) {
					bounce();
					if (active) {
						ctx2.fillStyle = background;
						ctx2.fillRect(block.x, block.y, blockW, blockH);
						blocks.splice(i,1);
						i--;
					}
				}
			}
		}

		overlay.style.opacity = lerp(overlay.style.opacity, overlay.targetOpaticy, 0.01 * deltaTime);

		if (active) {
			if (isBtnPressed('left') && player.x > 0) {
				player.x = player.x - increment;
				drawPlayer();
			} else if (isBtnPressed('right') && (player.x + player.w ) < canvas.width) {
				player.x = player.x + increment;
				drawPlayer();
			}
		} else {
			player.x = ball.x+ball.d*0.5 - player.w*0.5;
			drawPlayer();
		}
	}

	overlay.targetOpaticy = 1;
	reset();

	var intervalID = document.hidden ? 0 : setInterval(update);
	window.addEventListener('blur', function() {
		console.log('Game paused');
		clearInterval(intervalID);
		intervalID = 0;
	}, false);
	window.addEventListener('focus', function() {
		if (!intervalID) {
			console.log('Game resumed');
			time = getTimeStamp();
			intervalID = setInterval(update);
		}
	}, false);

	onBtnJustPressed('a', start);
	btnStart.addEventListener('click', start, false);
	window.addEventListener('touchmove', touchMove, false);
	window.addEventListener('touchstart', touchMove, false);
	window.addEventListener('mousemove', mouseMove, false);
	window.addEventListener('mousedown', mouseMove, false);
}, false);