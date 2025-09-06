window.addEventListener( 'load', function () {
	const field = document.getElementById( 'field' ),
		ctx = field.getContext( '2d', {
			alpha: true,
			willReadFrequently: true
		} ),
		plrTxt = document.getElementById( 'plr' ),
		winO = document.getElementById( 'wins-o' ),
		winX = document.getElementById( 'wins-x' );
	var curPlayer = true,
		fieldData = [
			0, 0, 0,
			0, 0, 0,
			0, 0, 0
		],
		filled = 0,
		won = false,
		winsO = 0,
		winsX = 0;

	function getData( x, y ) {
		return fieldData[ y * 3 + x ];
	}
	function drawLine( x, y, x2, y2 ) {
		const startX = 30 + x * 70,
			startY = 30 + y * 70,
			endX = 30 + x2 * 70,
			endY = 30 + y2 * 70;
		ctx.beginPath();
		ctx.moveTo( startX, startY );
		ctx.lineTo( endX, endY );
		ctx.closePath();
		ctx.stroke();
	}
	function checkWin( x, y ) {
		// horizontal
		if ( ( getData( 0, y ) === getData( 1, y ) ) &&
			( getData( 0, y ) === getData( 2, y ) ) &&
			( getData( 0, y ) > 0 ) ) {
			drawLine( 0, y, 2, y );
			won = true;
		}

		// vertical
		if ( ( getData( x, 0 ) === getData( x, 1 ) ) &&
			( getData( x, 0 ) === getData( x, 2 ) ) &&
			( getData( x, 0 ) > 0 ) ) {
			drawLine( x, 0, x, 2 );
			won = true;
		}

		// diagonal \
		if ( ( getData( 0, 0 ) === getData( 1, 1 ) ) &&
			( getData( 1, 1 ) === getData( 2, 2 ) ) &&
			( getData( 0, 0 ) > 0 ) ) {
			drawLine( 0, 0, 2, 2 );
			won = true;
		}

		// diagonal /
		if ( ( getData( 2, 0 ) === getData( 1, 1 ) ) &&
			( getData( 1, 1 ) === getData( 0, 2 ) ) &&
			( getData( 2, 0 ) > 0 ) ) {
			drawLine( 2, 0, 0, 2 );
			won = true;
		}

		if ( won ) {
			return true;
		}
		return false;
	}
	function drawField() {
		ctx.clearRect( 0, 0, field.width, field.height );
		ctx.lineWidth = 10;
		ctx.fillStyle = 'gray';
		ctx.translate( 100, 100 );
		for ( var i = 0; i < 4; i++ ) {
			ctx.beginPath();
			ctx.moveTo( -40, -95 );
			ctx.arc( -35, -95, 5, Math.PI, 0, false );
			ctx.lineTo( -30, 95 );
			ctx.arc( -35, 95, 5, 0, Math.PI, false );
			ctx.lineTo( -40, -95 );
			ctx.closePath();
			ctx.fill();
			ctx.rotate( Math.PI * 0.5 );
		}
		ctx.translate( -100, -100 );
	}
	function drawO( x, y ) {
		ctx.fillStyle = '#0026ff';
		ctx.beginPath();
		ctx.arc( 30 + x * 70, 30 + y * 70, 25, 0, 2 * Math.PI, false );
		ctx.arc( 30 + x * 70, 30 + y * 70, 15, 0, 2 * Math.PI, true );
		ctx.closePath();
		ctx.fill();
	}
	function drawXLine() {
		ctx.beginPath();
		ctx.moveTo( -5, -25 );
		ctx.arc( 0, -25, 5, Math.PI, 0, false );
		ctx.lineTo( 5, 25 );
		ctx.arc( 0, 25, 5, 0, Math.PI, false );
		ctx.lineTo( -5, -25 );
		ctx.closePath();
		ctx.fill();
	}
	function drawX( x, y ) {
		const offsetX = 30 + x * 70,
			offsetY = 30 + y * 70;
		ctx.translate( offsetX, offsetY );
		ctx.fillStyle = '#f00';
		ctx.rotate( Math.PI * 0.25 );
		drawXLine();
		ctx.rotate( -Math.PI * 0.5 );
		drawXLine();
		ctx.rotate( Math.PI * 0.25 );
		ctx.translate( -offsetX, -offsetY );
	}
	function reset() {
		drawField();
		for ( var i = 0; i < 9; i++ ) {
			fieldData[ i ] = 0;
		}
		filled = 0;
		won = false;
	}
	reset();
	field.addEventListener( 'click', function ( e ) {
		const X = Math.floor( ( e.offsetX === undefined ? e.layerX : e.offsetX ) / 70 ),
			Y = Math.floor( ( e.offsetY === undefined ? e.layerY : e.offsetY ) / 70 ),
			n = Y * 3 + X,
			d = ctx.getImageData( e.offsetX, e.offsetY, 1, 1 ).data;
		if ( won || d[ 1 ] === 128 || fieldData[ n ] > 0 ) {
			return;
		}
		filled++;
		fieldData[ n ] = curPlayer ? '1' : '2';
		curPlayer ? drawX( X, Y ) : drawO( X, Y );
		if ( checkWin( X, Y ) ) {
			winsX += curPlayer ? 1 : 0;
			winsO += curPlayer ? 0 : 1;
			winX.textContent = winsX;
			winO.textContent = winsO;
			setTimeout( reset, 1500 );
		}
		curPlayer = !curPlayer;
		plrTxt.style.color = curPlayer ? '#f00' : '#0026ff';
		plrTxt.textContent = curPlayer ? 'X' : 'O';
		if ( filled === 9 && !won ) {
			reset();
		}
	}, false );
}, false );
