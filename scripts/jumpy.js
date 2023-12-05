window.addEventListener("load",function (){
    const canvas = document.getElementById("canv")
    const ctx = canvas.getContext("2d");

    const imgStanding = document.getElementById("img-standing")
    const imgDead = document.getElementById("img-dead")
    const imgRun1 = document.getElementById("img-run1")
    const imgRun2 = document.getElementById("img-run2")
    const imgSpike = document.getElementById("img-spike")

    var currentSprite = imgStanding;

    const spikeHeight = 50;
    const spikeWidth = 40;

    const jumpyHeight = 50;
    const jumpyWidth = 40;

    var jumpPower = 0;
    var yOffset = 0;

    var jumpyRun1 = false;
    var active = false;

    function jump(){
        if(!active) return;
        if(jumpPower > 0) return;
        jumpPower = 130;
    }

    function reset(){
        spikes = [];
        currentSprite = imgRun1;
        active = true;
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
        if(!active) return;
        addSpike()
    },2000)

    // Main loop
    setInterval(function (){
        if(jumpPower > 0){
            jumpPower -= 2;
        }
        yOffset = lerp(yOffset,-jumpPower,0.1)

        if(isBtnPressed("a") || isBtnPressed("up")){
            if(!active) reset()
            jump()
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var i=0;i<spikes.length;i++){
            const x = spikes[i]
            if(x < -10){
                spikes.splice(i, 1);
                i--;
            }
            if(active){
                if(x < jumpyWidth && -yOffset<jumpyHeight){
                    currentSprite = imgDead
                    active = false;
                }

                spikes[i] -= 3
            };
            ctx.drawImage(imgSpike,x,100, spikeWidth, spikeHeight)
        }
        ctx.drawImage(currentSprite,10,100+yOffset, jumpyWidth, jumpyHeight)

    })
})