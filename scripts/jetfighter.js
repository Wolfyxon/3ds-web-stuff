window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    const imgJet = document.getElementById("img-jet");

    const imgHeli = document.getElementById("img-heli");
    const imgRotor = document.getElementById("img-rotor");

    const imgProjectile = document.getElementById("img-projectile");
    const imgRocket = document.getElementById("img-rocket");

    const plrJet = Sprite(imgJet,125,350);
    plrJet.restrictMovement = true;
    const speed = 5;
    const rotAngle = 20;
    const rotAmt = 0.2;

    const helicopters = []; // enemies

    const projectiles = [];
    const rockets = [];

    function addHelicopter(x,y){
        const scale = 0.8;
        const heli = Sprite(imgHeli,x,y,180);
        heli.targetPos = Vector2(x,y);
        heli.hp = 10;
        heli.rotor = Sprite(imgRotor);
        heli.rotor.rescale(scale)
        heli.rescale(scale);
        helicopters.push(heli);

        heli.fireItv = setInterval(function(){
            const pos = heli.getCenter();
            const rocket = Sprite(imgRocket,pos.x,pos.y,heli.rotation);
            rocket.enemy = true;
            projectiles.push(rocket)
        },randi(300,2000))

        heli.flyItv = setInterval(function(){
            const range = 320;
            heli.targetPos = Vector2(randi(0,range),randi(0,range));
        },1000)
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
addHelicopter(100,10)
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

        for(var i=0;i<helicopters.length;i++){
            const heli = helicopters[i];
            const rotor = heli.rotor;
            rotor.rotation += 10;

            heli.render(canvas);
            rotor.area.moveTo(heli.getCenter().offsetXY(-40,-33))
            rotor.render(canvas);
            const ang = heli.getCenter().getRotationToVec(plrJet.getCenter())+90;
            heli.rotation = lerpAngle(heli.rotation,ang, 0.2);
            heli.area.moveTo(heli.area.startVec.getLerped(heli.targetPos,0.01))

            if(heli.hp <= 0){
                clearInterval(heli.fireItv);
                helicopters.splice(i,1);
                i--;
                continue;
            }

            for(var ii=0;ii<projectiles.length;ii++){
                const proj = projectiles[ii];
                if(proj.enemy) continue;
                if(proj.area.isTouching(heli.area)){
                    heli.hp -= 1;
                    heli.rotation += randi(-5,5)
                    projectiles.splice(ii, 1);
                    ii--;
                }
            }
        }

        plrJet.render(canvas);
    },optiItv());
})