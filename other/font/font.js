window.addEventListener('load', function() {
	const table = document.getElementById('table');
	var hRow = '<th>U+</th>',
		rows = '';

	/* Add header */
	for (var i=0; i<16; i++) {
		hRow += '<th>' + (i).toString(16).toUpperCase() + '</th>';
	}

	/* Add content */
	for (var y=0; y<8; y++) {
		rows += '<tr><td>E0' + y + 'x</td>';
		for (var x=0; x<16; x++) {
			rows += '<td>' + String.fromCharCode('0xE0' + y + (x).toString(16)) + '</td>';
		}
		rows += '</tr>';
	}
	table.innerHTML = '<thead><tr>' + hRow + '</tr></thead><tbody>' + rows + '</tbody>';
}, false);