window.addEventListener('load', function() {
	const formula = document.getElementById('formula'),
		result = document.getElementById('result');

	function run() {
		if (formula.innerText === '') return;

		try {
			result.innerText = eval(formula.innerText);
		} catch (e){
			alert(e);
		}
	}

	document.getElementById('pads').addEventListener('click', function(e) {
		const target = e.target;
		if (target.nodeName !== 'BUTTON') return;
		if (target.innerText === '=') run();
		else formula.innerText += target.innerText;
	}, false);

	document.getElementById('btn-clear').addEventListener('click', function() {
		result.innerText = '';
		formula.innerText = '';
	}, false);

	document.getElementById('btn-backspace').addEventListener('click', function() {
		formula.innerText = formula.innerText.slice(0, -1);
	},false);
}, false);
