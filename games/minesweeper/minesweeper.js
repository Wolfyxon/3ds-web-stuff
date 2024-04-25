// Originally made by magiczocker10

window.addEventListener('load', function() {
	const field = document.getElementById('field'),
		minesDisplay = document.getElementById('mines'),
		timeDisplay = document.getElementById('time'),
		restartMsg = document.getElementById('restart-msg'),
		width = 9,
		height = 9,
		mines = 10,
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
		time = 0,
		timeout;

	function generate(excludeX, excludeY) {
		excludeX = excludeX || -1;
		excludeY = excludeY || -1;
		field.innerHTML = '';
		var cells = [];

		/* generate cells */
		for (var y=0; y<height; y++) {
			const row = field.insertRow();
			for (var x=0; x<width; x++) {
				cells.push(row.insertCell());
			}
		}

		var minesPlaced = 0;
		while (minesPlaced < mines) {
			const index = Math.floor(Math.random() * cells.length),
				cell = cells[index],
				col = cell.cellIndex,
				row = cell.parentElement.rowIndex;

			// Return if cell should be excluded
			if (col === excludeX && row === excludeY) continue;

			// Place mine
			cell.textContent = 'o';
			cell.className += ' mine';

			// Increase count on adjacent cells
			for (var y=-1; y<2; y++) {
				for (var x=-1; x<2; x++) {
					const c = field.rows[row + y] ? field.rows[row + y].cells[col + x] : null
					if (c && c.textContent !== 'o') {
						c.textContent = Number(c.textContent) + 1;
						c.setAttribute('data-num', c.textContent);
					}
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
		const all = field.querySelectorAll('td.mine');
		for (var i=0; i<all.length; i++) {
			all[i].className += ' open';
		}
	}

	function open(x, y) {
		const cell = field.rows[y] ? field.rows[y].cells[x] : null;

		// Return if already open
		if (!cell || cell.className.indexOf('open') > 0) return;

		// Open field
		cell.className += ' open';

		// If its a mine
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
		minesDisplay.textContent = mines;
		timeDisplay.textContent = '0 sec';
		restartMsg.style.visibility = '';
		generate();
		field.style.display = '';
	}

	reset();

	function updateTime() {
		if (first || won || lost) return setTimeout(updateTime, 1000);
		time = time + 1;
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
		const all = field.querySelectorAll('td:not(.open)');
		if (all.length === mines) {
			restartMsg.style.visibility = 'visible';
			alert('You won!');
			won = true;
		}
	});

	onBtnJustPressed('a', function() {
		if (won || lost) reset();
	});
});