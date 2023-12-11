window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    const imgWingUp = document.getElementById("img-pigeon1");
    const imgWingDown = document.getElementById("img-pigeon2")
    const imgPipe = document.getElementById("img-pipe")

    const startY = 110;

    const pigeon = Sprite(imgWingUp,10,startY);
    const hitbox = pigeon.area.copy();

    var alive = true;

    var passedPipes = 0;
    var highScore = 0;

    var yForce = 0;

    var pipes = []

    function addPipes(y){
        if(!y) y = -25;
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
        alive = false;
    }

    setInterval(function(){
        if(!alive) return;
        switchSprite()
    },200)

    setInterval(function(){
        if(!alive) return;
        addPipes(randi(-55,0));
    },2000)


    // Controls loop
    setInterval(function(){
        if(!alive) return;
        if(isBtnJustPressed("up") || isBtnJustPressed("a")){
            yForce = -1.5;
            pigeon.rotation = -20;
        }
    })

    // Main loop
    setInterval(function(){
        clearCanvas(canvas);

        if(yForce < 3 && pigeon.getY() < 120){
            yForce += 0.1;
            pigeon.rotation += 1
        }
        if(!alive) pigeon.rotation += 3;

        if(pigeon.getY() > 135 || pigeon.getY() < -20) die()

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
            if(pipe.getX() <= -30){
                pipes.splice(i, 1);
                i--;
            }
            pipe.render(canvas);
        }
        pigeon.render(canvas);
    },optiItv())
})