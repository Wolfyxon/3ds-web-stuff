window.addEventListener("load", function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    const menuContainer = document.getElementById("menu-container");
    const menu = document.getElementById("menu");

    const brushSizeSlider = document.getElementById("brush-size");

    const btnEraser = document.getElementById("btn-erase");

    const btnClear = document.getElementById("btn-clear");
    const btnExport = document.getElementById("btn-export");
    const btnSave = document.getElementById("btn-save");

    // draw, line, picker
    var currentTool = "draw";
    var eraser = false;

    var hueColor = "#ff0000";

    var brushSize = 10;

    var prevX = 0;
    var prevY = 0;

    var lastDraw = 0;

    function draw(x, y) {
        const now = Date.now();

        if(now - lastDraw < 100){
            drawLine(prevX, prevY, x, y);
        }
        lastDraw = now;
        prevX = x;
        prevY = y;
        justDraw(x, y);
    }

    function justDraw(x, y) {
        const rX = x - brushSize/2;
        const rY = y - brushSize/2;
        if(eraser) {
            ctx.clearRect(rX, rY, brushSize, brushSize);
        } else {
            ctx.fillRect(rX, rY, brushSize, brushSize);
        }
    }

    function drawLine(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const steps = Math.ceil(distance);

        const stepX = dx / steps;
        const stepY = dy / steps;

        for (var i=0; i<=steps; i++) {
            const x = x1 + stepX * i;
            const y = y1 + stepY * i;
            justDraw(x, y);
        }
    }


    function drawMouse(e) {
        if(e.buttons === 0) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        draw(x,y);
    }

    function drawTouch(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const touch = e.touches[0];
        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;
        draw(x,y);
    }

    function updateBrushSize() {
        brushSize = brushSizeSlider.value;
    }
    updateBrushSize();

    function setButtonState(button, state) {
        if(state) {
            button.style.backgroundColor = "#797979";
        } else {
            button.style.backgroundColor = "";
        }
    }

    function drawColorSelector() {
        const canv =  document.getElementById("square-color-select");
        const colorCtx = canv.getContext("2d");

        const gH = colorCtx.createLinearGradient(0, 0, canv.width, 0);
        gH.addColorStop(0, '#fff');
        gH.addColorStop(1, hueColor);
        colorCtx.fillStyle = gH;
        colorCtx.fillRect(0, 0, canv.width, canv.height);

        const gV = colorCtx.createLinearGradient(0, 0, 0, canv.height);
        gV.addColorStop(0, "rgba(0,0,0,0)");
        gV.addColorStop(1, "#000");
        colorCtx.fillStyle = gV;
        colorCtx.fillRect(0, 0, canv.width, canv.height);

    }
    drawColorSelector();

    function drawHueSelector() {
        const canv = document.getElementById("rect-color-select");
        const hueCtx = canv.getContext("2d");

        const grad = hueCtx.createLinearGradient(0, 0, 0, canv.height);
        const steps = 7;
        grad.addColorStop(0, "red");
        grad.addColorStop(2/steps, "yellow");
        grad.addColorStop(3/steps, "#00ff00");
        grad.addColorStop(4/steps, "cyan");
        grad.addColorStop(5/steps, "blue");
        grad.addColorStop(6/steps, "magenta");
        grad.addColorStop(7/steps, "red");

        hueCtx.fillStyle = grad;
        hueCtx.fillRect(0, 0, canv.width, canv.height);
    }
    drawHueSelector();

    var menuEnabled = false;

    var menuPos = 1;
    var prevFrameTime = Date.now();
    setInterval(function() {
        const delta = (Date.now() - prevFrameTime) / 16;
        prevFrameTime = Date.now();

        const menuSpeed = 0.2;
        if(menuEnabled) menuPos = lerp(menuPos, 70, menuSpeed*delta);
        else menuPos = lerp(menuPos, 1, menuSpeed*delta);

        menu.style.marginTop = menuPos+"%";
    });


    onBtnJustPressed("a",function (){
        menuEnabled = !menuEnabled;
    });

    canvas.addEventListener("mousemove", drawMouse);
    canvas.addEventListener("touchmove",drawTouch);
    canvas.addEventListener("mousedown", drawMouse);

    brushSizeSlider.addEventListener("change", updateBrushSize);

    btnEraser.addEventListener("click", function (){
        eraser = !eraser;
        setButtonState(btnEraser, eraser);
    })

    btnClear.addEventListener("click", function (){
        if(confirm("Are you sure you want to clear the canvas?\nYour drawing will be gone.")) {
            ctx.clearRect(0,0, canvas.width, canvas.height);
        }
    });

    if(is3DS()) {
        menu.style.height = "100%";
    }
});