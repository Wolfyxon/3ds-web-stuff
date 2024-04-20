window.addEventListener('load', function() {
	const heliEle = document.getElementById('helis'),
		screenEle = document.getElementById('screen'),
		targetEle = document.getElementById('target'),
		projectiles = document.getElementById('projectiles'),
		lifebar = document.getElementById('lifebar-neg'),
		killCounter = document.getElementById('killCounter'),
		endScreen = document.getElementById('endScreen'),
		screenCoords = screenEle.getBoundingClientRect(),
		degreeInRadiant = 2 * Math.PI / 360,
		speed = 2,
		defaultHe = 10;
	var helis = [],
		running = true;

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
	setInterval(f, 10);
	
	function spawnHeli() {
		var h = document.createElement('div');
		h.className = 'heli';
		h.style.top = 110;
		h.style.left = 140;
		var lifebar_ = document.createElement('div');
		lifebar_.className = 'lifebar';
		var lifebar_neg = document.createElement('div');
		lifebar_neg.className = 'lifebar-neg';
		lifebar_neg.setAttribute('data-health', defaultHe);
		lifebar_neg.style.width = '100%';
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
	setInterval(spawnProjectile, 3000);
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
	setInterval(function() {
		if (!running) {return;}
		var p = projectiles.children;
		for (var i = 0; i < p.length; i++) {
			var angle = degreeInRadiant * (Number(p[i].getAttribute('data-rot')) - 90);
			var deltaX = speed * Math.cos(angle);
			var deltaY = speed * Math.sin(angle);
			p[i].style.top = (parseFloat(p[i].style.top) + deltaY) + 'px';
			p[i].style.left = (parseFloat(p[i].style.left) + deltaX) + 'px';
			var coords = p[i].getBoundingClientRect();
			var coords2;
			if (p[i].className.indexOf('jet') > -1) { // Jet-projectiles
				for (var j = 0; j < helis.length; j++) {
					coords2 = helis[j][0].getBoundingClientRect();
					if (
						(coords.top >= coords2.top && coords.top <= coords2.top + coords2.height) &&
						(coords.left >= coords2.left && coords.left <= (coords2.left + coords2.width))
					) {
						var he = Number(helis[j][1].getAttribute('data-health')) - 1;
						helis[j][1].style.width = (100 / defaultHe * he) + '%';
						helis[j][1].setAttribute('data-health', he);
						if (helis[j][1].getAttribute('data-health') === '0') {
							helis[j][0].parentElement.removeChild(helis[j][0]);
							helis.splice(j, 1);
							j--;
							killCounter.innerText = Number(killCounter.innerText) + 1;
							spawnHeli();
						}
						projectiles.removeChild(p[i]);
						continue;
					}
				}
			} else { // Heli-projectiles
				coords2 = targetEle.getBoundingClientRect();
				if (
					(coords.top <= coords2.top + coords2.height && coords.top >= coords2.top) &&
					(coords.left >= coords2.left && coords.left <= coords2.left + coords2.width)
				) {
					var h = Number(targetEle.getAttribute('data-health')) - 1;
					lifebar.style.height = (100 - h) + '%';
					targetEle.setAttribute('data-health', h);
					if (targetEle.getAttribute('data-health') === '0') {
						running = false;
						endScreen.className = 'visible';
						screenEle.style.webkitAnimationPlayState = 'paused';
						screenEle.style.animationPlayState = 'paused';
					}
					projectiles.removeChild(p[i]);
					continue;
				}
			}
			if ((coords.top) < screenCoords.top ||
				(coords.top + coords.height) > (screenCoords.top + screenCoords.height) ||
				(coords.left) < screenCoords.left ||
				(coords.left + coords.width) > (screenCoords.left + screenCoords.width)) {
					projectiles.removeChild(p[i]);
					continue;
			}
		}
	}, 10);
	setInterval(function() {
		if (!running) {return;}
		var coords = screenEle.getBoundingClientRect();
		for (var i = 0; i < helis.length; i++) {
			helis[i][0].style.top = Math.floor(Math.random() * (coords.height - 61)) + 'px';
			helis[i][0].style.left = Math.floor(Math.random() * (coords.width - 61)) + 'px';
		}
	}, 2000);
	function reset() {
		endScreen.className = '';
		killCounter.innerText = '0';
		projectiles.innerText = '';
		heliEle.innerText = '';
		lifebar.style.height = '0%';
		targetEle.setAttribute('data-health', '100');
		screenEle.style.webkitAnimationPlayState = 'running';
        screenEle.style.animationPlayState = 'running';
		helis = [];
		for (var i = 0; i < 1; i++) {
			spawnHeli();
		}
		running = true;
	}
	setInterval(function() {
		if (!running) {return;}
		if (isBtnPressed('A')) {
			spawnProjectile2();
		}
	}, 200);
	setInterval(function() {
		if (!running) {
			if (isBtnPressed('A')) {
				reset();
			}
			return;
		}
		var coords = getComputedStyle(targetEle);
		if (isBtnPressed('Up')) {
			targetEle.style.top = Math.max(parseFloat(coords.top) - 5, 0) + 'px';
		} else if (isBtnPressed('Right')) {
			targetEle.style.left = Math.min(parseFloat(coords.left) + 5, screenCoords.width - parseFloat(coords.width)) + 'px';
		} else if (isBtnPressed('Down')) {
			targetEle.style.top = Math.min(parseFloat(coords.top) + 5, screenCoords.height - parseFloat(coords.height)) + 'px';
		} else if (isBtnPressed('Left')) {
			targetEle.style.left = Math.max(parseFloat(coords.left) - 5, 0) + 'px';
		}
	});
	reset();
});