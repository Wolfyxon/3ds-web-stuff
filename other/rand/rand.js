window.addEventListener('load', function() {
	const minInput = document.getElementById('min'),
		maxInput = document.getElementById('max'),
		resultTxt = document.getElementById('result'),
		intChk = document.getElementById('chk-int');

	document.getElementById('btn-gen').addEventListener('click', function() {
		var res = randf(parseFloat(minInput.value), parseFloat(maxInput.value));
		if (intChk.checked) res = Math.floor(res);

		resultTxt.innerText = res;
	}, false);
}, false);