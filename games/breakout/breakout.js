window.addEventListener("load", function() {
    const canvas = document.getElementById("canv");

    const hearts = document.getElementById("lives").children;
    var lives = hearts.length;

    const plrY = 390;
    const plrH = 5;
    const plrW = 30;
    const plrButtonSpeed = 0.3;
    const player = Rect2D(Vector2(canvas.width/2 - plrW/2, plrY), plrW, plrH);
    player.fillStyle = "#8C7BFF";

    const ballSize = 4;
    const ballAccel = 1.02;
    const ballInitSpeed = 0.15;
    const ballMaxSped = 1;
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
                const x = (canvas.width - (columns * (w + spacing) - spacing)) / 2 + col * (w + spacing);
                const y = row * (h + spacing) + padding + 10;

                const block = Rect2D(Vector2(x, y), w, h);
                block.fillStyle = rowColors[row % rowColors.length];
                block.outlineSize = 1;
                block.outlineOpacity = 0.5;
                block.outlineStyle = block.fillStyle;

                blocks.push(block);
            }
        }
    }

    function updateHearts() {
        for(var i=0; i<hearts.length; i++) {
            const heart = hearts[i];
            if(i >= lives) {
                heart.src = "img/noLife.png";
            } else {
                heart.src = "img/life.png";
            }
        }
    }
    updateHearts()

    function resetBall(){
        ball.area.moveTo(initBallPos.copy());
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
        ballSpeed = clamp(ballSpeed, 0, ballMaxSped);
        ball.moveLocalXY(0,-ball.area.getHeight() * 1.5);
    }

    createBlocks(8,5);

    var prevFrameTime = Date.now();
    setInterval(function() {
        const delta = (Date.now() - prevFrameTime);
        prevFrameTime = Date.now();

        clearCanvas(canvas);

        player.render(canvas);
        ball.render(canvas);

        const currentSpeed = -ballSpeed * delta;
        ball.moveLocalXY(0, currentSpeed);

        const bY = ball.getY();
        const bX = ball.getX();

        if(bY <= 0 || bX <= 0 || bX >= canvas.width) {
            if(bY <= 0) {
                // The ball refuses to properly bounce from the top the screen and starts glitching outside the screen
                ball.rotation += 180; // Temporary fix!
                // TODO: Find a universal calculation
            } else {
                ball.rotation = -ball.rotation;
            }
            ballSpeed *= ballAccel;
            ballSpeed = clamp(ballSpeed, 0, ballMaxSped);
        }

        if(bY >= canvas.height) {
            resetBall();
        }

        if(ball.area.isTouching(player.area) || ball.area.isInTheWay(player.area, Vector2(0, currentSpeed), ball.rotation, 6)) bounce(player);

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