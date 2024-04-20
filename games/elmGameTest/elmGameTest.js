depend("elementGame");

window.addEventListener("load", function(){
    const scene = new Scene(document.getElementById("scene"));

    const chicken = new Sprite("../../../img/pets/chicken/chicken1.png");
    scene.addChild(chicken);

    const maxwell = new Sprite("../../img/pets/maxwell_trim.png");
    scene.addChild(maxwell);

    var prevFrameTime = Date.now();
    setInterval(function() {
        const delta = (Date.now() - prevFrameTime);
        prevFrameTime = Date.now();

        chicken.rotate(delta);
    });
});