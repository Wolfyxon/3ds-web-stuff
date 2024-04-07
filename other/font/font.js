window.addEventListener('load', function() {
	const table = document.getElementById('table');

	/* Add content */
	for (var y=0; y<8; y++) {
		const row = table.insertRow(table.rows.length);
		row.insertCell().textContent = 'E0' + y + 'x';
		for (var x=0; x<16; x++) {
			const cell = row.insertCell(row.cells.length);
			cell.textContent = String.fromCharCode('0xE0' + y + (x).toString(16))
		}
	}

	const header = table.createTHead();
	const hRow = header.insertRow();

	/* Add header */
	hRow.insertCell().textContent = 'U+';
	for (var x=0; x<16; x++) {
		const hCell = hRow.insertCell(hRow.cells.length);
		hCell.textContent = (x).toString(16).toUpperCase();
	}
});

