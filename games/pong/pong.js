window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");

    const ball = Rect2D(Vector2(canvas.width/2.1,canvas.height/2.1),4,4);
    ball.fillStyle = "white";
    const originalBallSpeed = 2;
    var ballSpeed = originalBallSpeed;

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

    }

    function bounceFromPad(pad){
        const area = pad.area;
        ball.rotation += 180 + randf(-10,10);
    }

    setInterval(function(){
        clearCanvas(canvas);

        if(player.area.getTopLeft().y > 0 && isBtnPressed("up")){
            player.area.offsetXY(0,-playerSpeed)
        }
        if(player.area.getBottomLeft().y < canvas.height && isBtnPressed("down")){
            player.area.offsetXY(0,playerSpeed);
        }

        ball.moveLocalXY(ballSpeed,0);
        if(ball.area.isTouching(enemy.area)) bounceFromPad(enemy);
        if(ball.area.isTouching(player.area)) bounceFromPad(player);

        ball.render(canvas);
        player.render(canvas);
        enemy.render(canvas);
    },optiItv());
});