window.addEventListener('load', function() {

	var id = 0,
		lastKeyPress = 0,
		prevFrameTime = Date.now();
	const petImg = document.getElementById('pet'),
		tabBtns = document.getElementById('tab-btns'),
		tabs = document.getElementById('tabs'),
		petRoot = 'img/pets/',
		animations = [ // name, delay, spacing, frames
			[ 'pigeon', 3, 0.2, [1, 2, 1] ],
			[ 'maxwell', 0, 0.1, [1, 2, 3, 2] ],
			[ 'chicken', 3, 0.1, [1, 2, 3, 2, 3, 2, 1] ],
			[ 'cat', 0, 0.4, [1, 0, 2, 3, 2] ]
		],
		aName = pickRandom(animations),
		anim = new Animation(petImg);

	anim.setLooped(true);
	anim.setDelay(aName[1]);
	anim.setSpacing(aName[2]);
	for (var f=0; f<aName[3].length; f++) {
		anim.addKeyframe('src', petRoot + aName[0] + '/' + aName[0] + aName[3][f] + '.png');		
	}
	anim.play();

	function setTab(newId) {
		tabs.children[id].style.display = 'none';
		tabBtns.children[id].style.backgroundColor = '#653198';
		id = newId;
		tabs.children[id].style.display = '';
		tabBtns.children[id].style.backgroundColor = 'darkred';
	}

	for (var t=0; t<tabs.children.length; t++) {
		tabs.children[t].style.display = 'none';
	}
	setTab(id);

	tabBtns.addEventListener('click', function(e) {
		if (e.target.nodeName === 'SPAN') setTab(e.target.getAttribute('data-id'));
	});

	setInterval(function() {
		const delta = (Date.now() - prevFrameTime);
		prevFrameTime = Date.now();
		const scrollAmt = 0.5;
		if (isBtnPressed('down')) tabs.children[id].scrollTop += scrollAmt * delta;
		if (isBtnPressed('up')) tabs.children[id].scrollTop -= scrollAmt * delta;
	});

	window.addEventListener('keydown', function(e) {
		const now = Date.now();
		if (now < lastKeyPress + 200) return;
		lastKeyPress = now;

		var newId = id;
		if (e.keyCode === 39) {
			newId++;
			if (newId > tabs.children.length-1) newId = 0;
		} else if (e.keyCode === 37) {
			newId--;
			if (newId < 0) newId = tabs.children.length-1;
		}
		setTab(newId);
	});
});