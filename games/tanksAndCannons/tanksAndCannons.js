depend("canvasGame");

window.addEventListener("load",function(){
	const canvas = document.getElementById("canv"),
		ctx = canvas.getContext("2d"),

		imgTank1Base = document.getElementById("img-tank1-base"),
		imgTank1Cannon = document.getElementById("img-tank1-cannon"),

		columns = 9,
		rows = 5,
		cellSize = 25,
		cellSpacing = 1.2,

		rotSpeed = 2;

	var tanks = [],
		cannons = [];

	for(var i=0;i<columns*rows;i++){
		cannons.push(null);
	}

	function addTank(){
		const base = new CanvasSprite(imgTank1Base),
			cannon = new CanvasSprite(imgTank1Cannon),

			scale = 0.6;

		base.rescale(scale);
		cannon.rescale(scale);

		tanks.push({
			base: base,
			cannon: cannon
		});
	}

	function addCannon(cellIdx){
		cannons[cellIdx] = new CanvasSprite(imgTank1Cannon);
	}

	addCannon(0);
	addCannon(1);
	addCannon(2);

	addTank();

	setInterval(function(){
		// TODO: use delta time
		clearCanvas(canvas);

		for(var a=0;a<tanks.length;a++){
			const tank = tanks[a];
			tank.base.render(canvas);
			tank.cannon.render(canvas);
		}

		for(var i=0;i<cannons.length;i++){
			const colIdx = i % columns,
				rowIdx = Math.floor(i / columns);

			var x = (colIdx * cellSize*cellSpacing) + 18,
				y = (rowIdx * cellSize*cellSpacing) + 150;

			ctx.fillRect(x,y,cellSize,cellSize);

			const cannon = cannons[i];
			if(cannon){
				if(isBtnPressed("left")) cannon.rotation -= rotSpeed;
				if(isBtnPressed("right")) cannon.rotation += rotSpeed;

				cannon.area.moveTo(new Vector2(x-cellSize/4,y-cellSize/1.5));
				cannon.render(canvas);
			}
		}

	});
}, false);