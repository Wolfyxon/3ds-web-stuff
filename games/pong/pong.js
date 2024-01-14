window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");

    const ball = Rect2D(Vector2(canvas.width/2.1,canvas.height/2.1),4,4);
    ball.fillStyle = "white";
    const originalBallSpeed = 2;
    var ballSpeed = originalBallSpeed;
    const ballAccel = 1.02;

    const y = canvas.height/2.5;

    const player = Rect2D(Vector2(10,y), 6,30);
    player.fillStyle = "white"
    const playerSpeed = 2;

    const enemy = player.copy();
    enemy.area.moveTo(Vector2(canvas.width-player.getX()*1.5, y));
    const originalEnemySpeed = 0.5;
    var enemySpeed = originalEnemySpeed;


    function reset(){
        enemy.area.moveTo(Vector2(enemy.getX(),y));
        player.area.moveTo(Vector2(player.getX(),y));
        ball.area.moveTo(Vector2(canvas.width/2.1,canvas.height/2.1));
        ball.rotation = 0;

        ballSpeed = originalBallSpeed;
        enemySpeed = originalEnemySpeed;
    }

    function bounce(pad){
        const cY = pad.getY() + pad.area.getHeight() / 2;
        const offsetFromCenter = ball.getY() - cY;
        const normalizedOffset = offsetFromCenter / (pad.area.getHeight() / 2);
        const bounceAngle = normalizedOffset * 45;
        ball.rotation = 180 - ball.rotation + 2 * bounceAngle;
        ballSpeed *= ballAccel;
    }


    setInterval(function(){
        clearCanvas(canvas);

        if(player.area.getTopLeft().y > 0 && isBtnPressed("up")){
            player.area.offsetXY(0,-playerSpeed)
        }
        if(player.area.getBottomLeft().y < canvas.height && isBtnPressed("down")){
            player.area.offsetXY(0,playerSpeed);
        }

        const enemyPos = enemy.area.getTopLeft();
        enemy.area.moveTo(
            enemy.area.startVec.getLerped(Vector2(enemyPos.x, ball.getY()-enemy.area.getHeight()/2),enemySpeed)
        );

        ball.moveLocalXY(ballSpeed,0);
        if(ball.area.isTouching(enemy.area)) bounce(enemy);
        if(ball.area.isTouching(player.area)) bounce(player);

        if(ball.getY() <= 0 || ball.getY() >= canvas.height){
            ball.rotation = -ball.rotation;
            ballSpeed *= ballAccel;
        }

        ball.render(canvas);
        player.render(canvas);
        enemy.render(canvas);

        const lineX = canvas.width/2.015
        drawDashedLine(canvas,Vector2(lineX,0), Vector2(lineX,canvas.height),4,6,"white");
    },optiItv());
});