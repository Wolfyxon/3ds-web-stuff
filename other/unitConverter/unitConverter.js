window.addEventListener( 'load', function () {
	window.conversions = window.conversions || {
		Length: {},
		Mass: {},
		Volume: {},
		Time: {}
	};
	const keys = [
			'Length',
			'Mass',
			'Volume',
			'Time'
		],
		conv = window.conversions;

	Element.prototype.appendNew = function ( tagname, attributes1, attributes2 ) {
		/* Examples:
	        myElem.appendNew("div")  ->  myElem.innerHTML === "<div></div>"
	        myElem.appendNew("div", "Hello, world!")  ->  myElem.innerHTML === "<div>Hello, world!</div>"
	        myElem.appendNew("div", {id: "foo"})  ->  myElem.innerHTML === "<div id='foo'></div>"
	        myElem.appendNew("div", {id: "foo"}, "Hello, world!");  ->  myElem.innerHTML === "<div id='foo'>Hello, world!</div>"
	    */
		attributes1 = attributes1 || '';
		attributes2 = attributes2 || '';
		var content,
			attributes;
		if ( typeof attributes1 === 'object' ) {
			attributes = attributes1;
			content = attributes2;
		} else {
			attributes = {};
			content = attributes1;
		}

		var elem = document.createElement( tagname );
		if ( tagname !== 'input' ) {
			elem.innerHTML = content;
		}
		for ( var attribute in attributes ) {
			if ( attributes.hasOwnProperty( attribute ) ) {
				elem[ attribute ] = attributes[ attribute ];
				elem.setAttribute( attribute, attributes[ attribute ] );
			}
		}
		this.appendChild( elem );
		return elem;
	};

	const unitType = document.getElementById( 'unit-type' );
	for ( var i = 0; i < keys.length; i++ ) {
		const b = keys[ i ];
		unitType.appendNew( 'option', { value: b }, b );
	}
	updateInputUnit();

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

	function updateInputUnit() {
		const unitType2 = document.getElementById( 'unit-type' ),
			inputUnitFrom = document.getElementById( 'input-unit-from' ),
			inputUnitTo = document.getElementById( 'input-unit-to' );
		inputUnitFrom.innerHTML = '';
		inputUnitTo.innerHTML = '';

		const keys2 = conv[ unitType2.value ].keys();
		for ( var z = 0; z < keys2.length; z++ ) {
			inputUnitFrom.appendNew( 'option', { value: keys2[ z ] }, getPlural( keys2[ z ] ) );
			inputUnitTo.appendNew( 'option', { value: keys2[ z ] }, getPlural( keys2[ z ] ) );
		}

		updateUnitsFrom();
	}

	function updateUnitsFrom() {
		const unitFrom = document.getElementById( 'unit-from' ),
			inputUnitFrom = document.getElementById( 'input-unit-from' );

		unitFrom.innerHTML = getPlural( inputUnitFrom.value );
	}

	function convert() {
		const unitType2 = document.getElementById( 'unit-type' ),
			inputUnitFrom = document.getElementById( 'input-unit-from' ),
			inputUnitTo = document.getElementById( 'input-unit-to' ),
			inputNum = document.getElementById( 'input-num' ),
			outputNum = document.getElementById( 'output-num' );

		var calculated = inputNum.value * conv[ unitType2.value ][ inputUnitTo.value ] / conv[ unitType2.value ][ inputUnitFrom.value ];

		calculated = calculated.toFixed( Math.max( Math.min( 5 - Math.log( calculated ), 5 - 1 / Math.log( calculated ) ), 0 ) );

		if ( calculated === 1 ) {
			outputNum.innerHTML = Number( calculated ) + ' ' + getSingular( inputUnitTo.value );
		} else {
			outputNum.innerHTML = Number( calculated ) + ' ' + getPlural( inputUnitTo.value );
		}

	}

	document.getElementById( 'unit-type' ).addEventListener( 'change', updateInputUnit, false );
	document.getElementById( 'input-unit-from' ).addEventListener( 'change', updateUnitsFrom, false );
	document.getElementById( 'btn-convert' ).addEventListener( 'click', convert, false );
}, false );
