/**
 * Draws a line chart on a canvas
 * @param {HTMLCanvasElement} canvas Canvas to draw the chart on.
 * @param {Object} points Points of the chart at XY values. Example [ {x: "Monday", y: 10}, {x: "Tuesday", y: -2} ]
 * @param {String} [color=red] Line color.
 */
function drawLineChart(canvas, points, color) {
    color = color || "red";
    const ctx = canvas.getContext("2d");
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    // Ensure the canvas isn't stretched;
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);

    var minY = 0;
    var maxY = 0;

    const xSpacing = w/points.length;

    for(var i=0;i<points.length;i++){
        const point = points[i];

        if(point.y < minY) minY = point.y;
        if(point.y > maxY) maxY = point.y;
    }

    var prevX = 0;
    var prevY = 0;

    for(var i=0;i<points.length;i++){
        const point = points[i];
        const yFactor = (point.y - minY) / (maxY - minY);

        const x = xSpacing * i;
        const y = h - (yFactor * h);

        ctx.strokeStyle = color;
        ctx.fillStyle = color;

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

        ctx.strokeStyle = "";
        ctx.fillStyle = "";
    }

}
// I hate math, please end me
