depend("canvasGame");

// TODO: After elementGame is complete, migrate

window.addEventListener("load", function() {
	const bgEle = document.getElementById("bg"),
		canvas = document.getElementById("canv"),

		imgWingUp = document.getElementById("img-pigeon1"),
		imgWingDown = document.getElementById("img-pigeon2"),
		imgPipe = document.getElementById("img-pipe"),

		txtPipes = document.getElementById("txt-pipes"),
		txtHighScore = document.getElementById("txt-high-score"),
		txtFps = document.getElementById("txt-fps"),
		gameover = document.getElementById("gameover"),

		startY = 70,

		pigeon = new CanvasSprite(imgWingUp,10,startY),
		hitbox = pigeon.area.copy();

	var started = false,
		alive = true,
		resetCooldown = false,

		passedPipes = 0,
		highScore = 0,

		yForce = 0,

		pipes = [];

	gameover.style.visibility = "hidden";

	function addPipes(y){
		if(!y) y = -40;
		const gap = 152,
			startX = 300,
			scale = 0.5;
		pipes.push(new CanvasSprite(imgPipe,startX,y,180).rescale(scale));
		pipes.push(new CanvasSprite(imgPipe,startX,y+gap).rescale(scale));
	}

	function spawnPipes(){
		addPipes(randi(-100,-50));
	}

	function switchSprite(){
		if(pigeon.image === imgWingUp) pigeon.image = imgWingDown;
		else pigeon.image = imgWingUp;
	}

	function die(){
		if(!alive) return;
		bgEle.style.animationPlayState = 'paused';
		bgEle.style.webkitAnimationPlayState = 'paused';
		resetCooldown = true;
		alive = false;
		gameover.style.visibility = "";
		setTimeout(function(){
			resetCooldown = false;
		},200);
	}

	function reset(){
		alive = true;
		passedPipes = 0;
		txtPipes.innerText = passedPipes;
		pipes = [];
		gameover.style.visibility = "hidden";
		pigeon.rotation = 0;
		pigeon.area.moveTo(new Vector2(pigeon.getX(),startY));
		txtHighScore.style.color = "";
		startBgAnim();
	}

	function startBgAnim(){
		bgEle.style.animationPlayState = 'running';
		bgEle.style.webkitAnimationPlayState = 'running';
	}

	function jump(){
		if(!started){
			document.getElementById("prestart").style.visibility = "hidden";
			bgEle.style.animationPlayState = 'running';
			bgEle.style.webkitAnimationPlayState = 'running';
			started = true;
		}
		if(!alive && !resetCooldown){
			reset();
		}
		if(alive){
			yForce = -2;
			pigeon.rotation = -20;
		}
	}

	setInterval(function(){
		if(!alive) return;
		switchSprite();
	},200);


	const jumpCodes = [65, 13, 38];
	var jumpHeld = false;
	window.addEventListener("keydown", function (e){
		if(jumpHeld) return;
		jumpHeld = true;
		if(includes(jumpCodes, e.keyCode)) jump();
	}, false);

	window.addEventListener("keyup", function (e){
		if(includes(jumpCodes, e.keyCode)) jumpHeld = false;
	}, false);

	// Main loop
	var bgPos = 0,
		prevFrameTime = Date.now();
	setInterval(function(){
		const delta = (Date.now() - prevFrameTime) / 16;
		prevFrameTime = Date.now();

		txtFps.innerText = (1000 / (delta * 16)).toFixed(2);

		if(alive && started){
			if(pipes.length > 0){
				const lastPipe = pipes[pipes.length - 1];
				if(lastPipe.getX() < 220) spawnPipes();
			} else {
				spawnPipes();
			}
		}

		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

		if(yForce < 3 && pigeon.getY() < 120 && started){
			yForce += 0.1 * delta;
			pigeon.rotation += delta;
		}
		if(!alive) pigeon.rotation += 3 * delta;

		if(pigeon.getY() > 150 || pigeon.getY() < -40) die();

		pigeon.moveXY(0,yForce * delta);
		hitbox.startVec = pigeon.area.startVec.copy();
		hitbox.endVec = pigeon.area.startVec.copy().offsetXY(30,20);

		for(var i=0;i<pipes.length;i++){
			const pipe = pipes[i];
			if(alive){
				pipe.moveXY(-0.8 * delta,0);
				if(pipe.area.isTouching(hitbox)){
					die();
				}
			}
			if(pipe.getX() <= 10 && !pipe.passed){
				pipe.passed = true;
				passedPipes += 0.5;
				txtPipes.innerText = passedPipes;
				if(passedPipes > highScore){
					highScore = passedPipes;
					txtHighScore.innerText = passedPipes;
					txtHighScore.style.color = "lime";
				}
			}
			if(pipe.getX() <= -30){
				pipes.splice(i, 1);
				i--;
			}
			pipe.render(canvas);
		}
		pigeon.render(canvas);
	}); // ,optiItv()

	window.addEventListener("click", jump, false);
}, false);