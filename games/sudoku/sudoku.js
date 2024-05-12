window.addEventListener('load', function() {
	const t = document.getElementById('board'),
		settings = document.getElementById('settings'),
		sizes = {4: [2, 2, 10], 6: [3, 2, 21], 9: [3, 3, 45]}; // Width, Height, Sum per col/row

	var field = [],
		size = 9,
		last;

	function getSelection(e) {
		return e.options[e.selectedIndex];
	}

	function getSumOfColOrRow(n, isCol) {
		var c = 0;
		if (isCol) {
			const r = t.rows;
			for (var i=0; i<r.length; i++) {
				c += Number(r[i].children[n].textContent);
			}

		} else {
			const r = t.rows[n].children;
			for (var i=0; i<r.length; i++) {
				c += Number(r[i].textContent);
			}
		}
		return c;
	}

	function checkWin() {
		for (var i = 0; i < size; i++) {
			if (getSumOfColOrRow(i, false) !== sizes[size][2]) {return false;}
			if (getSumOfColOrRow(i, true) !== sizes[size][2]) {return false;}
		}
		alert('You won!');
		return true;
	}

	function generateField(size) {
		var a = '123456789'.substring(0, size);
		a = a + a + a + a;
		for (var i = 0; i < size; i++) {
			var offset = Math.ceil((i + 1) / size * sizes[size][0]) - 1;
			field[i] = a.substring(i * sizes[size][0] + offset, i * sizes[size][0] + size + offset).split('');
		}
	}

	function switchCol(a, b) {
		for (var i = 0; i < field.length; i++) {
			const tmp = field[i][a];
			field[i][a] = field[i][b];
			field[i][b] = tmp;
		}
	}

	function switchRow(a, b) {
		const tmp = field[a];
		field[a] = field[b];
		field[b] = tmp;
	}

	function randomizeField(func, var1, var2) {
		var col1, col2, i;
		// Columns / Rows
		for (i = 0; i < 10; i++) {
			col1 = Math.floor(Math.random() * var2) * var1;
			col2 = Math.floor(Math.random() * var2) * var1;
			if (col1 === col2) {continue;}
			for (var j = 0; j < var1; j++) {
				func(col1 + j, col2 + j);
			}
		}
		// Column / Row-Content
		for (i = 0; i < 10; i++) {
			var col = Math.floor(Math.random() * var2) * var1;
			col1 = Math.floor(Math.random() * var1);
			col2 = Math.floor(Math.random() * var1);
			if (col1 === col2) {continue;}
			func(col + col1, col + col2);
		}
	}

	function generateTable(size) {
		t.textContent='';
		for (var i = 0; i < size; i++) {
			var row = t.insertRow();
			for (var j = 0; j < size; j++) {
				var cell = document.createElement('td');
				cell.textContent = field[i][j];
				row.appendChild(cell);
			}
		}
	}

	function replaceRandomEntries(n) {
		var r = t.rows;
		var c = 0;
		while (c < n) {
			var x = Math.floor(Math.random() * size);
			var y = Math.floor(Math.random() * size);
			if (r[y].cells[x].innerText.length) {
				r[y].cells[x].innerText = '';
				r[y].cells[x].className += 'input';
				c++;
			}
		}
	}

	function reset() {
		size = Number(getSelection(document.getElementById('sizeselector')).getAttribute('data-size'));
		t.setAttribute('data-size', size);
		var i = document.getElementById('input');
		i.textContent = '';
		for (var j = 1; j <= size; j++) {
			var r = i.insertRow(i.rows.length);
			const c = document.createElement('td');
			c.textContent = j
			r.appendChild(c);
		}
		generateField(size);
		randomizeField(switchCol, sizes[size][0], sizes[size][1]);
		randomizeField(switchRow, sizes[size][1], sizes[size][0]);
		generateTable(size);
		replaceRandomEntries(Number(getSelection(document.getElementById('diffselector')).getAttribute('data-emptycells').split(',')[document.getElementById('sizeselector').selectedIndex]));
		settings.style.display = '';
	}

	document.getElementById('resetbtn').addEventListener('click', reset, false);

	document.getElementById('board').addEventListener('click', function(e) {
		if (e.target.nodeName !== 'TD' || e.target.className.indexOf('input') < 0) return;

		if (last) last.className = last.className.replace(' selected', '');
		last = e.target;
		e.target.className += ' selected';
	}, false);

	document.getElementById('input').addEventListener('click', function(e) {
		if (!last || e.target.nodeName !== 'TD') return;

		last.textContent = e.target.textContent;
		checkWin();
	}, false);

	document.addEventListener('keydown', function(e) {
		e.preventDefault();
		if (e.isComposing || e.key === 229) return;
		if (e.key > 0 && e.key <= size) {
			last.textContent = e.key;
			checkWin();
		}
	}, false);

	document.getElementById('open').addEventListener('click', function() {
		settings.style.display = settings.style.display.length ? '' : 'block';
	}, false);

	reset();
}, false);