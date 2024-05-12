window.addEventListener("load", function() {
	const formula = document.getElementById('formula'),
		result = document.getElementById('result');

	function run() {
		if (formula.innerText === '') return;

		try {
			result.innerText = eval(formula.innerText);
		} catch (e){
			alert(e)
		}
	}

	document.getElementById('pads').onclick = function(e) {
		const target = e.target;
		if (target.nodeName !== 'BUTTON') return;
		if (target.innerText === '=') run();
		else formula.innerText += target.innerText;
	};

	document.getElementById('btn-clear').onclick = function() {
		result.innerText = '';
		formula.innerText = '';
	};

	document.getElementById('btn-backspace').onclick = function() {
		formula.innerText = formula.innerText.slice(0, -1);
	};
}, false);
