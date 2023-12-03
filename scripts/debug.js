window.addEventListener("load",function (){
    const scrollPos = document.getElementById("scroll-pos")
    const zoomPos = document.getElementById("zoom-pos")
    const userAg = document.getElementById("user-agent")
    const btn = document.getElementById("btn")
    const gamepadTxt = document.getElementById("gamepad")
    const keyTxt = document.getElementById("key")
    const justPressedTxt = document.getElementById("just-pressed")


    userAg.innerText = navigator.userAgent;

    var clickCount = 0;
    btn.addEventListener("click",function (){
        clickCount+=1;
        btn.innerText = "Clicked "+clickCount+" times"
    })

    window.addEventListener("keydown",function (e){
        keyTxt.innerText = "Key code: "+e.keyCode;
    })

    setInterval(function (){
        gamepadTxt.innerText = "Pressed: "+getPressedBtns();
        justPressedTxt.innerText = "Just pressed: "+justPressed;

        scrollPos.innerText = "Scroll pos: " + window.scrollX + " " + window.scrollY;
        const zoom = (( window.outerWidth - 10 ) / window.innerWidth) * 100;
        zoomPos.innerText = "Zoom: " + window.outerWidth + " " +window.outerHeight + " " + zoom + "%";

    })

})

