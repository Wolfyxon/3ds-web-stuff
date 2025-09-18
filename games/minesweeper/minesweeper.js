// Originally made by magiczocker10

window.addEventListener( 'load', function () {
	const field = document.getElementById( 'field' ),
		tbody = field.appendChild( document.createElement( 'tbody' ) ),
		minesDisplay = document.getElementById( 'mines' ),
		flagsDisplay = document.getElementById( 'flags' ),
		timeDisplay = document.getElementById( 'time' ),
		restartMsg = document.getElementById( 'restart-msg' ),
		resetBtn = document.getElementById( 'btn-reset' ),
		flagBtn = document.getElementById( 'btn-flag' ),
		width = 12,
		height = 12,
		mineCount = 10,
		pos = [
			[ -1, -1 ],
			[ 0, -1 ],
			[ 1, -1 ],
			[ -1, 0 ],
			[ 1, 0 ],
			[ -1, 1 ],
			[ 0, 1 ],
			[ 1, 1 ]
		],
		data = [];
	var lost = false,
		won = false,
		first = true,
		flagging = false,
		time = 0,
		timeout,
		flagCount = 0,
		opened = 0;

	function drawIcon( x, y, tile ) {
		data[ y ][ x ][ 3 ].src = './img/' + tile + '.png';
		data[ y ][ x ][ 3 ].setAttribute( 'title', tile );
	}

	function generate( excludeX, excludeY ) {
		excludeX = excludeX || -1;
		excludeY = excludeY || -1;
		const cells = [];
		var minesPlaced = 0;

		/* generate cells */
		for ( var y = 0; y < height; y++ ) {
			for ( var x = 0; x < width; x++ ) {
				const d = data[ y ][ x ];
				d[ 0 ] = 0; // count
				d[ 1 ] = false; // open state
				d[ 2 ] = false; // flagged
				cells.push( [ x, y ] );
				drawIcon( x, y, 'closed' );
			}
		}

		while ( minesPlaced < mineCount ) {
			var index = Math.floor( Math.random() * cells.length ),
				abc = cells[ index ],
				col = abc[ 0 ],
				row = abc[ 1 ],
				cell = data[ row ][ col ];

			// Return if cell should be excluded
			if ( col === excludeX && row === excludeY ) {
				continue;
			}

			// Place mine
			cell[ 0 ] = -1;

			// Increase count on adjacent cells
			for ( var i = 0; i < pos.length; i++ ) {
				var x2 = col + pos[ i ][ 0 ],
					y2 = row + pos[ i ][ 1 ];

				if ( x2 < 0 || x2 >= width || y2 < 0 || y2 >= height ) {
					continue;
				}

				const c = data[ y2 ][ x2 ];
				if ( c[ 0 ] >= 0 ) {
					c[ 0 ]++;
				}
			}

			cells.splice( index, 1 );
			minesPlaced++;
		}
	}

	function endGame( clickedX, clickedY ) {
		restartMsg.style.visibility = 'visible';
		lost = true;
		var icon = '';
		for ( var y = 0; y < width; y++ ) {
			for ( var x = 0; x < height; x++ ) {
				const d = data[ y ][ x ];
				if ( d[ 0 ] === -1 && d[ 2 ] ) { // flagged + bomb
					continue;
				} else if ( d[ 0 ] >= 0 && d[ 2 ] ) { // wrongly flagged
					icon = 'wrong';
				} else if ( clickedX === x && clickedY === y ) { // clicked bomb
					icon = 'hit';
				} else if ( d[ 0 ] === -1 ) { // bomb
					icon = 'mine';
				} else {
					continue;
				}
				drawIcon( x, y, icon );
			}
		}
	}

	function open( x, y ) {
		if ( x < 0 || x >= width || y < 0 || y >= height ) {
			return;
		}

		// Return if already open or flagged
		const cell = data[ y ][ x ];
		if ( cell[ 1 ] || cell[ 2 ] ) {
			return;
		}

		// If it's a mine
		if ( cell[ 0 ] === -1 ) {
			endGame( x, y );
			return;
		}

		// Open field
		opened++;
		cell[ 1 ] = true;
		drawIcon( x, y, cell[ 0 ] );

		// Return if count > 0
		if ( cell[ 0 ] > 0 ) {
			return;
		}

		// Reveal adjacent cells
		for ( var i = 0; i < pos.length; i++ ) {
			open( x + pos[ i ][ 0 ], y + pos[ i ][ 1 ] );
		}
	}

	function reset() {
		lost = false;
		won = false;
		first = true;
		time = 0;
		opened = 0;
		flagCount = 0;
		minesDisplay.textContent = mineCount;
		flagsDisplay.textContent = mineCount;
		timeDisplay.textContent = '0 sec';
		restartMsg.style.visibility = '';
		generate();
	}

	function updateTime() {
		if ( first || won || lost ) {
			clearInterval( timeout );
			timeout = null;
			return;
		}
		time++;
		timeDisplay.textContent = time + ' sec';
	}

	function imgClick( e ) {
		if ( won || lost ) {
			return;
		}
		const x = Number( e.target.getAttribute( 'data-column' ) ),
			y = Number( e.target.getAttribute( 'data-row' ) ),
			cell = data[ y ][ x ];

		// Return if the cell is already open
		if ( cell[ 1 ] ) {
			return;
		}

		// Check flagged attribute
		const flagged = cell[ 2 ];

		// Flag or unflag
		if ( flagging ) {
			if ( ( flagCount === mineCount ) && !flagged ) {
				return;
			}
			cell[ 2 ] = !cell[ 2 ];
			flagCount += flagged ? -1 : 1;
			flagsDisplay.textContent = mineCount - flagCount;
			drawIcon( x, y, flagged ? 'closed' : 'flag' );
			first = false;
			return;
		}

		// Return if flagged
		if ( flagged ) {
			return;
		}

		// Reset if first click is a bomb
		if ( first && cell[ 0 ] === -1 ) {
			generate( x, y );
		}

		// Start timer if not running
		if ( !timeout ) {
			timeout = setInterval( updateTime, 1000 );
		}

		// Open cell
		first = false;
		open( x, y );

		// Check if all cells are open
		if ( opened + mineCount === width * height ) {
			restartMsg.style.visibility = 'visible';
			alert( 'You won!' );
			won = true;
		}
	}

	function generateTable() {
		for ( var y = 0; y < height; y++ ) {
			const row = tbody.appendChild( document.createElement( 'tr' ) );
			data[ y ] = [];
			for ( var x = 0; x < width; x++ ) {
				const td = row.appendChild( document.createElement( 'td' ) ),
					img = td.appendChild( document.createElement( 'img' ) );
				img.setAttribute( 'data-column', String( x ) );
				img.setAttribute( 'data-row', String( y ) );
				img.src = './img/closed.png';
				img.addEventListener( 'click', imgClick, false );
				data[ y ][ x ] = [ 0, false, false, img ];
			}
		}
	}

	generateTable();
	reset();

	resetBtn.addEventListener( 'click', function () {
		if ( opened === 0 ) {
			return;
		}

		if ( !lost ) {
			if ( !confirm( 'Restart the game?' ) ) {
				return;
			}
		}

		reset();
	}, false );

	flagBtn.addEventListener( 'click', function () {
		flagging = !flagging;
		flagBtn.style.backgroundColor = flagging ? 'gray' : '';
	}, false );

	document.addEventListener( 'keydown', function ( e ) {
		if ( isButton( e.keyCode, 'a' ) ) {
			if ( won || lost ) {
				reset();
			}
		}
		preventKey( e );
	}, false );
}, false );
