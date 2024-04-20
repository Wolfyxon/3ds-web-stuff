depend("elementGame");

window.addEventListener("load", function(){
    const scene = new Scene(document.getElementById("scene"));

    const chicken = new Sprite("../../../img/pets/chicken/chicken1.png");
    scene.addChild(chicken);

    const maxwell = new Sprite("../../img/pets/maxwell/maxwell1.png");
    scene.addChild(maxwell);
});