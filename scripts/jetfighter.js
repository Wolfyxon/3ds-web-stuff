window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    const imgJet = document.getElementById("img-jet");

    const imgProjectile = document.getElementById("img-projectile");

    const plrJet = Sprite(imgJet,125,350);
    plrJet.restrictMovement = true;
    const speed = 5;

    const projectiles = [];

    setInterval(function(){
        if(isBtnPressed("A")){
            const proj = Sprite(
                imgProjectile,
                plrJet.getX()+plrJet.area.getWidth()/2-2,
                plrJet.getY()
            );
            setTimeout(function(){
                proj.remove = true;
            },2000)
            projectiles.push(proj);
        }
    },100)

    setInterval(function(){
        clearCanvas(canvas);

        if(isBtnPressed("Up")) plrJet.moveXY(0,-speed);
        if(isBtnPressed("Down")) plrJet.moveXY(0,speed);
        if(isBtnPressed("Left")) plrJet.moveXY(-speed,0);
        if(isBtnPressed("Right")) plrJet.moveXY(speed,0);

        for(var i=0;i<projectiles.length;i++){
            const proj = projectiles[i];
            proj.moveXY(0,-speed*2);
            proj.render(canvas);

            if(proj.remove){
                projectiles.splice(i, 1);
                i--;
            }
        }

        plrJet.render(canvas);
    },optiItv());
})