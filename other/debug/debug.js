window.addEventListener("load",function (){
    const scrollPos = document.getElementById("scroll-pos")
    const zoomPos = document.getElementById("zoom-pos")
    const userAg = document.getElementById("user-agent")
    const btn = document.getElementById("btn")
    const gamepadTxt = document.getElementById("gamepad")
    const keyTxt = document.getElementById("key")
    const justPressedTxt = document.getElementById("just-pressed")
    const anim = document.getElementById("anim-test")

    userAg.innerText = navigator.userAgent;
    document.getElementById("is-3ds").innerText = "Is 3DS: " + is3DS();

    var clickCount = 0;
    btn.addEventListener("click",function (){
        clickCount+=1;
        btn.innerText = "Clicked "+clickCount+" times"
    })

    var targetColor = "#FF0000";

    setInterval(function(){
        if(targetColor === "FF0000") targetColor = "#00FF00";
        else targetColor = "FF0000";
    },1000)

    setInterval(function (){
        gamepadTxt.innerText = "Pressed: "+getPressedBtns();
        justPressedTxt.innerText = "Just pressed: "+justPressed;
        keyTxt.innerText = "Key code: "+pressedKeycodes;
        scrollPos.innerText = "Scroll pos: " + window.scrollX + " " + window.scrollY;
        const zoom = (( window.outerWidth - 10 ) / window.innerWidth) * 100;
        zoomPos.innerText = "Zoom: " + window.outerWidth + " " +window.outerHeight + " " + zoom + "%";
        anim.style.backgroundColor = lerpColor(anim.style.backgroundColor,targetColor,0.01)
    })

    // Chart testing
    const chart = document.getElementById("chart");
    drawLineChart(chart,[
        {x: "value 1", y: 10},
        {x: "value 2", y: 50},
        {x: "value 3", y: 0},
        {x: "value 4", y: 20},
        {x: "value 5", y: -10},
    ]);
    drawLineChart(chart,[
        {x: "value 1", y: -10},
        {x: "value 2", y: 20},
        {x: "value 3", y: 5},
        {x: "value 4", y: -20},
        {x: "value 5", y: 0},
    ],"blue")

    // Canvas testing
    const canvas = document.getElementById("canv");
    const rect = Rect2D(Vector2(20,20),70,50);
    rect.outlineSize = 5;
    rect.outlineStyle = "red";

    setInterval(function(){
        clearCanvas(canvas);
        rect.rotation += 1;
        rect.render(canvas);
    },optiItv());

    setInterval(function(){
        if(rect.fillStyle === "black"){
            rect.fillStyle = "";
        } else {
            rect.fillStyle = "black";
        }
    },1000)

})

