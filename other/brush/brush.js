window.addEventListener("load", function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    var brushSize = 10;

    var prevX = 0;
    var prevY = 0;

    function draw(x, y) {
        prevX = x;
        prevY = y;
        justDraw(x, y);
    }

    function justDraw(x, y) {
        ctx.fillRect(x - brushSize/2, y - brushSize/2, brushSize, brushSize);
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

    canvas.addEventListener("mousemove", drawMouse);
    canvas.addEventListener("touchmove",drawTouch);
    canvas.addEventListener("mousedown", drawMouse);

});