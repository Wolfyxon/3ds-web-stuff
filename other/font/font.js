window.addEventListener( 'load', function () {
	const table = document.getElementById( 'table' ),
		thead = table.appendChild( document.createElement( 'thead' ) ),
		tbody = table.appendChild( document.createElement( 'tbody' ) ),
		hRow = thead.appendChild( document.createElement( 'tr' ) ),
		tmp = hRow.appendChild( document.createElement( 'th' ) );

	/* Add header */
	tmp.textContent = 'U+';
	for ( var i = 0; i < 16; i++ ) {
		const th = hRow.appendChild( document.createElement( 'th' ) );
		th.textContent = ( i ).toString( 16 ).toUpperCase();
	}

	/* Add content */
	for ( var y = 0; y < 8; y++ ) {
		const bRow = tbody.appendChild( document.createElement( 'tr' ) ),
			th2 = bRow.appendChild( document.createElement( 'th' ) );
		th2.textContent = 'E0' + y + 'x';
		for ( var x = 0; x < 16; x++ ) {
			const td = bRow.appendChild( document.createElement( 'td' ) );
			td.textContent = String.fromCharCode( '0xE0' + y + ( x ).toString( 16 ) );
		}
	}
}, false );
