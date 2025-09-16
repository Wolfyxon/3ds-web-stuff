window.addEventListener('load', function() {
	const blue = document.getElementById('pointsB'),
		red = document.getElementById('pointsR'),
		field = document.getElementById('field'),
		input = document.getElementById('input'),
		rows = field.tBodies[0].rows;
	var player = false,
		won = false;

	function getType(x, y) {
		return rows[y].cells[x].getAttribute('data-player');
	}

	function checkWin(x, y) {
		for (var n=0; n<4; n++) {
			var a = getType(n, y);

			// horizontal
			if ((a === getType(n + 1, y)) &&
				(a === getType(n + 2, y)) &&
				(a === getType(n + 3, y)) &&
				(a !== '')) {
				won = true;
			}

			if (n === 3) break;

			var a2 = getType(x, n);

			// vertical
			if ((a2 === getType(x, n + 1)) &&
				(a2 === getType(x, n + 2)) &&
				(a2 === getType(x, n + 3)) &&
				(a2 !== '')) {
				won = true;
			}
		}

		for (var row2 = 0; row2 < 3; row2++) {
			for (var column2 = 0; column2 < 4; column2++) {
				// diagonal \
				var b = getType(column2, row2 + 3),
					b2 = getType(column2, row2);
				if ((b === getType(column2 + 1, row2 + 2)) &&
					(b === getType(column2 + 2, row2 + 1)) &&
					(b === getType(column2 + 3, row2)) &&
					(b !== '')) {
					won = true;
				} else

				// diagonal /
				if ((b2 === getType(column2 + 1, row2 + 1)) &&
					(b2 === getType(column2 + 2, row2 + 2)) &&
					(b2 === getType(column2 + 3, row2 + 3)) &&
					(b2 !== '')) {
					won = true;
				}
			}
		}
	}

	function updateCurrent() {
		blue.className = player ? '' : 'current';
		red.className = player ? 'current' : '';
	}

	function reset() {
		var c = input.tHead.rows[0].cells;
		for (var j=0; j<c.length; j++) {
			c[j].setAttribute('data-index', '5');
		}

		var cells = field.getElementsByTagName('td');
		for (var i=0; i<cells.length; i++) {
			cells[i].textContent = '';
			cells[i].setAttribute('data-player', '');
		}
		won = false;
		updateCurrent();
	}

	input.addEventListener('click', function(e) {
		if (won || e.target.tagName !== 'TH') return;

		const column = e.target.cellIndex,
			row = Number(e.target.getAttribute('data-index')),
			cell = rows[row].cells[column];

		if (row < 0) return;
		if (row === 0) e.target.style.color = 'transparent';

		cell.textContent = '●';
		cell.className = player ? 'playerR' : 'playerB';

		checkWin(column, row);
		if (won) {
			alert((player ? 'Red' : 'Blue') + ' won');
			if (player) red.textContent = Number(red.textContent) + 1;
			else blue.textContent = Number(blue.textContent) + 1;
		}
		player = !player;
		updateCurrent();
		e.target.setAttribute('data-index', row - 1);
	}, false);

	document.getElementById('button').addEventListener('click', reset, false);

	reset();
}, false);
