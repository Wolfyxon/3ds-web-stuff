window.addEventListener( 'load', function () {
	const canv = document.getElementById( 'canvas' ),
		ctx = canv.getContext( '2d', {
			alpha: false,
			willReadFrequently: true
		} ),
		status = document.getElementById( 'status' ),
		start = document.getElementById( 'start' ),
		foodTxt = document.getElementById( 'food-eaten' ),
		timeTxt = document.getElementById( 'time' ),
		gamemodeContainer = document.getElementById( 'gamemode-container' ),
		btnEnableWalls = document.getElementById( 'btn-enable-walls' ),
		btnDisableWalls = document.getElementById( 'btn-disable-walls' ),
		size = 10,
		rows = canv.height / size,
		cols = canv.width / size,
		back1 = '#6abe30',
		back2 = '#99e550';
	var snake = [],
		moveX,
		moveY,
		foodX,
		foodY,
		won = false,
		lost = false,
		foodEaten = 0,
		time = 0,
		paused = true,
		wrapfield = false,
		lastDir = 2;

	function drawBackground( x, y ) {
		ctx.fillStyle = x % 2 - y % 2 ? back1 : back2;
		ctx.fillRect( x * size, y * size, size, size );
	}
	for ( var Y = 0; Y < rows; Y++ ) {
		for ( var X = 0; X < cols; X++ ) {
			drawBackground( X, Y );
		}
	}

	function placeFood() {
		const newX = Math.floor( Math.random() * cols ),
			newY = Math.floor( Math.random() * rows ),
			data = ctx.getImageData( newX * size, newY * size, 1, 1 ).data;
		if ( data[ 0 ] === back1 || data[ 0 ] === back1 || data[ 0 ] === 255 ) {
			return;
		}
		foodX = newX;
		foodY = newY;
	}

	function setStatus() {
		start.disabled = false;
		start.style.opacity = null;
		status.style.display = 'block';
		gamemodeContainer.style.pointerEvents = null;
		gamemodeContainer.style.opacity = null;
		start.style.removeProperty( 'display' );
		if ( lost ) {
			status.style.color = 'red';
			status.textContent = 'Game Over!';
		} else if ( won ) {
			status.style.color = 'green';
			status.textContent = 'You won!';
		}
	}

	function reset() {
		start.disabled = true;
		start.style.opacity = '0.5';
		gamemodeContainer.style.opacity = '0.5';
		gamemodeContainer.style.pointerEvents = 'none';
		status.style.removeProperty( 'display' );
		for ( var i = 0; i < snake.length; i++ ) {
			drawBackground( snake[ i ][ 0 ], snake[ i ][ 1 ] );
		}
		if ( foodX > -1 && foodY > -1 ) {
			drawBackground( foodX, foodY );
		}
		paused = false;
		moveX = 1;
		moveY = 0;
		foodX = -1;
		foodY = -1;
		lastDir = 2;
		foodEaten = 0;
		time = 0;
		won = false;
		lost = false;
		snake = [
			[ Math.floor( cols * 0.5 ), Math.floor( rows * 0.5 ) ]
		];
		updateFoodCounter();
		updateTime();
	}

	function updateFoodCounter() {
		foodTxt.textContent = foodEaten;
	}

	function updateTime() {
		const h = Math.floor( time / 3600 ),
			m = Math.floor( ( time % 3600 ) / 60 ),
			s = Math.floor( ( ( time % 3600 ) % 60 ) % 60 );
		timeTxt.textContent = h + ':' + ( '0' + m ).slice( -2 ) + ':' + ( '0' + s ).slice( -2 );
	}

	function die() {
		paused = true;
		lost = true;
		setStatus();
	}

	function updateGamemodes() {
		const bg = '#00AA00';

		btnEnableWalls.style.backgroundColor = '';
		btnDisableWalls.style.backgroundColor = '';

		if ( wrapfield ) {
			btnDisableWalls.style.backgroundColor = bg;
		} else {
			btnEnableWalls.style.backgroundColor = bg;
		}

	}
	updateGamemodes();

	setInterval( function () {
		if ( paused ) {
			return;
		}

		if ( foodX < 0 ) {
			placeFood();
		}

		// Add food
		if ( foodX > -1 && foodY > -1 ) {
			ctx.fillStyle = 'red';
			ctx.strokeStyle = 'red';

			// ctx.fillRect(foodX * size, foodY * size, size, size);
			ctx.beginPath();
			ctx.arc( ( foodX * size ) + size / 2, ( foodY * size ) + size / 2, size * 0.4, 0, 2 * Math.PI, false );
			ctx.fill();
			ctx.stroke();
		}

		ctx.fillStyle = 'white';

		// Add new head pos
		const cur = snake[ snake.length - 1 ],
			tmpX = cur[ 0 ] + moveX,
			tmpY = cur[ 1 ] + moveY,
			newX = ( tmpX < 0 ) ? cols : ( ( tmpX >= cols ) ? 0 : tmpX ),
			newY = ( tmpY < 0 ) ? rows : ( ( tmpY >= rows ) ? 0 : tmpY ),
			data = ctx.getImageData( newX * size + 5, newY * size + 5, 1, 1 ).data;
		if ( !wrapfield && ( ( tmpX < 0 ) || ( tmpX >= cols ) || ( tmpY < 0 ) || ( tmpY >= rows ) ) ) {
			die();
			return;
		} else if ( data[ 0 ] === 255 && newX !== foodX && newY !== foodY ) { // Check if you bite yourself
			die();
			return;
		} else if ( snake.length === rows * cols ) {
			won = true;
		}

		snake.push( [ newX, newY ] );

		// Draw new head
		const now = snake[ snake.length - 1 ];
		ctx.fillRect( now[ 0 ] * size, now[ 1 ] * size, size, size );

		// Only remove tail if length < 3
		if ( snake.length < 4 ) {
			return;
		}

		// Eat apple or remove tail
		if ( now[ 0 ] === foodX && now[ 1 ] === foodY ) {
			foodX = -1;
			foodY = -1;
			foodEaten++;
			updateFoodCounter();
		} else {
			const old = snake[ 0 ];
			drawBackground( old[ 0 ], old[ 1 ] );
			snake.splice( 0, 1 );
		}
		if ( moveX === 1 ) {
			lastDir = 0;
		}
		if ( moveY === 1 ) {
			lastDir = 1;
		}
		if ( moveX === -1 ) {
			lastDir = 2;
		}
		if ( moveY === -1 ) {
			lastDir = 3;
		}
	}, 150 );

	setInterval( function () {
		if ( paused ) {
			return;
		}
		time++;
		updateTime();
	}, 1000 );

	document.addEventListener( 'keydown', function ( e ) {
		e.preventDefault();
		const k = e.keyCode;
		if ( paused && isButton( k, 'a' ) ) {
			reset();
		} // a

		if ( paused ) {
			return;
		}

		if ( isButton( k, 'left' ) && lastDir !== 0 ) { // left
			moveX = -1;
			moveY = 0;
		} else if ( isButton( k, 'up' ) && lastDir !== 1 ) { // up
			moveX = 0;
			moveY = -1;
		} else if ( isButton( k, 'right' ) && lastDir !== 2 ) { // right
			moveX = 1;
			moveY = 0;
		} else if ( isButton( k, 'down' ) && lastDir !== 3 ) { // down
			moveX = 0;
			moveY = 1;
		}
	}, false );

	start.addEventListener( 'click', reset, false );

	btnDisableWalls.addEventListener( 'click', function () {
		wrapfield = true;
		updateGamemodes();
	}, false );

	btnEnableWalls.addEventListener( 'click', function () {
		wrapfield = false;
		updateGamemodes();
	}, false );
}, false );
