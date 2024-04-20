depend("elementGame");

window.addEventListener("load", function(){
    const scene = new Scene(document.getElementById("scene"));
    const fpsTxt = document.getElementById("fps");

    const chicken = new Sprite("../../img/pets/chicken/chicken1.png");
    scene.addChild(chicken);

    const maxwell = new Sprite("../../img/pets/maxwell_trim.png");
    maxwell.setPositionXY(0, 50);
    scene.addChild(maxwell);

    var prevFrameTime = Date.now();
    function mainLoop() {
        const delta = (Date.now() - prevFrameTime);
        prevFrameTime = Date.now();

        fpsTxt.innerText = (1000 / delta).toFixed(2);

        chicken.rotate(delta);

        const spd = 0.5 * delta;
        var vel = new Vector2(0, 0);

        if(isBtnPressed("left")) vel.x = -1;
        if(isBtnPressed("right")) vel.x = 1;
        if(isBtnPressed("up")) vel.y = -1;
        if(isBtnPressed("down")) vel.y = 1;

        maxwell.moveVec(vel.mul(spd));

        setTimeout(mainLoop, 0);
    }
    mainLoop();
});