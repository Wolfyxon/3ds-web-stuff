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
			if(codeSelectors[i].checked){
				return codeSelectors[i].value;
			}
		}
	}

	function generate(str) {
		var imageUrl = 'http://bwipjs-api.metafloor.com?bcid=' + getSelectedCode() + '&text=' + decodeURIComponent(str);
		qr.src = imageUrl;
	}

	document.getElementById('btn-gen').addEventListener('click', function() {
		if (input.value.length) generate(input.value);
	}, false);
	
	left.addEventListener('click', function(e) {
		right.style.removeProperty('color');
		pages[page].style.display = 'none';
		page--;
		pages[page].style.removeProperty('display');
		if (page === 0) e.target.style.color = 'transparent';
	});
	
	right.addEventListener('click', function(e) {
		left.style.removeProperty('color');
		pages[page].style.display = 'none';
		page++;
		pages[page].style.removeProperty('display');
		if (page+1 === pages.length) e.target.style.color = 'transparent';
	});
}, false);
