window.addEventListener('load', function() {
	const heliEle = document.getElementById('helis'),
		screenEle = document.getElementById('screen'),
		overlay = document.getElementById('overlay'),
		targetEle = document.getElementById('target'),
		projectiles = document.getElementById('projectiles'),
		lifebar = document.getElementById('lifebar-neg'),
		killCounter = document.getElementById('killCounter'),
		gameover = document.getElementById('gameover'),
		screenCoords = screenEle.getBoundingClientRect(),
		degreeInRadiant = 2 * Math.PI / 360,
		speed = 5,
		projectileSpeed = 2;

	var helis = [],
		running = true,
		prevMoveFrameTime = 0,
		prevMainFrameTime = 0;

	function spawnHeli() {
		var h = document.createElement('div');
		h.className = 'heli';
		h.style.top = '-100px';
		h.style.left = Math.floor(Math.random() * 320) + 'px';
		var lifebar_ = document.createElement('div');
		lifebar_.className = 'lifebar';
		var lifebar_neg = document.createElement('div');
		lifebar_neg.className = 'lifebar-neg';
		lifebar_neg.setAttribute('data-health', '100');
		lifebar_neg.style.width = '0%';
		lifebar_.appendChild(lifebar_neg);
		h.appendChild(lifebar_);
		var inner = document.createElement('div');
		inner.className = 'inner';
		h.appendChild(inner);
		var rotor = document.createElement('div');
		rotor.className = 'rotor';
		h.appendChild(rotor);
		heliEle.appendChild(h);
		helis.push([h, lifebar_neg, inner]);
	}

	function f() {
		var targetCoords = targetEle.getBoundingClientRect();
		for (var i = 0; i < helis.length; i++) {
			var coords = helis[i][2].getBoundingClientRect();
			var a = Math.floor(
				Math.atan2(
					(targetCoords.top + targetCoords.height * 0.5) - (coords.top + coords.height * 0.5),
					(targetCoords.left + targetCoords.width * 0.5) - (coords.left + coords.width * 0.5)
				) * 180 / Math.PI) + 90;
			helis[i][2].setAttribute('data-rot', a);
			helis[i][2].style.transform = 'rotate(' + a + 'deg)';
			helis[i][2].style.webkitTransform = 'rotate(' + a + 'deg)';
		}
	}

	function spawnProjectile() {
		if (!running) {return;}
		for (var i = 0; i < helis.length; i++) {
			var heli = helis[i];
			var coords = getComputedStyle(helis[i][0]);
			var e = document.createElement('div');
			e.className = 'projectile';

			// Move the projectile 65 steps towards rotation.
			// This should prevent spawning directly inside of the heli.
			var angle = degreeInRadiant * (Number(heli[2].getAttribute('data-rot')) - 90);
			var deltaX = 65 * Math.cos(angle);
			var deltaY = 65 * Math.sin(angle);
			e.style.left = (parseFloat(coords.left) + parseFloat(coords.width) * 0.5 + deltaX) + 'px';
			e.style.top = (parseFloat(coords.top) + parseFloat(coords.height) * 0.5 + deltaY) + 'px';
			e.style.transform = 'rotate(' + heli[2].getAttribute('data-rot') + 'deg)';
			e.style.webkitTransform = 'rotate(' + heli[2].getAttribute('data-rot') + 'deg)';
			e.setAttribute('data-rot', heli[2].getAttribute('data-rot'));
			projectiles.appendChild(e);
		}
	}

	function spawnProjectile2() {
		if (!running) {return;}
		var coords = getComputedStyle(targetEle);
		var e = document.createElement('div');
		e.className = 'jet projectile';
		e.style.left = (parseFloat(coords.left) + parseFloat(coords.width) * 0.5) + 'px';
		e.style.top = (parseFloat(coords.top) - 10) + 'px';
		e.setAttribute('data-rot', targetEle.getAttribute('data-rot'));
		projectiles.appendChild(e);
	}

	function reset() {
		prevMoveFrameTime = Date.now();
		prevMainFrameTime = Date.now();
		screenEle.style.webkitAnimationPlayState = 'running';
		screenEle.style.animationPlayState = 'running';
		gameover.style.display = 'none';
		killCounter.innerText = '0';
		projectiles.innerText = '';
		heliEle.innerText = '';
		lifebar.style.height = '0%';
		targetEle.style.left = '';
		targetEle.style.top = '';
		targetEle.setAttribute('data-health', '100');
		helis = [];
		for (var i = 0; i < 3; i++) {
			spawnHeli();
		}
		overlay.style.display = 'none';
		running = true;
	}

	setInterval(f, 10);

	setInterval(spawnProjectile, 3000);

	setInterval(function() {
		const delta = (Date.now() - prevMainFrameTime) / 16;
        prevMainFrameTime = Date.now();
		if (!running) {return;}
		var p = projectiles.children;
		const sc = screenEle.getBoundingClientRect();
		for (var i = 0; i < p.length; i++) {
			const pEle = p[i];
			var angle = degreeInRadiant * (Number(pEle.getAttribute('data-rot')) - 90);
			var deltaX = speed * Math.cos(angle);
			var deltaY = speed * Math.sin(angle);
			pEle.style.top = (parseFloat(pEle.style.top) + deltaY * delta * projectileSpeed) + 'px';
			pEle.style.left = (parseFloat(pEle.style.left) + deltaX * delta * projectileSpeed) + 'px';
			var coords = pEle.getBoundingClientRect();
			if (pEle.className.indexOf('jet') > -1) { // Jet-projectiles
				for (var j = 0; j < helis.length; j++) {
					var coords2 = helis[j][0].getBoundingClientRect();
					if (
						(coords.top >= coords2.top && coords.top <= coords2.top + coords2.height) &&
						(coords.left >= coords2.left && coords.left <= (coords2.left + coords2.width))
					) {
						var he = Number(helis[j][1].getAttribute('data-health')) - 10;
						helis[j][1].style.width = (100 - he) + '%';
						helis[j][1].setAttribute('data-health', he);
						if (helis[j][1].getAttribute('data-health') === '0') {
							helis[j][0].parentElement.removeChild(helis[j][0]);
							helis.splice(j, 1);
							j--;
							killCounter.innerText = Number(killCounter.innerText) + 1;
							spawnHeli();
						}
						projectiles.removeChild(pEle);
						break;
					}
				}
			} else { // Heli-projectiles
				var coords2 = targetEle.getBoundingClientRect();
				if (
					(coords.top <= coords2.top + coords2.height && coords.top >= coords2.top) &&
					(coords.left >= coords2.left && coords.left <= coords2.left + coords2.width)
				) {
					var h = Number(targetEle.getAttribute('data-health')) - 2;
					lifebar.style.height = (100 - h) + '%';
					targetEle.setAttribute('data-health', h);
					if (targetEle.getAttribute('data-health') === '0') {
						running = false;
						overlay.style.display = '';
						gameover.style.display = '';
						screenEle.style.webkitAnimationPlayState = 'paused';
						screenEle.style.animationPlayState = 'paused';
					}
					if(pEle.parentNode === projectiles) projectiles.removeChild(pEle);
					continue;
				}
			}
			if ((coords.top) < sc.top ||
				(coords.top + coords.height) > (sc.top + sc.height) ||
				(coords.left) < sc.left ||
				(coords.left + coords.width) > (sc.left + sc.width)) {
					if(pEle.parentNode === projectiles) projectiles.removeChild(pEle);
			}
		}
	}, 5);

	setInterval(function() {
		if (!running) {return;}
		for (var i = 0; i < helis.length; i++) {
			helis[i][0].style.top = Math.floor(Math.random() * (screenCoords.height - 61)) + 'px';
			helis[i][0].style.left = Math.floor(Math.random() * (screenCoords.width - 61)) + 'px';
		}
	}, 2000);

	// Firing loop
	setInterval(function() {
		if (running && isBtnPressed('A')) {
			spawnProjectile2();
		}
	}, 100);

	// Movement loop
	setInterval(function() {
		const delta = (Date.now() - prevMoveFrameTime) / 16;
        prevMoveFrameTime = Date.now();
		var coords = getComputedStyle(targetEle);
		if (isBtnPressed('Up')) {
			targetEle.style.top = Math.max(parseFloat(coords.top) - speed * delta, 0) + 'px';
		} else if (isBtnPressed('Down')) {
			targetEle.style.top = Math.min(parseFloat(coords.top) + speed * delta, screenCoords.height - parseFloat(coords.height)) + 'px';
		}
		if (isBtnPressed('Right')) {
			targetEle.style.left = Math.min(parseFloat(coords.left) + speed * delta, screenCoords.width - parseFloat(coords.width)) + 'px';
		} else if (isBtnPressed('Left')) {
			targetEle.style.left = Math.max(parseFloat(coords.left) - speed * delta, 0) + 'px';
		}
	});

	onBtnJustPressed("A", function () {
		if(!running) reset();
	});

	document.getElementById('btn-restart').addEventListener('click', reset);

	reset();
});
