window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    const imgWingUp = document.getElementById("img-pigeon1");
    const imgWingDown = document.getElementById("img-pigeon2")

    const startY = 110;

    const pigeon = Sprite(imgWingUp,10,startY);

    var alive = false;

    var passedPipes = 0;
    var highScore = 0;

    var pipes = []

    function addPipes(y){

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