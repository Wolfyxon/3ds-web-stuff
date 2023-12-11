window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    const imgWingUp = document.getElementById("img-pigeon1");
    const imgWingDown = document.getElementById("img-pigeon2")
    const imgPipe = document.getElementById("img-pipe")

    const startY = 110;

    const pigeon = Sprite(imgWingUp,10,startY);

    var alive = false;

    var passedPipes = 0;
    var highScore = 0;

    var pipes = []

    const gap = 242;
    function addPipes(y){
        if(!y) y = -120;
        const startX = 200
        pipes.push(Sprite(imgPipe,startX,y,180));
        pipes.push(Sprite(imgPipe,startX,y+gap));
    }

    function switchSprite(){
        if(pigeon.image === imgWingUp) pigeon.image = imgWingDown;
        else pigeon.image = imgWingUp;
    }

    setInterval(switchSprite,200)

    // Main loop
    setInterval(function(){
        clearCanvas(canvas);
        pigeon.render(canvas);
    })
})