// Originally made by magiczocker10

window.addEventListener('load', function() {
	const field = document.getElementById('field'),
		minesDisplay = document.getElementById('mines'),
		timeDisplay = document.getElementById('time'),
		restartMsg = document.getElementById('restart-msg'),
		resetBtn = document.getElementById('btn-reset'),
		flagBtn = document.getElementById("btn-flag"),
		width = 9,
		height = 9,
		mineCount = 10,
		pos = [
			[-1, -1],
			[ 0, -1],
			[ 1, -1],
			[-1,  0],
			[ 1,  0],
			[-1,  1],
			[ 0,  1],
			[ 1,  1]
		];
	var lost = false,
		won = false,
		first = true,
		flagging = false,
		time = 0,
		timeout,
		mines = [],
		opened = 0;

	function generate(excludeX, excludeY) {
		excludeX = excludeX || -1;
		excludeY = excludeY || -1;
		field.innerHTML = '';
		var cells = [];

		/* generate cells */
		for (var y=0; y<height; y++) {
			const row = field.insertRow(field.rows.length);
			for (var x=0; x<width; x++) {
				const cell = document.createElement('td');
				cells.push([cell, x, y]);
				row.appendChild(cell);
			}
		}

		var minesPlaced = 0;
		while (minesPlaced < mineCount) {
			const index = Math.floor(Math.random() * cells.length),
				cell = cells[index][0],
				col = cells[index][1],
				row = cells[index][2];

			// Return if cell should be excluded
			if (col === excludeX && row === excludeY) continue;

			// Place mine
			cell.textContent = 'o';
			cell.className = 'mine';
			mines.push(cell);

			// Increase count on adjacent cells
			for (var i=0; i<pos.length; i++) {
				const c = field.rows[row + pos[i][1]] ? field.rows[row + pos[i][1]].cells[col + pos[i][0]] : null;
				if (c && c.textContent !== 'o') {
					c.textContent = Number(c.textContent) + 1;
					c.className = 'num' + c.textContent;
				}
			}

			cells.splice(index, 1);
			minesPlaced++;
		}
	}

	function endGame(cell) {
		restartMsg.style.visibility = 'visible';
		cell.style.backgroundColor = '#EA3323';
		cell.style.borderColor = '#CD372E';
		lost = true;
		for (var i=0; i<mines.length; i++) {
			mines[i].className += ' open';
		}
	}

	function open(x, y) {
		const cell = field.rows[y] ? field.rows[y].cells[x] : null;

		// Return if already open
		if (!cell || cell.className.indexOf('open') > 0) return;

		// Open field
		cell.className += ' open';
		opened++;

		// If it's a mine
		if (cell.textContent === 'o') endGame(cell);

		// Return if count > 0
		if (cell.textContent !== '') return;

		// Reveal adjacent cells
		for (var i=0; i<pos.length; i++) {
			open(x + pos[i][0], y + pos[i][1]);
		}
	}

	function reset() {
		lost = false;
		won = false;
		first = true;
		time = 0;
		mines.length = 0;
		opened = 0;
		minesDisplay.textContent = mineCount;
		timeDisplay.textContent = '0 sec';
		restartMsg.style.visibility = '';
		generate();
		field.style.display = '';
	}

	reset();

	function updateTime() {
		if (first || won || lost) return setTimeout(updateTime, 1000);
		time++;
		timeDisplay.textContent = time + ' sec';
		timeout = setTimeout(updateTime, 1000);
	}
	timeout = setTimeout(updateTime, 1000);

	field.addEventListener('click', function(event) {
		if (won || lost || event.target.nodeName !== 'TD') return;
		const cell = event.target,
			row = cell.parentElement.rowIndex,
			column = cell.cellIndex;

		// Reset if first click is a bomb
		if (first && cell.textContent === 'o') generate(column, row);

		// Open cell
		first = false;
		open(column, row);

		// Check if all cells are open
		if (opened+mineCount === width*height) {
			restartMsg.style.visibility = 'visible';
			alert('You won!');
			won = true;
		}
	}, false);

	resetBtn.addEventListener('click', function () {
		if(opened === 0) return;

		if(!lost) {
			if(!confirm("Restart the game?")) return;
		}

		reset();
	}, false);

	flagBtn.addEventListener('click', function () {
		flagging = !flagging;

		if(flagging) {
			flagBtn.style.backgroundColor = 'gray';
		} else {
			flagBtn.style.backgroundColor = '';
		}
	}, false);

	document.addEventListener('keydown', function(e) {
		if (isButton(e.keyCode, 'a')) {
			if (won || lost) reset();
		}
		e.preventDefault();
	}, false);
}, false);