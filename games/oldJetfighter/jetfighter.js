depend("canvasGame");

window.addEventListener('load',function(){
    const canvas = document.getElementById('canv');

    const imgJet = document.getElementById('img-jet');

    const imgHeli = document.getElementById('img-heli');
    const imgRotor = document.getElementById('img-rotor');

    const imgProjectile = document.getElementById('img-projectile');
    const imgRocket = document.getElementById('img-rocket');

    const healthBarNeg = document.getElementById('health-bar-neg');

    const overlay = document.getElementById('overlay');
    const gameover = document.getElementById('gameover');
    const btnRestart = document.getElementById('btn-restart');
    const killsTxt = document.getElementById('kills-amount');

    const initX = 135;
    const initY = 350;

    const plrJet = new CanvasSprite(imgJet,initX,initY);
    const maxPlrHp = 100;
    var plrHp = maxPlrHp;
    var alive = true;

    plrJet.restrictMovement = true;
    const speed = 5;
    const rotAngle = 20;
    const rotAmt = 0.2;

    var kills = 0;

    const helicopters = []; // enemies

    const projectiles = [];

    function updateKills(){
        killsTxt.innerText = kills;
    }

    function addHelicopter(x,y){
        const scale = 0.8;
        const heli = new CanvasSprite(imgHeli,x,y,180);
        heli.targetPos = new Vector2(x,y);
        heli.hp = 10;
        heli.rotor = new CanvasSprite(imgRotor);
        heli.rotor.rescale(scale)
        heli.rescale(scale);
        helicopters.push(heli);

        heli.fireItv = setInterval(function(){
            if(!alive) return;
            const pos = heli.getCenter();
            const rocket = new CanvasSprite(imgRocket,pos.x,pos.y,heli.rotation);
            rocket.rescale(1.3);
            rocket.enemy = true;
            projectiles.push(rocket)
            setTimeout(function(){
                rocket.remove = true;
            },2000)
        },randi(500,2500))

        heli.flyItv = setInterval(function(){
            if(!alive) return;
            const range = 320;
            heli.targetPos = new Vector2(randi(0,range),randi(0,range));
        },1000)
    }

    function updateHpBar(){
         healthBarNeg.style.height = (maxPlrHp - plrHp)+'%';
    }

    function reset(){
        for(var i=0;i<helicopters.length;i++){
            helicopters[i].remove = true;
        }
        for(var i=0;i<projectiles.length;i++){
            projectiles[i].remove = true;
        }

        plrJet.area.moveTo(new Vector2(initX,initY));
        plrHp = maxPlrHp;
        updateHpBar();

        kills = 0;
        updateKills();

        alive = true;
        gameover.style.display = 'none';
        overlay.style.opacity = '0';
        canvas.style.webkitAnimationPlayState='running';
        canvas.style.animationPlayState='running';
    }

    function die(){
        alive = false;
        gameover.style.display = '';
        canvas.style.webkitAnimationPlayState='paused';
        canvas.style.animationPlayState='paused';
    }

    setInterval(function(){
        if(!alive) return;
        if(helicopters.length < 3) addHelicopter(randi(0,320),-100)
    },3000)


    onBtnJustPressed('A',function(){
        if(!alive) reset();
    });

    // Firing loop
    setInterval(function(){
        if(!alive) return;
        if(isBtnPressed('A')){
            const proj = new CanvasSprite(
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
    var prevMoveFrameTime = 0;
    setInterval(function(){
        if(!alive) return;
        const delta = (Date.now() - prevMoveFrameTime) / 16;
        prevMoveFrameTime = Date.now();

        if(isBtnPressed('Up')) plrJet.moveXY(0,-speed * delta);
        if(isBtnPressed('Down')) plrJet.moveXY(0,speed * delta);
        if(isBtnPressed('Left')) {
            plrJet.rotation = lerpAngle(plrJet.rotation,-rotAngle,rotAmt * delta);
            plrJet.moveXY(-speed * delta, 0);
        }
        if(isBtnPressed('Right')){
            plrJet.rotation = lerpAngle(plrJet.rotation,rotAngle,rotAmt * delta);
            plrJet.moveXY(speed * delta,0);
        }
        plrJet.rotation = lerpAngle(plrJet.rotation,0,rotAmt * delta);
    });

    // Main loop
    var prevMainFrameTime = 0;
    setInterval(function(){
        const delta = (Date.now() - prevMainFrameTime) / 16;
        prevMainFrameTime = Date.now();

        clearCanvas(canvas);
        if(!alive) overlay.style.opacity = lerp(overlay.style.opacity,0.5,0.4 * delta);


        for(var i=0;i<projectiles.length;i++){
            const proj = projectiles[i];
            var sp = -speed*2;
            if(proj.enemy) sp *= 0.75;
            if(alive) proj.moveLocalXY(0,sp * delta);
            proj.render(canvas);

            if(alive && proj.enemy && plrHp > 0 && proj.area.isTouching(plrJet.area)){
                plrHp -= 2;
                proj.remove = true;
                updateHpBar();
            } else if(plrHp <= 0){
                die()
            }

            if(proj.remove){
                projectiles.splice(i, 1);
                i--;
            }
        }

        for(var i=0;i<helicopters.length;i++){
            const heli = helicopters[i];
            const rotor = heli.rotor;

            rotor.area.moveTo(heli.getCenter().offsetXY(-40,-33))

            if(alive){
                rotor.rotation += 10;
                heli.area.moveTo(heli.area.startVec.getLerped(heli.targetPos,0.01 * delta))
                const ang = heli.getCenter().getRotationToVec(plrJet.getCenter())+90;
                heli.rotation = lerpAngle(heli.rotation,ang, 0.2 * delta);
            }

            heli.render(canvas);
            rotor.render(canvas);

            if(heli.hp <= 0 || heli.remove){
                if(heli.hp <= 0){
                    kills++;
                    updateKills();
                }
                clearInterval(heli.fireItv);
                helicopters.splice(i,1);
                i--;
                continue;
            }
            if(alive){
                for(var ii=0;ii<projectiles.length;ii++){
                    const proj = projectiles[ii];
                    if(proj.enemy) continue;
                    if(proj.area.isTouching(heli.area)){
                        heli.hp -= 1;
                        heli.rotation += randi(-5,5);
                        proj.remove = true;
                    }
                }
            }
        }

        plrJet.render(canvas);
    });

    updateHpBar();

    btnRestart.addEventListener('click',function(){
        if(!alive) reset();
    })
})