window.addEventListener( 'load', function () {
	const formula = document.getElementById( 'formula' ),
		result = document.getElementById( 'result' );

	function run() {
		if ( formula.textContent === '' ) {
			return;
		}

		try {
			result.textContent = eval( formula.textContent );
		} catch ( e ) {
			alert( e );
		}
	}

	document.getElementById( 'pads' ).addEventListener( 'click', function ( e ) {
		const target = e.target;
		if ( target.nodeName !== 'BUTTON' ) {
			return;
		}
		if ( target.textContent === '=' ) {
			run();
		} else {
			formula.textContent += target.textContent;
		}
	}, false );

	document.getElementById( 'btn-clear' ).addEventListener( 'click', function () {
		result.textContent = '';
		formula.textContent = '';
	}, false );

	document.getElementById( 'btn-backspace' ).addEventListener( 'click', function () {
		formula.textContent = formula.textContent.slice( 0, -1 );
	}, false );
}, false );
