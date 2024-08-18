window.addEventListener('load', function() {
	const canvas = document.getElementById('canv'),
		ctx = canvas.getContext('2d', { alpha: false }),
		btnStart = document.getElementById('btn-start'),
		hearts = document.getElementById('lives').children,
		overlay = document.getElementById('overlay'),
		overlayTitle = document.getElementById('title'),
		overlayGameover = document.getElementById('gameover'),
		plrY = 370,
		plrH = 5,
		plrW = 30,
		plrInitPos = new Vector2(canvas.width/2 - plrW/2, plrY),
		plrButtonSpeed = 0.3,
		player = new Rect2D(plrInitPos.copy(), plrW, plrH),
		ballSize = 4,
		ballAccel = 1.02,
		ballInitSpeed = 0.15,
		ballMaxSpeed = 0.5,
		ball = new Rect2D(new Vector2(canvas.width/2 - ballSize/2,canvas.height/2 - 100 - ballSize/2),ballSize, ballSize),
		initBallPos = ball.area.startVec.copy(),
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
		blockH = 8;

	var lives = hearts.length,
		ballSpeed = ballInitSpeed,
		active = false,
		blocks = [],
		blockW = 0;

	overlay.targetOpaticy = 1;
	player.fillStyle = '#8C7BFF';
	ball.fillStyle = 'white';
	resetBall();

	function createBlocks(columns, rows) {
		blocks = [];
		const padding = 5,
			spacing = 4,
			totalSpacing = spacing * (columns - 1);
		blockW = clamp((canvas.width - totalSpacing) / columns - padding/2, 0, 60);

		for(var row=0; row < rows; row++) {
			for(var col=0; col < columns; col++) {
				const block = {
					x: (canvas.width - (columns * (blockW + spacing) - spacing)) / 2 + col * (blockW + spacing),
					y: row * (blockH + spacing) + padding + 10
				};
				block.a = new Rect2D(new Vector2(block.x, block.y), blockW, blockH); // TEMP until canvasGame removal
				blocks.push(block);
				ctx.fillStyle = rowColors[row % rowColors.length];
				ctx.outlineSize = 1;
				ctx.outlineOpacity = 0.5;
				ctx.outlineStyle = rowColors[row % rowColors.length];
				ctx.fillRect(block.x, block.y, blockW, blockH);
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
	updateHearts()

	function resetBall(){
		ball.area.moveTo(initBallPos.copy());
		ballSpeed = ballInitSpeed;
		var offset = randf(5,20);
		if(randi(0,1) === 1) offset *= -1;
		ball.rotation = 180 + offset;
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

		if(ball.rotation === 0) ball.rotation += 1;
		ball.rotation = 180 - ball.rotation;
		ball.moveLocalXY(0, -ball.area.getHeight());

		if(active) {
			ballSpeed *= ballAccel;
			ballSpeed = clamp(ballSpeed, 0, ballMaxSpeed);
		}
	}

	function touchMove(e){
		if(!active) return;
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const touch = e.touches[0];
		const x = (touch.clientX - rect.left) * scaleX;

		e.preventDefault();
		player.area.moveTo(new Vector2(x, plrY));
	}

	function mouseMove(e){
		if(!active) return;
		if(e.buttons === 0) return;
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const x = (e.clientX - rect.left) * scaleX;

		player.area.moveTo(new Vector2(x, plrY));
	}

	function start() {
		if(!active) {
			lives = hearts.length;
			updateHearts();
			hideOverlay();
			resetBall();
			player.area.moveTo(plrInitPos.copy());
			active = true;
		}
	}

	createBlocks(8,5);

	var prevFrameTime = Date.now();
	setInterval(function() {
		const delta = (Date.now() - prevFrameTime);
		prevFrameTime = Date.now();

		// Remove old stuff
		ctx.fillStyle = '#000b1c';
		ctx.fillRect(0, plrY, plrW, plrH);
		ctx.fillRect(Math.floor(ball.oldX), Math.floor(ball.oldY), ball.w, ball.h); // Remove old ball

		// Draw new stuff
		ctx.fillStyle = '#000b1c';
		ctx.fillRect(plrX, plrY, plrW, plrH);
		ctx.beginPath();
		ctx.arc(Math.floor(ball.x)+ball.w*0.5, Math.floor(ball.y)+ball.h*0.5, ball.w*0.5, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();
		
		const currentSpeed = -ballSpeed * delta;
		ball.moveLocalXY(0, currentSpeed);
		ball.render(canvas);

		const bY = ball.getY();
		const bX = ball.getX();

		if ( (bY <= 0 || bX <= 0 || bX >= canvas.width) && preBounce()) {
			if(bY <= 0) {
				ball.rotation = 180 - ball.rotation;
			} else {
				ball.rotation = -ball.rotation;
			}
			if(active) {
				ballSpeed *= ballAccel;
				ballSpeed = clamp(ballSpeed, 0, ballMaxSpeed);
			}
		}

		if (bY >= canvas.height) {
			if(active) {
				lives -= 1;
				updateHearts();

				if(lives <= 0) {
					active = false;
					showOverlay();
					overlayTitle.style.display = "none";
					overlayGameover.style.display = "";
				} else {
					resetBall();
				}

			} else {
				ball.rotation = 180 -  ball.rotation;
			}
		}

		if(bY > 100) {
			if(ball.area.isTouching(player.area) || ball.area.isInTheWay(player.area, new Vector2(0, currentSpeed), ball.rotation, 6)) {
				bounce();
			}
		}

		// Check block collision
		for(var i=0; i < blocks.length; i++) {
			const block = blocks[i];

			if(bY < 100 && ball.area.isTouching(block.a.area)) {
				bounce();
				if(active) {
					ctx.clearRect(block.x, block.y, blockW, blockH);
					blocks.splice(i,1);
					i--;
				}
			}
		}


		overlay.style.opacity = lerp(overlay.style.opacity, overlay.targetOpaticy, 0.01 * delta);

		if (active) {
			if(isBtnPressed('left') && player.getX() > 0) player.area.offsetXY(-plrButtonSpeed * delta, 0)
			if(isBtnPressed('right') && (player.getX() + plrW ) < canvas.width) player.area.offsetXY(plrButtonSpeed * delta, 0)
		} else {
			player.area.moveTo(new Vector2(ball.getCenter().x - plrW/2, plrY));
		}

	});

	onBtnJustPressed('a', start);
	btnStart.addEventListener('click', start, false);

	window.addEventListener('touchmove', touchMove, false);
	window.addEventListener('touchstart', touchMove, false);
	window.addEventListener('mousemove', mouseMove, false);
	window.addEventListener('mousedown', mouseMove, false);
}, false);