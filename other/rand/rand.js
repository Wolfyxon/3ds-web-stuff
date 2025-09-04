window.addEventListener( 'load', function () {
	const minInput = document.getElementById( 'min' ),
		maxInput = document.getElementById( 'max' ),
		resultTxt = document.getElementById( 'result' ),
		intChk = document.getElementById( 'chk-int' );

	document.getElementById( 'btn-gen' ).addEventListener( 'click', function () {
		const min = parseFloat( minInput.value ),
			max = parseFloat( maxInput.value );

		var res = res = intChk.checked ? randi( min, max ) : randf( min, max );

		resultTxt.textContent = res;
	}, false );
}, false );
