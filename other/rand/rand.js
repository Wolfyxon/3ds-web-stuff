window.addEventListener('load', function() {
	const minInput = document.getElementById('min'),
		maxInput = document.getElementById('max'),
		resultTxt = document.getElementById('result'),
		intChk = document.getElementById('chk-int');

	document.getElementById('btn-gen').addEventListener('click', function() {
		const min = parseFloat(minInput.value);
		const max = parseFloat(maxInput.value);

		var res = 0;
		if (intChk.checked) res = randi(min, max);
		else res = randf(min, max);

		resultTxt.innerText = res;
	}, false);
}, false);