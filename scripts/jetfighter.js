window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    const imgJet = document.getElementById("img-jet");

    const imgProjectile = document.getElementById("img-projectile");

    const plrJet = Sprite(imgJet,125,350);
    plrJet.restrictMovement = true;
    const speed = 5;

    setInterval(function(){
        clearCanvas(canvas);

        if(isBtnPressed("Up")) plrJet.moveXY(0,-speed);
        if(isBtnPressed("Down")) plrJet.moveXY(0,speed);
        if(isBtnPressed("Left")) plrJet.moveXY(-speed,0);
        if(isBtnPressed("Right")) plrJet.moveXY(speed,0);


        plrJet.render(canvas);
    },optiItv());
})