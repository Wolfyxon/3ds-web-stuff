window.addEventListener("load", function() {
    const canvas = document.getElementById("canv");

    const plrY = 390;
    const plrH = 5;
    const plrW = 30;
    const plrButtonSpeed = 0.3;
    const player = Rect2D(Vector2(canvas.width/2 - plrW/2, plrY), plrW, plrH);
    player.fillStyle = "#8C7BFF";

    const ballSize = 4;
    const ballAccel = 1.06;
    const ballInitSpeed = 2;
    var ballSpeed = ballInitSpeed;
    const ball = Rect2D(Vector2(canvas.width/2 - ballSize/2,canvas.height/2 - ballSize/2),ballSize, ballSize);
    ball.fillStyle = "white";

    var blocks = [];

    function createBlocks(columns, rows) {
        blocks = [];
        const padding = 2;
        const spacing = 4;

        const totalSpacing = spacing * (columns - 1);
        const w = (canvas.width - totalSpacing) / columns - padding/2;
        const h = 8;

        for(var row=0; row < rows; row++) {
            for(var col=0; col < columns; col++) {
                const x = col * (w + spacing) + padding/2;
                const y = row * (h + spacing) + padding;

                const block = Rect2D(Vector2(x, y), w, h);
                block.fillStyle = "red";
                block.outlineSize = 1;
                block.outlineOpacity = 0.5;
                block.outlineStyle = block.fillStyle;

                blocks.push(block);
            }
        }
    }

    createBlocks(10,10);

    var prevFrameTime = Date.now();
    setInterval(function() {
        const delta = (Date.now() - prevFrameTime);
        prevFrameTime = Date.now();

        clearCanvas(canvas);

        player.render(canvas);
        ball.render(canvas);

        for(var i=0; i < blocks.length; i++) {
            const block = blocks[i];
            block.render(canvas);
        }

        if(isBtnPressed("left") && player.getX() > 0) player.area.offsetXY(-plrButtonSpeed * delta, 0)
        if(isBtnPressed("right") && (player.getX() + plrW ) < canvas.width) player.area.offsetXY(plrButtonSpeed * delta, 0)

    });
});