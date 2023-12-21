window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    const imgJet = document.getElementById("img-jet");

    const imgHeli = document.getElementById("img-heli");
    const imgRotor = document.getElementById("img-rotor");

    const imgProjectile = document.getElementById("img-projectile");

    const plrJet = Sprite(imgJet,125,350);
    plrJet.restrictMovement = true;
    const speed = 5;
    const rotAngle = 20;
    const rotAmt = 0.2;

    const helicopters = []; // enemies

    const projectiles = [];
    const rockets = [];

    function addHelicopter(x,y){
        const heli = Sprite(imgHeli,x,y,180);
        heli.rotor = Sprite(imgRotor, x-20, y+10);
        helicopters.push(heli);
    }

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
            proj.rotation = plrJet.rotation;
            projectiles.push(proj);
        }
    },100)

    setInterval(function(){
        clearCanvas(canvas);

        if(isBtnPressed("Up")) plrJet.moveXY(0,-speed);
        if(isBtnPressed("Down")) plrJet.moveXY(0,speed);
        if(isBtnPressed("Left")) {
            plrJet.rotation = lerp(plrJet.rotation,-rotAngle,rotAmt);
            plrJet.moveXY(-speed, 0);
        }
        if(isBtnPressed("Right")){
            plrJet.rotation = lerp(plrJet.rotation,rotAngle,rotAmt);
            plrJet.moveXY(speed,0);
        }
        plrJet.rotation = lerp(plrJet.rotation,0,rotAmt);

        for(var i=0;i<projectiles.length;i++){
            const proj = projectiles[i];
            proj.moveLocalXY(0,-speed*2);
            proj.render(canvas);

            if(proj.remove){
                projectiles.splice(i, 1);
                i--;
            }
        }

        plrJet.render(canvas);
    },optiItv());
})