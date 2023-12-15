window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    const imgTank1Base = document.getElementById("img-tank1-base");
    const imgTank1Cannon = document.getElementById("img-tank1-cannon");

    var tanks = [];
    var cannons = [];

    function addTank(){
        const base = Sprite(imgTank1Base);
        const cannon = Sprite(imgTank1Cannon);

        const scale = 0.6;

        base.rescale(scale);
        cannon.rescale(scale);

        tanks.push({
            base: base,
            cannon: cannon
        })
    }
    addTank()

    ctx.scale(1,0.5);
    setInterval(function(){
        clearCanvas(canvas);

        for(var i=0;i<tanks.length;i++){
            const tank = tanks[i];
            tank.base.render(canvas);
            tank.cannon.render(canvas);
        }

    },optiItv());
})