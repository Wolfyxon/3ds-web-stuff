window.addEventListener("load",function (){
    const canvas = document.getElementById("canv")
    const ctx = canvas.getContext("2d");

    const imgStanding = document.getElementById("img-standing")
    const imgRun1 = document.getElementById("img-run1")
    const imgRun2 = document.getElementById("img-run2")

    var currentSprite = imgStanding;

    var jumpyYoffset = 0;
    var jumpyRun1 = false;
    var active = false;

    // Sprite updating
    setInterval(function (){
        if(jumpyYoffset > 0) return;

        jumpyRun1 = !jumpyRun1;
        if(jumpyRun1) currentSprite = imgRun1;
        else currentSprite = imgRun2
    },100)

    // Main loop
    setInterval(function (){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(currentSprite,10,100+jumpyYoffset, 40,50)
    })
})