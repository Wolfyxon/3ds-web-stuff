window.addEventListener("load",function (){
    const canvas = document.getElementById("canv")
    const ctx = canvas.getContext("2d");

    const gameoverTxt = document.getElementById("gameover")
    const timeText = document.getElementById("time")
    const highScoreText = document.getElementById("high-score")


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

    const defaultSpeed = 3;
    var speed = defaultSpeed;
    var gravity = 2.4;
    var jumpPower = 0;
    var yOffset = 0;

    var jumpyRun1 = false;
    var active = false;
    var resetCooldown = false;

    function jump(){
        if(!active) return;
        if(jumpPower > 0) return;
        if(!isOnGround()) return;
        jumpPower = 130;
    }

    function reset(){
        time = 0;
        speed = defaultSpeed;
        gameoverTxt.innerText = ""
        spikes = [];
        currentSprite = imgRun1;
        active = true;
    }

    var spikes = [
        // x
    ]

    function addSpike(offset){
        if(!offset) offset = 0;
        var thisX = 400+offset;
        const spacing = 200;
        if (spikes.length > 0) {
            const x = spikes[spikes.length - 1];
            if (thisX - x < spacing) {
                thisX = x + spacing;
            }
        }
        spikes.push(thisX)
    }

    function isOnGround(){
        return yOffset > -1;
    }

    var time = 0;
    var highScore = 0;

    setInterval(function (){
        if(!active) return;
        time += 1;
        if(time > highScore) highScore = time;

        const timeValTxt = new Date(time * 1000).toISOString().slice(11,19);
        const highTimeValTxt = new Date(highScore * 1000).toISOString().slice(11,19);

        timeText.innerText = "Time: "  + timeValTxt;
        highScoreText.innerText = "High score: " + highTimeValTxt;

    },1000)

    // Sprite updating
    setInterval(function (){
        if(!active) return;
        if(jumpPower > 0) return;
        jumpyRun1 = !jumpyRun1;
        if(jumpyRun1) currentSprite = imgRun1;
        else currentSprite = imgRun2

    },100)

    setInterval(function (){
        if(!active) return;
        const offset = randi(-20,200)
        for(var i=0;i<randi(1,2);i++){
            addSpike(offset*i)
        }
        speed += 0.1
    },2000)

    const hitboxMultiplier = 0.9

    // Main loop
    setInterval(function (){
        if(jumpPower > 0){
            jumpPower -= gravity;
        }
        yOffset = lerp(yOffset,-jumpPower,0.3)
        if(yOffset > 0) yOffset = 0;

        if(isBtnPressed("a") || isBtnPressed("up")){
            if(resetCooldown) return;
            if(!active) reset()
            jump()
        }
        if(isBtnPressed("down")){
            gravity = 30;
        } else {
            gravity = 2.4;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var i=0;i<spikes.length;i++){
            const x = spikes[i]
            if(x < -30){
                spikes.splice(i, 1);
                i--;
            }
            if(active){
                if(x < jumpyWidth*hitboxMultiplier && -yOffset<jumpyHeight*hitboxMultiplier){
                    currentSprite = imgDead
                    active = false;
                    resetCooldown = true;
                    gameoverTxt.innerText = "GAME OVER"
                    setTimeout(function (){
                        resetCooldown = false;
                    },200)
                }

                spikes[i] -= speed
            };
            ctx.drawImage(imgSpike,x,100, spikeWidth, spikeHeight)
        }
        ctx.drawImage(currentSprite,10,100+yOffset, jumpyWidth, jumpyHeight)

    })
})