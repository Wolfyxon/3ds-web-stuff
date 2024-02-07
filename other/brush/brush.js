window.addEventListener("load", function(){
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");

    var brushSize = 10;

    function draw(e) {
        if(e.buttons === 0) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        ctx.fillRect(x - brushSize/2, y - brushSize/2, brushSize, brushSize);
    }

    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mousedown",draw);
});