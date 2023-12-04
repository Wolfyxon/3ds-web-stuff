window.addEventListener("load",function (){
    const canvas = document.getElementById("canv")
    const ctx = canvas.getContext("2d");

    const imgStanding = document.getElementById("img-standing")
    const imgRun1 = document.getElementById("img-run1")
    const imgRun2 = document.getElementById("img-run2")
    const imgSpike = document.getElementById("img-spike")

    var currentSprite = imgStanding;

    var jumpPower = 0;
    var yOffset = 0;

    var jumpyRun1 = false;
    var active = true;

    function jump(){
        if(!active) return;
        if(jumpPower > 0) return;
        jumpPower = 130;
    }

    var spikes = [
        // x
    ]

    function addSpike(offset){
        if(!offset) offset = 0;
        spikes.push(400+offset)
    }

    // Sprite updating
    setInterval(function (){
        if(!active) return;
        if(jumpPower > 0) return;
        jumpyRun1 = !jumpyRun1;
        if(jumpyRun1) currentSprite = imgRun1;
        else currentSprite = imgRun2

    },100)

    var prevSpikeOffset = 0;
    setInterval(function (){
        addSpike()
    },2000)

    // Main loop
    setInterval(function (){

        if(jumpPower > 0){
            jumpPower -= 2;
        }
        yOffset = lerp(yOffset,-jumpPower,0.1)

        if(isBtnPressed("a") || isBtnPressed("up")) jump()

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var i=0;i<spikes.length;i++){
            const x = spikes[i]
            if(x < -10){
                spikes.splice(i, 1);
                i--;
            }
            spikes[i] -= 3;
            ctx.drawImage(imgSpike,i+x,100, 40,50)
        }
        ctx.drawImage(currentSprite,10,100+yOffset, 40,50)
    })
})