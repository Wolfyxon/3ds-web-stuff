window.addEventListener('load', function() {
	const button = document.getElementById('btn-reset'),
		keyboard = document.getElementById('keyboard'),
		wordDisplay = document.getElementById('display'),
		canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		lines = [ // x from, y from, x to, y to
			[10, 140, 70, 140],
			[40, 140, 40, 10],
			[40, 30, 60, 10],
			[40, 10, 100, 10],
			[100, 10, 100, 30],
			null,
			[100, 70, 100, 110],
			[100, 80, 80, 100],
			[100, 80, 120, 100],
			[100, 110, 80, 130],
			[100, 110, 120, 130]
		],
		words = [
			// People
			'Magiczocker',
			'Wolfyxon',
			'Trickiy',
			// Nintendo stuff
			'Nintendo',
			'Mario',
			'Luigi',
			'Waluigi',
			'Wario',
			'Peach',
			'Toad',
			'Daisy',
			'Bowser',
			'Yoshi',
			'Toadette',
			'DonkeyKong',
			'Rosalina',
			'Luma',
			'Blooey',
			'Kirby',
			'Boolossus',
			'Ware',
			'Badge',
			'StreetPass',
			'SpotPass',
			// Nintendo Consoles
			'Switch',
			'GameBoy',
			'VirtualBoy',
			'GameCube',
			// Games
			'Minecraft',
			'Tomodachi',
			'Miiverse',
			'Metroid',
			'Kart',
			'MarioKart',
			'MiiPlaza',
			// Tech
			'JavaScript',
			'Browser',
			'Webkit',
			'HTML',
			'GitHub',
			// 3DS web stuff games
			'Minesweeper',
			'JetFighter',
			'Jumpy',
			'Hangman',
			'Pigeon',
			'Breakout',
			'Sudoku',
			'ConnectFour',
			'Pong',
			'TicTacToe'
		];
	var mistakes, gameOver,
		keys = [],
		letters = [];
	//ctx.strokeStyle = '#f6f6f6';

	function draw() {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		for (var m=0; m<=mistakes; m++) { // loop only needed for old 3DS
			var l = lines[m];
			ctx.beginPath();
			if (m < 5 || m > 5) {
				ctx.moveTo(l[0], l[1]);
				ctx.lineTo(l[2], l[3]);
			} else {
				ctx.arc(100, 50, 20, 0, 2 * Math.PI, false);
			}
			ctx.stroke();
			ctx.closePath();
		}
	}
	function drawKeyboard() {
		const layers = [
			[65, 73], // A - J
			[74, 81], // K - S
			[82, 90] // T - Z
		];
		for (var l=0; l<3; l++) {
			var layer = document.createElement('div'),
				i = layers[l];
			for (var k=i[0]; k<=i[1]; k++) {
				var ele = document.createElement('span'),
					char = String.fromCharCode(k);
				ele.setAttribute('data-key', char);
				ele.textContent = char;
				keys.push(ele);
				layer.appendChild(ele);
			}
			keyboard.appendChild(layer);
		}
	}

	function tryKey(ele, k) {
		if (!k || gameOver) return;
		if (ele.getAttribute('data-disabled')) return;
		ele.setAttribute('data-disabled', true);

		var found = 0,
			closed = 0;

		// Open letter if possible
		for (var a=0; a<letters.length; a++) {
			var b = letters[a];
			if (b.getAttribute('data-displayletter').toLowerCase() === k.toLowerCase()) {
				found++;
				b.innerText = b.getAttribute('data-displayletter');
				b.removeAttribute('data-hidden');
			} else if (b.getAttribute('data-hidden')) {
				closed++;
			}
		}

		// If everything was opened
		if (!closed) {
			for (var c=0; c<letters.length; c++) {
				letters[c].className += 'success';
			}
			gameOver = true;
		}

		// If no matching letter found
		if (!found) {
			mistakes++;
			if (mistakes > 9) {
				for (var i=0; i<letters.length; i++) {
					const l = letters[i];
					if (l.getAttribute('data-hidden')) {
						l.innerText = l.getAttribute('data-displayletter');
						l.removeAttribute('data-hidden');
						l.className += 'failed';
					}
				}
				gameOver = true;
			}
		}
		draw();
	}

	function reset() {
		mistakes = 0;
		gameOver = false;
		draw();
		letters.length = 0;

		// Reset keyboard
		for (var i=0; i<keys.length; i++) {
			keys[i].removeAttribute('data-disabled');
		}

		// Reset word
		wordDisplay.innerHTML = '';
		var selectedWord = words[Math.floor(Math.random() * words.length)];
		for (var j = 0; j < selectedWord.length; j++) {
			var ele = document.createElement('span');
			ele.innerText = '_';
			ele.setAttribute('data-displayletter', selectedWord.substring(j, j + 1));
			ele.setAttribute('data-letter', ele.getAttribute('data-displayletter').toLowerCase());
			ele.setAttribute('data-hidden', '.');
			letters.push(ele);
			wordDisplay.appendChild(ele);
		}
	}

	keyboard.addEventListener('click', function(e) {
		if (e.target.nodeName !== 'SPAN') return;
		tryKey(e.target, e.target.textContent);
	}, false);

	document.addEventListener('keydown', function(e) {
		e.preventDefault();
		if (e.keyCode < 65 || e.keyCode > 90) { return; }
		const key = String.fromCharCode(e.which),
			ele = keyboard.querySelector('span[data-key="' + key.toUpperCase() + '"]');
		if (ele) tryKey(ele, ele.getAttribute('data-key'));
	}, false);

	button.addEventListener('click', reset, false);

	drawKeyboard();
	reset();
}, false);
