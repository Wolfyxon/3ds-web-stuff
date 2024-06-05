window.addEventListener('load', function() {
	const qr = document.getElementById('qr'),
		input = document.getElementById('text'),
		codeSelectors = document.getElementsByName('codeSelectRadio'),
		pages = document.getElementsByClassName('page'),
		left = document.getElementById('left'),
		right = document.getElementById('right');
	var page = 0;

	function getSelectedCode(){
		for(var i = 0; i < codeSelectors.length; i++){
			const sel = codeSelectors[i]
			if(sel.checked){
				return sel.value;
			}
		}
	}

	function generate(str) {
		qr.src = 'http://bwipjs-api.metafloor.com?bcid=' + getSelectedCode() + '&text=' + decodeURIComponent(str);
	}

	function nextPage() {
		if(page + 1 >= pages.length) return;

		left.style.removeProperty('color');
		pages[page].style.display = 'none';
		page++;
		pages[page].style.removeProperty('display');
		if (page + 1 === pages.length) right.style.color = 'transparent';
	}

	function prevPage() {
		if(page <= 0) return;

		right.style.removeProperty('color');
		pages[page].style.display = 'none';
		page--;
		pages[page].style.removeProperty('display');
		if (page === 0) left.style.color = 'transparent';
	}

	document.getElementById('btn-gen').addEventListener('click', function() {
		if (input.value.length) generate(input.value);
	}, false);

	onBtnJustPressed("left", prevPage);
	onBtnJustPressed("right", nextPage);

	left.addEventListener('click', prevPage, false);
	right.addEventListener('click', nextPage, false);
}, false);
