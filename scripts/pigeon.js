window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    const imgWingUp = document.getElementById("img-pigeon1");
    const imgWingDown = document.getElementById("img-pigeon2")
    const imgPipe = document.getElementById("img-pipe")

    const txtPipes = document.getElementById("txt-pipes");
    const txtHighScore = document.getElementById("txt-high-score");
    const gameover = document.getElementById("gameover");
    gameover.style.visibility = "hidden";

    const startY = 70;

    const moon = Sprite(document.getElementById("img-moon"),230,10);

    const pigeon = Sprite(imgWingUp,10,startY);
    const hitbox = pigeon.area.copy();

    var started = false;
    var alive = true;
    var resetCooldown = false;

    var passedPipes = 0;
    var highScore = 0;

    var yForce = 0;

    var pipes = []

    function addPipes(y){
        if(!y) y = -40;
        const gap = 152;
        const startX = 300
        const scale = 0.5;
        pipes.push(Sprite(imgPipe,startX,y,180).rescale(scale));
        pipes.push(Sprite(imgPipe,startX,y+gap).rescale(scale));
    }

    function switchSprite(){
        if(pigeon.image === imgWingUp) pigeon.image = imgWingDown;
        else pigeon.image = imgWingUp;
    }

    function die(){
        if(!alive) return;
        resetCooldown = true;
        alive = false;
        gameover.style.visibility = "";
        setTimeout(function(){
            resetCooldown = false;
        },200)
    }

    function reset(){
        alive = true;
        passedPipes = 0;
        txtPipes.innerText = passedPipes;
        pipes = [];
        gameover.style.visibility = "hidden";
        pigeon.rotation = 0;
        pigeon.area.moveTo(Vector2(pigeon.getX(),startY));
        txtHighScore.style.color = ""
    }

    function jump(){
        if(!started){
            document.getElementById("prestart").style.visibility = "hidden";
            started = true;
        }
        if(!alive && !resetCooldown){
            reset();
        }
        if(alive){
            yForce = -1.5;
            pigeon.rotation = -20;
        }
    }

    setInterval(function(){
        if(!alive) return;
        switchSprite()
    },200)

    setInterval(function(){
        if(!alive || !started) return;
        addPipes(randi(-100,-50));
    },2000)


    // Controls loop
    setInterval(function(){
        if(isBtnJustPressed("up") || isBtnJustPressed("a")){
            jump()
        }
    })

    // Main loop
    var bgPos = 0;
    setInterval(function(){
        if(alive){
            bgPos -= 0.5;
            canvas.style.backgroundPositionX = bgPos+"px";
        }

        clearCanvas(canvas);

        moon.render(canvas);

        if(yForce < 3 && pigeon.getY() < 120 && started){
            yForce += 0.1;
            pigeon.rotation += 1
        }
        if(!alive) pigeon.rotation += 3;

        if(pigeon.getY() > 150 || pigeon.getY() < -40) die()

        pigeon.moveXY(0,yForce);
        hitbox.startVec = pigeon.area.startVec.copy();
        hitbox.endVec = pigeon.area.startVec.copy().offsetXY(30,20);

        for(var i=0;i<pipes.length;i++){
            const pipe = pipes[i];
            if(alive){
                pipe.moveXY(-0.8,0);
                if(pipe.area.isTouching(hitbox)){
                    die();
                }
            }
            if(pipe.getX() <= 10 && !pipe.passed){
                pipe.passed = true;
                 passedPipes += 0.5;
                 txtPipes.innerText = passedPipes;
                 if(passedPipes > highScore){
                     highScore = passedPipes;
                     txtHighScore.innerText = passedPipes;
                     txtHighScore.style.color = "lime"
                 }
            }
            if(pipe.getX() <= -30){
                pipes.splice(i, 1);
                i--;
            }
            pipe.render(canvas);
        }
        pigeon.render(canvas);
    },optiItv())

    window.addEventListener("click",jump);
})