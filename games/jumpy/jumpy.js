window.addEventListener('load', function() {
	const gameoverTxt = document.getElementById('gameover'),
		timeText = document.getElementById('time'),
		highScoreText = document.getElementById('high-score'),
		topScreen = document.getElementById('top-screen'),
		player = document.getElementById('player'),
		imgSpike = document.getElementById('img-spike'),
		jumpyHeight = 65,
		jumpyWidth = 45,
		defaultSpeed = 3,
		hitboxMultiplier = 0.85;

	var speed = defaultSpeed,
		gravity = 2.4,
		jumpPower = 0,
		yOffset = 0,
		time = 0,
		highScore = 0,
		spikes = [
			// [x, ele]
		],
		jumpyRun1 = false,
		active = false,
		resetCooldown = false;

	function jump() {
		if (resetCooldown) return;
		if (!active) reset();
		if (jumpPower > 0 || !isOnGround()) return;
		jumpPower = 130;
	}

	function reset() {
		time = 0;
		speed = defaultSpeed;
		gameoverTxt.innerText = '';
		highScoreText.style.color = '';
		for (var i=0; i<spikes.length; i++) {
			topScreen.removeChild(spikes[i][1]);
		}
		player.style.backgroundPositionX = '';
		spikes = [];
		active = true;
	}

	function addSpike(offset) {
		var thisX = 400 + (offset || 0);
		const spacing = 200;
		if (spikes.length > 0) {
			const x = spikes[spikes.length - 1][0];
			if (thisX - x < spacing) {
				thisX = x + spacing;
			}
		}
		const e = document.createElement('canvas');
		e.width = 9;
		e.height = 17;
		e.className = 'spike';
		e.style.visibility = 'hidden';
		const ctx = e.getContext('2d');
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(imgSpike, 0, 0, e.width, e.height);
		spikes.push([thisX, e]);
		topScreen.appendChild(e);
	}

	function isOnGround() {
		return yOffset > -1;
	}

	setInterval(function() {
		if (!active) return;
		time++;
		if (time > highScore) highScore = time;

		const timeValTxt = new Date(time * 1000).toISOString().slice(11,19),
			highTimeValTxt = new Date(highScore * 1000).toISOString().slice(11,19);

		timeText.innerText = 'Time: '  + timeValTxt;
		highScoreText.innerText = 'High score: ' + highTimeValTxt;
		if (highScore <= time) {
			highScoreText.style.color = '#279A00';
		}

		if (time%2) {
			const offset = randi(-20, 200);
			for (var i = 0; i < randi(1, 2); i++){
				addSpike(offset * i);
			}
			speed += 0.1;
		}
	}, 1000);

	// Sprite updating
	setInterval(function() {
		if (!active || jumpPower > 0) return;
		jumpyRun1 = !jumpyRun1;
		player.style.backgroundPositionX = jumpyRun1 ? '-45px' : '-90px';
	}, 100);

	// Controls and main loop
	var prevFrameTime = Date.now();
	setInterval(function() {
		if (isBtnPressed('a') || isBtnPressed('up')) jump();

		gravity = isBtnPressed('down') ? 30 : 2.4;

		const delta = (Date.now() - prevFrameTime) * 0.0625;
		prevFrameTime = Date.now();

		if (jumpPower > 0) jumpPower -= gravity * delta;

		yOffset = lerp(yOffset, -jumpPower, 0.3 * delta);
		if (yOffset > 0) yOffset = 0;

		for (var i=0; i<spikes.length; i++){
			const x = spikes[i][0];
			if(x < -30){
				topScreen.removeChild(spikes[i][1]);
				spikes.splice(i, 1);
				i--;
				continue;
			}
			if (active) {
				if( x > 2 && x < jumpyWidth * hitboxMultiplier && -yOffset < jumpyHeight * hitboxMultiplier){
					player.style.backgroundPositionX = '-135px';
					active = false;
					resetCooldown = true;
					gameoverTxt.innerText = 'GAME OVER';
					setTimeout(function() {
						resetCooldown = false;
					}, 200);
				}

				spikes[i][0] -= speed * delta;
			}
			spikes[i][1].style.visibility = '';
			spikes[i][1].style.left = x + 'px';
		}
		player.style.top = (152 + yOffset) + 'px';

	});

	window.addEventListener('click', jump);
});