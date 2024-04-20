depend("elementGame");

window.addEventListener("load", function(){
    const scene = new Scene(document.getElementById("scene"));

    const fpsTxt = document.getElementById("fps");
    const maxFpsTxt = document.getElementById("max-fps");
    const minFpsTxt = document.getElementById("min-fps");

    const particlesTxt = document.getElementById("particles");

    const chicken = new Sprite("../../img/pets/chicken/chicken1.png");
    scene.addChild(chicken);

    const maxwell = new Sprite("../../img/pets/maxwell_trim.png");
    maxwell.setPositionXY(0, 50);
    scene.addChild(maxwell);

    var minFps = 99999;
    var maxFps = -99999
    var frame = 0;

    var prevFrameTime = Date.now();
    function mainLoop() {
        const delta = (Date.now() - prevFrameTime);
        prevFrameTime = Date.now();

        frame++;

        const fps = (1000 / delta);
        if(isFinite(fps) && frame > 10) {
            maxFps = Math.max(fps, maxFps);
            minFps = Math.min(fps, minFps);

            fpsTxt.innerText = fps.toFixed(2);
            minFpsTxt.innerText = minFps.toFixed(2);
            maxFpsTxt.innerText = maxFps.toFixed(2);
        }


        chicken.rotate(delta);

        const spd = 0.5 * delta;
        var vel = new Vector2(0, 0);

        if(isBtnPressed("left")) vel.x = -1;
        if(isBtnPressed("right")) vel.x = 1;
        if(isBtnPressed("up")) vel.y = -1;
        if(isBtnPressed("down")) vel.y = 1;

        if(isBtnPressed("a")) spawnParticle();

        const particles = scene.getChildrenOfClass("particle");
        for(var i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.moveVec(p.velocity.getMul(0.2 * delta));
        }
        particlesTxt.innerText = particles.length;

        maxwell.moveVec(vel.mul(spd));

        setTimeout(mainLoop, 0);
    }
    mainLoop();

    function spawnParticle() {
        const p = new Sprite("../pigeon/img/wingUp.png");
        p.addClass("particle");
        p.velocity = new Vector2(randf(-1, 1), randf(-1, 1));
        scene.addChild(p);

        setTimeout(function() {
            p.remove();
        }, randi(100, 1000));
    }

});