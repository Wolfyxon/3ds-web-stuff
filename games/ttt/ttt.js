window.addEventListener('load', function() {
	const grid = document.getElementById('grid'),
		cells = grid.getElementsByTagName('td'),
		plrTxt = document.getElementById('plr'),
		winTxt = document.getElementById('win');

	var currentPlayer = 'X',
		winsO = 0,
		winsX = 0;

	function getType(x, y) {
		return grid.rows[y].cells[x].textContent;
	}

	function testPatterns(x, y, player) {
		// horizontal
		if ((getType(0, y) === getType(1, y)) &&
			(getType(0, y) === getType(2, y)) &&
			(getType(0, y).length)) return true;

		// vertical
		if ((getType(x, 0) === getType(x, 1)) &&
			(getType(x, 0) === getType(x, 2)) &&
			(getType(x, 0).length)) return true;

		// diagonal \
		if ((getType(0, 0) === getType(1, 1)) &&
			(getType(1, 1) === getType(2, 2)) &&
			(getType(0, 0).length)) return true;

		// diagonal /
		if ((getType(2, 0) === getType(1, 1)) &&
			(getType(1, 1) === getType(0, 2)) &&
			(getType(2, 0).length)) return true;

		return false;
	}

	function reset() {
		winTxt.style.display = 'none';
		for(var i=0; i<cells.length; i++){
			const cell = cells[i];
			cell.innerText = '';
			cell.style.color = '';
		}
		cooldown = false;
	}

	var cooldown = false;
	grid.addEventListener('click', function(event) {
		const cell = event.target;
		if (cooldown || cell.tagName !== 'TD' || cell.innerText !== '') return;

		cell.innerText = currentPlayer;
		var win = false;
		if (testPatterns(cell.cellIndex, cell.parentElement.rowIndex, currentPlayer)) {
			cooldown = true;
			win = true;
			winTxt.innerText = currentPlayer + ' wins';
			winTxt.style.display = 'block';

			if (currentPlayer === 'O') winsO++;
			else winsX++;

			document.getElementById('wins-o').innerText = winsO;
			document.getElementById('wins-x').innerText = winsX;

			setTimeout(reset, 1500);
		}
		if (currentPlayer === 'O') {
			cell.style.color = 'green';
			plrTxt.style.color = 'red';
			currentPlayer = 'X';
		} else {
			cell.style.color = 'red';
			plrTxt.style.color = 'green';
			currentPlayer = 'O';
		}
		winTxt.style.color = cell.style.color;
		plrTxt.innerText = currentPlayer;

		if (!win) {
			var filled = 0;
			for (var i=0; i<cells.length; i++) {
				if (cells[i].innerText !== '') filled++;
			}
			if (filled >= 9) reset();
		}
	});
});
