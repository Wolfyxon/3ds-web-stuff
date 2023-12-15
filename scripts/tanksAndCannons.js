window.addEventListener("load",function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    const imgTank1Base = document.getElementById("img-tank1-base");
    const imgTank1Cannon = document.getElementById("img-tank1-cannon");

    var tanks = [];
    var cannons = [];

    const columns = 9;
    const rows = 5;
    const cellSize = 25;
    const cellSpacing = 1.2;

    for(var i=0;i<columns*rows;i++){
        cannons.push(null);
    }

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

    function addCannon(cellIdx){
        cannons[cellIdx] = Sprite(imgTank1Cannon);
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

        for(var i=0;i<cannons.length;i++){
            const colIdx = i % columns;
            const rowIdx = Math.floor(i / columns);

            var x = (colIdx * cellSize*cellSpacing) + 18;
            var y = (rowIdx * cellSize*cellSpacing) + 150;

            ctx.fillRect(x,y,cellSize,cellSize);

            const cannon = cannons[i];
            if(cannon) cannon.render(canvas);
        }

    },optiItv());
})