// Canvas code from https://stackoverflow.com/a/63599674
window.addEventListener("load", function() {
	const canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		settings = document.getElementById('settings'),
		settingB = document.getElementById('buttons'),
		settingS = document.getElementById('strict'),
		left = document.getElementById('left'),
		right = document.getElementById('right'),
		start = document.getElementById('start'),
		level = document.getElementById('level'),
		status = document.getElementById('status'),
		rgb = 'rgb($1, $2, $3)',
		colors = [
			['rgb(0, 0, 128)',   'rgb(0, 0, 255)'], // blue
			['rgb(128, 128, 0)', 'rgb(255, 255, 0)'], // yellow
			['rgb(0, 128, 0)',   'rgb(0, 255, 0)'], // green
			['rgb(128, 0, 0)',   'rgb(255, 0, 0)'], // red
			['rgb(128, 0, 128)', 'rgb(255, 0, 255)'], // purple
			['rgb(255, 31, 64)', 'rgb(255, 182, 193)'] // pink
		],
		w = canvas.width / 2,
		h = canvas.height / 2;
	var lastend = 0,
		buttons = 4,
		degree = 360 / buttons,
		sequence = [],
		paused = true,
		index = 0,
		strict = false;

	function draw(highlight) {
		ctx.strokeStyle ='white';
		for (var i = 0; i < buttons; i++) {
			ctx.fillStyle = i === highlight ? colors[i][1] : colors[i][0];
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(w,h);
			var len = (degree/360) * 2 * Math.PI;
			ctx.arc(w , h, h-5, lastend, lastend + len, false);
			ctx.lineTo(w,h);
			ctx.fill();
			ctx.stroke();
			lastend += Math.PI*2*(degree/360);
		}
		ctx.fillStyle = '#262626';
		ctx.beginPath();
		ctx.arc(w, h, 50, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();
	}

	function highlight(button) {
		draw(button);
		setTimeout(draw, 300);
	}

	function play() {
		var i = 0;
		paused = true;
		const inter = setInterval(function() {
			highlight(sequence[i]);
			i++;
			if (i > sequence.length) {
				clearInterval(inter);
				paused = false;
				return;
			}
		}, 1000);
	}

	function addSequence() {
		const color = Math.floor(Math.random() * buttons);
		sequence.push(color);
		level.textContent = 'Level ' + sequence.length;
		play();
	}

	function reset() {
		paused = true;
		settings.style.display = '';
		lastend = 0;
		buttons = settingB.value;
		strict = settingS.checked;
		degree = 360 / buttons;
		sequence = [];
		index = 0;
		start.disabled = false;
		status.style.removeProperty('display');
		draw();
	}

	canvas.onclick = function(e) {
		if (paused) return;
		const x = e.offsetX,
			y = e.offsetY,
			d = ctx.getImageData(x, y, 1, 1).data,
			c = rgb.replace('$1', d[0]).replace('$2', d[1]).replace('$3', d[2]);
		for (var i=0; i<buttons; i++) {
			if (colors[i][0] !== c) continue;
			paused = true;

			// Check if lamp is correct
			if (sequence[index] === i) {
				highlight(i);
				index++;
				paused = false;
			} else {
				if (strict) {
					start.disabled = false;
					status.style.display = 'block';
				} else {
					play();
				}
			}

			// Sequence complete
			if (index === sequence.length) {
				index = 0;
				addSequence();
				//setTimeout(addSequence, 1000);
			}
		}
	};

	document.getElementById('open').onclick = function() {
		settings.style.display = settings.style.display.length ? '' : 'block';
	};

	left.onclick = function() {
		settingB.value--;
		if (Number(settingB.value) === 2) left.disabled = true;
		right.disabled = false;
	};

	right.onclick = function() {
		settingB.value++;
		if (Number(settingB.value) === colors.length) right.disabled = true;
		left.disabled = false;
	};

	start.onclick = function() {
		if (!paused) return;
		start.disabled = true;
		reset();
		addSequence();
		paused = false;
	};

	document.getElementById('resetbtn').onclick = function() {
		reset();
	};

	draw();
}, false);