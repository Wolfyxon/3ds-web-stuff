window.addEventListener("load",function (){
    const canvas = document.getElementById("canv")
    const ctx = canvas.getContext("2d");

    const imgStanding = document.getElementById("img-standing")
    const imgRun1 = document.getElementById("img-run1")
    const imgRun2 = document.getElementById("img-run2")

    var currentSprite = imgStanding;

    var jumpPower = 0;
    var yOffset = 0;

    var jumpyRun1 = false;
    var active = true;

    function jump(){
        if(jumpPower > 0) return;
        jumpPower = 100;
    }

    // Sprite updating
    setInterval(function (){
        if(!active) return;
        if(jumpPower > 0) return;
        jumpyRun1 = !jumpyRun1;
        if(jumpyRun1) currentSprite = imgRun1;
        else currentSprite = imgRun2

    },100)

    // Main loop
    setInterval(function (){

        if(jumpPower > 0){
            jumpPower -= 1;
        }
        yOffset = lerp(yOffset,-jumpPower,0.1)

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(currentSprite,10,100+yOffset, 40,50)
    })
})