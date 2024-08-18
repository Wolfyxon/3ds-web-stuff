depend("canvasGame");

// TODO: After elementGame is complete, migrate

window.addEventListener("load", function() {
    const canvas = document.getElementById("canv");

    const hearts = document.getElementById("lives").children;
    var lives = hearts.length;

    const overlay = document.getElementById("overlay");
    const overlayTitle = document.getElementById("title");
    const overlayGameover = document.getElementById("gameover");

    overlay.targetOpaticy = 1;

    const plrY = 370;
    const plrH = 5;
    const plrW = 30;
    const plrInitPos = new Vector2(canvas.width/2 - plrW/2, plrY);
    const plrButtonSpeed = 0.3;
    const player = new Rect2D(plrInitPos.copy(), plrW, plrH);
    player.fillStyle = "#8C7BFF";

    const ballSize = 4;
    const ballAccel = 1.02;
    const ballInitSpeed = 0.15;
    const ballMaxSpeed = 0.5;
    var ballSpeed = ballInitSpeed;
    const ball = new Rect2D(new Vector2(canvas.width/2 - ballSize/2,canvas.height/2 - 100 - ballSize/2),ballSize, ballSize);
    const initBallPos = ball.area.startVec.copy();
    ball.fillStyle = "white";
    resetBall();

    var active = false;

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
        const padding = 5;
        const spacing = 4;

        const totalSpacing = spacing * (columns - 1);
        const w = clamp((canvas.width - totalSpacing) / columns - padding/2, 0, 60);
        const h = 8;

        for(var row=0; row < rows; row++) {
            for(var col=0; col < columns; col++) {
                const x = (canvas.width - (columns * (w + spacing) - spacing)) / 2 + col * (w + spacing);
                const y = row * (h + spacing) + padding + 10;

                const block = new Rect2D(new Vector2(x, y), w, h);
                block.fillStyle = rowColors[row % rowColors.length];
                block.outlineSize = 1;
                block.outlineOpacity = 0.5;
                block.outlineStyle = block.fillStyle;

                blocks.push(block);
            }
        }
    }

    function showOverlay() { overlay.targetOpaticy = 1; }
    function hideOverlay() { overlay.targetOpaticy = 0; }


    function updateHearts() {
        for(var i=0; i<hearts.length; i++) {
            const heart = hearts[hearts.length - 1 - i];
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
        var offset = randf(5,20);
        if(randi(0,1) === 1) offset *= -1;
        ball.rotation = 180 + offset;
    }

    var lastBounce = 0;
    const bounceCooldown = 100;

    function preBounce(){
        const now = Date.now();
        if(now < lastBounce+bounceCooldown) return false;
        lastBounce = now;
        return true;
    }

    function bounce(){
        if(!preBounce()) return;

        if(ball.rotation === 0) ball.rotation += 1;
        ball.rotation = 180 - ball.rotation;
        ball.moveLocalXY(0, -ball.area.getHeight());

        if(active) {
            ballSpeed *= ballAccel;
            ballSpeed = clamp(ballSpeed, 0, ballMaxSpeed);
        }
    }

    function setUserX(x) {
        player.area.moveTo(new Vector2(x - player.area.getWidth() / 2, plrY));
    }

    function touchMove(e){
        if(!active) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const touch = e.touches[0];
        const x = (touch.clientX - rect.left) * scaleX;

        e.preventDefault();
        setUserX(x);
    }

    function mouseMove(e){
        if(!active) return;
        if(e.buttons === 0) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const x = (e.clientX - rect.left) * scaleX;

       setUserX(x);
    }

    function start() {
        if(!active) {
            lives = hearts.length;
            updateHearts();
            hideOverlay();
            resetBall();
            player.area.moveTo(plrInitPos.copy());
            active = true;
        }
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

        if( (bY <= 0 || bX <= 0 || bX >= canvas.width) && preBounce()) {
            if(bY <= 0) {
                ball.rotation = 180 - ball.rotation;
            } else {
                ball.rotation = -ball.rotation;
            }
            if(active) {
                ballSpeed *= ballAccel;
                ballSpeed = clamp(ballSpeed, 0, ballMaxSpeed);
            }
        }

        if(bY >= canvas.height) {
            if(active) {
                lives -= 1;
                updateHearts();

                if(lives <= 0) {
                    active = false;
                    showOverlay();
                    overlayTitle.style.display = "none";
                    overlayGameover.style.display = "";
                } else {
                    resetBall();
                }

            } else {
                ball.rotation = 180 -  ball.rotation;
            }
        }

        if(bY > 100) {
            if(ball.area.isTouching(player.area) || ball.area.isInTheWay(player.area, new Vector2(0, currentSpeed), ball.rotation, 6)) {
                bounce();
            }
        }

        for(var i=0; i < blocks.length; i++) {
            const block = blocks[i];

            if(bY < 100 && ball.area.isTouching(block.area)) {
                bounce();
                if(active) {
                    blocks.splice(i,1);
                    i--;
                }
            }

            block.render(canvas);
        }


        overlay.style.opacity = lerp(overlay.style.opacity, overlay.targetOpaticy, 0.01 * delta);

        if(active) {
            if(isBtnPressed("left") && player.getX() > 0) player.area.offsetXY(-plrButtonSpeed * delta, 0)
            if(isBtnPressed("right") && (player.getX() + plrW ) < canvas.width) player.area.offsetXY(plrButtonSpeed * delta, 0)
        } else {
            player.area.moveTo(new Vector2(ball.getCenter().x - plrW/2, plrY));
        }

    });

    onBtnJustPressed("a", start);
    document.getElementById("btn-start").addEventListener("click", start);

    window.addEventListener("touchmove", touchMove);
    window.addEventListener("touchstart", touchMove);
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mousedown", mouseMove);
});