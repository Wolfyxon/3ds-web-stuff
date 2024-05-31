window.addEventListener('load', function() {
	const qr = document.getElementById('qr'),
		input = document.getElementById('text');
		codeSelectors = document.getElementsByName('codeSelectRadio');

	function getSelectedCode(){
		for(var i = 0; i < codeSelectors.length; i++){
			if(codeSelectors[i].checked){
				return codeSelectors[i].value;
			}
		}
	}
	
	function generate(str) {
		qr.src = 'https://barcodeapi.org/api/' + getSelectedCode() + '/' + decodeURIComponent(str);
	}

	document.getElementById('btn-gen').addEventListener('click', function() {
		if (input.value.length) generate(input.value);
	}, false);
}, false);
