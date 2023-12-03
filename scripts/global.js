function getZoom(){
    return (( window.outerWidth - 10 ) / window.innerWidth);
}

// array.includes and string.includes does not work on the 3DS browser
function includes(container,search){
    if(Array.isArray(container)){
        for(var i=0;i<container.length;i++){
            if(container[i] === search) return true;
        }
        return false;
    }
    if(typeof container === "string"){
        const regex = new RegExp(search, 'i');
        return  regex.test(container)
    }

    return container[search] !== undefined
}

function getWithout(array,exclude){
    var newArr = [];
    for(var i=0;i<array.length;i++){
        if(i !== exclude) newArr.push(array[i])
    }
    return newArr;
}

function getGamepad(){
    if(navigator.webkitGetGamepads === undefined) return; // Unsupported browser (most likely not the 3DS one)
    return navigator.webkitGetGamepads()[0];
}

function getPressedBtns(){
    const gp = getGamepad();
    if(gp === undefined) return []
    var res = [];

    function checkAndAdd(index, name){
        if(gp.buttons[index] === 1) res.push(name);
    }
    
    checkAndAdd(0,"B")
    checkAndAdd(1,"A")
    checkAndAdd(2,"Y")
    checkAndAdd(3,"X")

    checkAndAdd(4,"L")
    checkAndAdd(5,"R")
    checkAndAdd(6,"ZL")
    checkAndAdd(7,"ZR")

    checkAndAdd(8,"START")
    checkAndAdd(9,"SELECT")

    checkAndAdd(12,"Up")
    checkAndAdd(13,"Down")
    checkAndAdd(14,"Left")
    checkAndAdd(15,"Right")

    return res;
}

function isBtnPressed(name){
    const pressed = getPressedBtns();

    for(var i=0;i<pressed.length;i++){
        if(pressed[i].toLowerCase() === name.toLowerCase()){
            return true
        }
    }
    return false;
}

var justPressed = []

function isBtnJustPressed(name){
    for(var i=0;i<justPressed.length;i++){
        if(justPressed[i].toLowerCase() === name.toLowerCase()){
            return true
        }
    }
    return false;
}

var lastPressed = []
setInterval(function (){
    window.scrollTo(40,227); // this makes sure the screen is always centered, however it still requires the user to adjust the zoom

    const curPressed = getPressedBtns();
    justPressed = []
    yay = false
    for(var i=0;i<lastPressed.length;i++){
        const btn = lastPressed[i]
        if(!includes(curPressed,btn)){
            justPressed.push(btn)
        }
    }
    lastPressed = curPressed
})

// This prevents the browser from moving the page using the arrow keys
function prevent(event){
    if(event.keyCode === 8) return true; //backspace

    event.preventDefault();
    return false;
}
document.onkeydown = prevent;
document.onkeyup = prevent;
///////////////////////////////////////////////////////////////////////