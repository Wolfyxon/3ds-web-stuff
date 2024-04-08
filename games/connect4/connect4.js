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
			const t = getType(n, y);

			// horizontal
			if ((t === getType(n + 1, y)) &&
				(t === getType(n + 2, y)) &&
				(t === getType(n + 3, y)) &&
				(t !== '')) {
				won = true;
			}

			if (n === 3) break;

			const t2 = getType(x, n);

			// vertical
			if ((t2 === getType(x, n + 1)) &&
				(t2 === getType(x, n + 2)) &&
				(t2 === getType(x, n + 3)) &&
				(t2 !== '')) {
				won = true;
			}
		}

		for (var row2 = 0; row2 < 3; row2++) {
			for (var column2 = 0; column2 < 4; column2++) {
				// diagonal \
				const t = getType(column2, row2 + 3),
					t2 = getType(column2, row2);
				if ((t === getType(column2 + 1, row2 + 2)) &&
					(t === getType(column2 + 2, row2 + 1)) &&
					(t === getType(column2 + 3, row2)) &&
					(t !== '')) {
					won = true;
				} else

				// diagonal /
				if ((t2 === getType(column2 + 1, row2 + 1)) &&
					(t2 === getType(column2 + 2, row2 + 2)) &&
					(t2 === getType(column2 + 3, row2 + 3)) &&
					(t2 !== '')) {
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
			c[j].style.color = '';
			c[j].setAttribute('data-index', '5');
		}

		var cells = field.getElementsByTagName('td');
		for (var i=0; i<cells.length; i++) {
			cells[i].textContent = '';
			cells[i].setAttribute('data-player', '')
		}
		won = false;
		updateCurrent();
	}

	input.addEventListener('click', function(e) {
		if (won || e.target.tagName !== 'TH') return;

		const column = e.target.cellIndex,
			row = Number(e.target.getAttribute('data-index'));

		if (row < 0) return;
		if (row === 0) e.target.style.color = 'transparent';

		rows[row].cells[column].textContent = 'o';
		rows[row].cells[column].setAttribute('data-player', player ? '1' : '0');
		checkWin(column, row);
		if (won) {
			alert((player ? 'Red' : 'Blue') + ' won');
			if (player) red.textContent = Number(red.textContent) + 1
			else blue.textContent = Number(blue.textContent) + 1;
		};
		player = !player;
		updateCurrent();
		e.target.setAttribute('data-index', row - 1);
	});

	document.getElementById('button').addEventListener('click', reset);

	reset();
});
