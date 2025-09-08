window.addEventListener("load",function (){
	const scrollPos = document.getElementById("scroll-pos"),
		zoomPos = document.getElementById("zoom-pos"),
		userAg = document.getElementById("user-agent"),
		btn = document.getElementById("btn"),
		gamepadTxt = document.getElementById("gamepad"),
		anim = document.getElementById("anim-test");

	userAg.textContent = navigator.userAgent;
	document.getElementById("is-3ds").textContent = "Is 3DS: " + is3DS();

	var clickCount = 0;
	btn.addEventListener("click",function (){
		clickCount+=1;
		btn.textContent = "Clicked "+clickCount+" times";
	}, false);

	var targetColor = "#FF0000";

	setInterval(function(){
		if(targetColor === "FF0000") targetColor = "#00FF00";
		else targetColor = "FF0000";
	},1000);

	setInterval(function (){
		gamepadTxt.textContent = "Pressed: "+getPressedBtns();
		scrollPos.textContent = "Scroll pos: " + window.scrollX + " " + window.scrollY;
		const zoom = (( window.outerWidth - 10 ) / window.innerWidth) * 100;
		zoomPos.textContent = "Zoom: " + window.outerWidth + " " +window.outerHeight + " " + zoom + "%";
		anim.style.backgroundColor = lerpColor(anim.style.backgroundColor,targetColor,0.01);
	});

	// Chart testing
	const chart = document.getElementById("chart");
	drawLineChart(chart,[
		{x: "value 1", y: 10},
		{x: "value 2", y: 50},
		{x: "value 3", y: 0},
		{x: "value 4", y: 20},
		{x: "value 5", y: -10}
	]);
	drawLineChart(chart,[
		{x: "value 1", y: -10},
		{x: "value 2", y: 20},
		{x: "value 3", y: 5},
		{x: "value 4", y: -20},
		{x: "value 5", y: 0}
	],"blue");

	// Canvas testing
	const canvas = document.getElementById("canv");
	const rect = new Rect2D(new Vector2(20,20),70,50);
	rect.outlineSize = 5;
	rect.outlineStyle = "red";

	var prevFrameTime = Date.now();

	const deltaTxt = document.getElementById("itv-time");
	const fpsTxt = document.getElementById("itv-fps");

	setInterval(function(){
		const delta = Date.now() - prevFrameTime;
		deltaTxt.textContent = "Current delta: " +  delta / 1000;
		fpsTxt.textContent = "FPS: " + (1000 / delta).toFixed(2);

		prevFrameTime = Date.now();

		clearCanvas(canvas);
		rect.rotation += 0.05 * delta;
		rect.render(canvas);
	});

	setInterval(function(){
		if(rect.fillStyle === "black"){
			rect.fillStyle = "";
		} else {
			rect.fillStyle = "black";
		}
	},1000);
}, false);

