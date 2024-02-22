window.addEventListener("load", function() {
    const canvas = document.getElementById("canv");

    const plrY = 390;
    const plrH = 5;
    const plrW = 30;
    const plrButtonSpeed = 0.3;
    const player = Rect2D(Vector2(canvas.width/2 - plrW/2, plrY), plrW, plrH);
    player.fillStyle = "#8C7BFF";

    const ballSize = 4;
    const ballAccel = 1.02;
    const ballInitSpeed = 0.5;
    var ballSpeed = ballInitSpeed;
    const ball = Rect2D(Vector2(canvas.width/2 - ballSize/2,canvas.height/2 - ballSize/2),ballSize, ballSize);
    const initBallPos = ball.area.startVec.copy();
    ball.rotation = 180;
    ball.fillStyle = "white";

    var blocks = [];

    const rowColors = [
        "red",
        "orange",
        "yellow",
        "lime",
        "cyan",
        "blue",
        "purple",
        "magenta"
    ]

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
                block.fillStyle = rowColors[row % rowColors.length];
                block.outlineSize = 1;
                block.outlineOpacity = 0.5;
                block.outlineStyle = block.fillStyle;

                blocks.push(block);
            }
        }
    }

    function resetBall(){
        ball.area.moveTo(initBallPos);
        ballSpeed = ballInitSpeed;
        ball.rotation = 180;
    }

    function bounce(rect){
        const cY = rect.getY() + rect.area.getHeight() / 2;
        const offsetFromCenter = ball.getY() - cY;
        const normalizedOffset = offsetFromCenter / (rect.area.getHeight() / 2);
        const bounceAngle = normalizedOffset * 45;
        ball.rotation = -180 - ball.rotation + 2 * bounceAngle;
        ballSpeed *= ballAccel;
        ball.moveLocalXY(0,-ball.area.getHeight());
    }

    createBlocks(10,10);

    var prevFrameTime = Date.now();
    setInterval(function() {
        const delta = (Date.now() - prevFrameTime);
        prevFrameTime = Date.now();

        clearCanvas(canvas);

        player.render(canvas);
        ball.render(canvas);

        ball.moveLocalXY(0, -ballSpeed);

        if(ball.getY() <= 0 || ball.getX() <= 0 || ball.getX() >= canvas.width) {
            ball.rotation = -ball.rotation;
            ballSpeed *= ballAccel;
        }

        if(ball.area.isTouching(player.area)) bounce(player);

        for(var i=0; i < blocks.length; i++) {
            const block = blocks[i];

            if(ball.area.isTouching(block.area)) {
                bounce(block);
                blocks.splice(i,1);
                i--;
            }

            block.render(canvas);
        }

        if(isBtnPressed("left") && player.getX() > 0) player.area.offsetXY(-plrButtonSpeed * delta, 0)
        if(isBtnPressed("right") && (player.getX() + plrW ) < canvas.width) player.area.offsetXY(plrButtonSpeed * delta, 0)

    });
});