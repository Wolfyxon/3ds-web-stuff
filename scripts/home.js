window.addEventListener('load', function() {
	var id = 0,
		lastKeyPress = 0,
		prevFrameTime = new Date().valueOf();
	const petImg = document.getElementById('pet'),
		tabBtns = document.getElementById('tab-btns'),
		tabs = document.getElementById('tabs'),
		appLists = document.getElementsByClassName("app-list"),
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
	window.addEventListener('blur', function() {
		anim.stop();
	}, false);
	window.addEventListener('focus', function() {
		anim.play();
	}, false);

	function setTab(newId) {
		tabs.children[id].style.display = 'none';
		tabBtns.children[id].style.backgroundColor = '#653198';
		id = newId;
		tabs.children[id].style.display = '';
		tabBtns.children[id].style.backgroundColor = 'darkred';
	}

	for (var t = 0; t < tabs.children.length; t++) {
		tabs.children[t].style.display = 'none';
	}
	setTab(id);


	if(isDSi()) {
		for(var lI = 0; lI < appLists.length; lI++) {
			const list = appLists[lI];

			for(var aI = 0; aI < list.children.length; aI++) {
				const app = list.children[aI];

				if(app.getElementsByClassName("tag-dsi").length === 0) {
					app.addEventListener("click", function(e){
						if(!confirm("This app will most likely not work on your DSi as it's not supported. You may experience errors. \nContinue?")) {
							e.preventDefault();
						}
					}, false);
				}
			}
		}
	}

	setInterval(function() {
		const delta = (new Date().valueOf() - prevFrameTime);
		prevFrameTime = new Date().valueOf();

		const scrollAmt = 0.5;
		if (isBtnPressed('down')) tabs.children[id].scrollTop += scrollAmt * delta;
		if (isBtnPressed('up')) tabs.children[id].scrollTop -= scrollAmt * delta;
	});

	tabBtns.addEventListener('click', function(e) {
		if (e.target.nodeName === 'SPAN') setTab(e.target.getAttribute('data-id'));
	}, false);

	window.addEventListener('keydown', function(e) {
		const now = new Date().valueOf();
		if (now < lastKeyPress + 200) return;
		lastKeyPress = now;

		var newId = id;
		if (isButton(e.keyCode, "right")) {
			newId++;
			if (newId > tabs.children.length-1) newId = 0;
		} else if (isButton(e.keyCode, "left")) {
			newId--;
			if (newId < 0) newId = tabs.children.length-1;
		}
		setTab(newId);
	}, false);
}, false);