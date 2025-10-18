window.addEventListener( 'load', function () {
	const unitType = document.getElementById( 'unit-type' ),
		inputUnitFrom = document.getElementById( 'input-unit-from' ),
		inputUnitTo = document.getElementById( 'input-unit-to' ),
		unitFrom = document.getElementById( 'unit-from' ),
		inputNum = document.getElementById( 'input-num' ),
		outputNum = document.getElementById( 'output-num' ),
		btnConvert = document.getElementById( 'btn-convert' ),
		conv = window.conversions || {},
		keys = Object.keys(conv);

	function getSingular( name ) {
		return name.split( '|' )[ 0 ].split( '/' )[ 0 ];
	}

	function getPlural( name ) {
		if ( name.indexOf( '/' ) !== -1 ) {
			return name.replace( '/', '' );
		} else {
			return name.split( '|' )[ 1 ];
		}
	}

	function updateUnitsFrom() {
		unitFrom.textContent = getPlural( inputUnitFrom.value );
	}

	function updateInputUnit() {
		inputUnitFrom.innerHTML = '';
		inputUnitTo.innerHTML = '';

		const keys2 = Object.keys(conv[ unitType.value ]);
		for ( var z = 0; z < keys2.length; z++ ) {
			inputUnitFrom.appendNew(['option', { value: keys2[ z ] }, getPlural( keys2[ z ] )]);
			inputUnitTo.appendNew(['option', { value: keys2[ z ] }, getPlural( keys2[ z ] )]);
		}

		updateUnitsFrom();
	}

	for ( var i = 0; i < keys.length; i++ ) {
		const b = keys[ i ];
		unitType.appendNew(['option', { value: b }, b]);
	}

	updateInputUnit();

	unitType.addEventListener( 'change', updateInputUnit, false );
	inputUnitFrom.addEventListener( 'change', updateUnitsFrom, false );
	btnConvert.addEventListener( 'click', function () {
		const v = conv[ unitType.value ];
		var calculated = inputNum.value * v[ inputUnitTo.value ] / v[ inputUnitFrom.value ];
		const l = Math.log( calculated );

		calculated = calculated.toFixed( Math.max( Math.min( 5 - l, 5 - 1 / l ), 0 ) );

		outputNum.textContent = Number( calculated ) + ' ' + ( calculated === 1 ? getSingular( inputUnitTo.value ) : getPlural( inputUnitTo.value ) );
	}, false );
}, false ); 