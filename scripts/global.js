function randf(min, max) {
    return Math.random() * (max - min) + min;
}

function randi(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function lerp(start, end, amt){
    return (1-amt)*start+amt*end
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

var justPressed = []
var lastPressed = []
var pressedKeycodes = [] // for keyboard

function getPressedBtns(){
    const gp = getGamepad();
    var res = [];

    function checkAndAdd(index, name, altKeyCode){
        if( (altKeyCode && includes(pressedKeycodes,altKeyCode)) || (gp && gp.buttons[index] !== 1) ){
            res.push(name)
        }
    }
    
    checkAndAdd(0,"B",66)
    checkAndAdd(1,"A",65)
    checkAndAdd(2,"Y",89)
    checkAndAdd(3,"X",88)

    checkAndAdd(4,"L")
    checkAndAdd(5,"R")
    checkAndAdd(6,"ZL")
    checkAndAdd(7,"ZR")

    checkAndAdd(8,"START")
    checkAndAdd(9,"SELECT")

    checkAndAdd(12,"Up",38)
    checkAndAdd(13,"Down",40)
    checkAndAdd(14,"Left",37)
    checkAndAdd(15,"Right",39)

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


function isBtnJustPressed(name){
    for(var i=0;i<justPressed.length;i++){
        if(justPressed[i].toLowerCase() === name.toLowerCase()){
            return true
        }
    }
    return false;
}


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

window.addEventListener("keydown",function(e){
    if(includes(pressedKeycodes,e.keyCode)) return;
    pressedKeycodes.push(e.keyCode)
})

window.addEventListener("keyup",function(e){
    pressedKeycodes = []
})

// This prevents the browser from moving the page using the arrow keys
function prevent(event){
    if(event.keyCode === 8) return true; //backspace
    if(event.keyCode === 116) return true; //f5

    event.preventDefault();
    return false;
}

document.onkeydown = prevent;
document.onkeyup = prevent;
///////////////////////////////////////////////////////////////////////