window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    const imgJet = document.getElementById("img-jet");

    const imgProjectile = document.getElementById("img-projectile");

    const plrJet = Sprite(imgJet,125,350);

    setInterval(function(){
        clearCanvas(canvas);

        plrJet.render(canvas);
    },optiItv());
})