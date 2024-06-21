libName("chart");

/**
 * Draws a line chart on a canvas
 * @param {HTMLCanvasElement} canvas Canvas to draw the chart on.
 * @param {Object} points Points of the chart at XY values. Example [ {x: "Monday", y: 10}, {x: "Tuesday", y: -2} ]
 * @param {String} [color=red] Line color.
 */
function drawLineChart(canvas, points, color) {
	color = color || "red";
	const ctx = canvas.getContext("2d"),
		w = canvas.clientWidth,
		h = canvas.clientHeight;

	// Ensure the canvas isn't stretched;
	if(canvas.width !== w || canvas.height !== h){
		canvas.width =  w;
		canvas.height = h;
	}

	var minY = 0,
		maxY = 0;

	const xSpacing = w/points.length;

	for(var i=0;i<points.length;i++){
		const point = points[i];

		if(point.y < minY) minY = point.y;
		if(point.y > maxY) maxY = point.y;
	}

	var prevX = 0;
	var prevY = 0;

	ctx.strokeStyle = color;
	ctx.fillStyle = color;

	for(var i=0;i<points.length;i++){
		const point = points[i],
			yFactor = (point.y - minY) / (maxY - minY),

			x = xSpacing * i,
			y = h - (yFactor * h);

		ctx.beginPath();
		ctx.arc(x, y, 2, 0, 2 * Math.PI);
		ctx.fill();

		ctx.save();
		ctx.beginPath();
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.restore();

		prevX = x;
		prevY = y;
	}

	ctx.strokeStyle = "";
	ctx.fillStyle = "";
}
// I hate math, please end me
