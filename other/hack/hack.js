const terminalTexts = [
	'rm -rf /* --no-preserve-root',
	'pacman -Syu',
	'sudo -s',
	'neofetch',
	'Hacking database',
	'Establishing connection',
	'Hi',
	'undefined',
	'Hello World!',
	'Goodbye World!',
	'Ah free at last',
	'A visitor. Hm indeed, I\'ve slept long enough.',
	'Rise and shine mr Freeman',
	'Get out',
	'kernel panic - not syncing: Attempted to kill inint !',
	'Uncaught ReferenceError: message is not defined',
	'Exception in thread "main" java.lang.NullPointerException',
	'Segmentation fault (core dumped)',
	'Fatal error: Unexpectedly found nil while unwrapping an Optional value',
	'ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near \'WHERE id=1\' at line 1',
	'System.NullReferenceException: Object reference not set to an instance of an object.',
	'panic: runtime error: index out of range [5] with length 3',
	'Type mismatch: inferred type is Int but String was expected',
	'thread "main" panicked at "attempt to add with overflow", src/main.rs:4:9',
	'for(int i = 0; i < sizeof(arr); i++) {}',
];

window.addEventListener('load', function() {
	const terminal = document.getElementById('terminal'),
		numbers = document.getElementById('numbers'),
		bars = document.getElementById('bars'),
		canv = document.getElementById('tiles'),
		ctx = canv.getContext('2d', { alpha: false }),
		termLength = terminalTexts.length,
		barLength = 30,
		cols = 6,
		rows = 30;
	var terminalLength = 0,
		barTxt = '',
		newNum = '',
		newBar = '',
		oldTiles = [];

	function ran(num) {
		return Math.floor(Math.random() * num);
	}

	function echo() {
		var v = terminal.value;
		if (terminalLength < 16) {
			terminalLength++;
		} else {
			v = v.substring(v.match('\n').index + 2);			
		}
		terminal.value = v + terminalTexts[ran(termLength-1)] + '\n';
	}

	function genTiles() {
		for (var y=0; y<16; y++) {
			for (var x=0; x<16; x++) {
				const r = Math.random() < 0.5,
					i = y*16+x;
				if (oldTiles[i] !== r) {
					ctx.fillStyle = r ? '#000' : '#0f960f';
					ctx.fillRect(x * 13, y * 5, 11, 3);
					oldTiles[i] = r;
				}
			}
		}
	}

	function genBars() {
		newBar = '';
		for (var ln=0; ln<9; ln++) {
			newBar += ln + " ) |" + barTxt.substring(0, ran(barLength)) + '\n';
		}
		bars.value = newBar;
	}

	function genNums() {
		newNum = '';
		for (var row=0; row<rows; row++) {
			for (var col=0; col<cols; col++) {
				newNum += ran(64) + ' ';
			}
			newNum += (row === rows-1) ? '' : '\n';
		}

		numbers.value = newNum;
	}

	for (var j=0; j<barLength; j++) {
		barTxt += '|';
	}

	echo();
	genTiles();
	genBars();
	genNums();

	setInterval(echo, 50);
	setInterval(genTiles, 1000);
	setInterval(genBars, 500);
	setInterval(genNums, 20);
}, false);