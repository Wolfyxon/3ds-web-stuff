window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    const imgJet = document.getElementById("img-jet");

    const imgHeli = document.getElementById("img-heli");
    const imgRotor = document.getElementById("img-rotor");

    const imgProjectile = document.getElementById("img-projectile");
    const imgRocket = document.getElementById("img-rocket");

    const healthBarNeg = document.getElementById("health-bar-neg");

    const plrJet = Sprite(imgJet,125,350);
    const maxPlrHp = 100;
    var plrHp = maxPlrHp;

    plrJet.restrictMovement = true;
    const speed = 5;
    const rotAngle = 20;
    const rotAmt = 0.2;

    const helicopters = []; // enemies

    const projectiles = [];

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
            rocket.rescale(1.3);
            rocket.enemy = true;
            projectiles.push(rocket)
            setTimeout(function(){
                rocket.remove = true;
            },2000)
        },randi(500,2500))

        heli.flyItv = setInterval(function(){
            const range = 320;
            heli.targetPos = Vector2(randi(0,range),randi(0,range));
        },1000)
    }

    function updateHpBar(){
         healthBarNeg.style.height = (maxPlrHp - plrHp)+"%";
    }

    function reset(){
        for(var i=0;i<helicopters.length;i++){
            helicopters[i].remove = true;
        }
        for(var i=0;i<projectiles.length;i++){
            projectiles[i].remove = true;
        }

        plrHp = maxPlrHp;
        updateHpBar();
    }

    setInterval(function(){
        if(helicopters.length < 3) addHelicopter(randi(0,320),-100)
    },3000)

    // Firing loop
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

    // Movement loop
    setInterval(function(){
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
    },optiItv());

    // Main loop
    setInterval(function(){
        clearCanvas(canvas);

        for(var i=0;i<projectiles.length;i++){
            const proj = projectiles[i];
            var sp = -speed*2;
            if(proj.enemy) sp *= 0.75;
            proj.moveLocalXY(0,sp);
            proj.render(canvas);

            if(proj.enemy && plrHp > 0 && proj.area.isTouching(plrJet.area)){
                plrHp -= 2;
                proj.remove = true;
                updateHpBar();
            }

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

            if(heli.hp <= 0 || heli.remove){
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
                    proj.remove = true;
                }
            }
        }

        plrJet.render(canvas);
    },optiItv());

    updateHpBar();
})