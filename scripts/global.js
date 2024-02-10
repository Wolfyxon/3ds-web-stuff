/**
 * Generates a random float number within the given range
 * @param  {Number} min Minimum value
 * @param {Number} max Maximum value
 * @return {Number}
 */
function randf(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer within the given range
 * @param  {Number} min Minimum value
 * @param {Number} max Maximum value
 * @return {Number}
 */
function randi(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random element of the specified array
 * @param {Array} array
 * @return {*}
 */
function pickRandom(array){
    return array[randi(0, array.length - 1 )];
}

/**
 * Performs a linear interpolation between 2 numbers
 * @param  {Number} start Current number
 * @param {Number} end Target value
 * @param {Number} weight Speed of the interpolation
 * @return {Number}
 */
function lerp(start, end, weight){
    return (1-weight)*start+weight*end
}

function fmod(a, b){
    return Number((a - (Math.floor(a / b) * b)).toPrecision(8));
}


/**
 * Checks if the user's browser is the Nintendo 3DS browser.
 * @return {Boolean}
 */
function is3DS(){
    return includes(window.navigator.userAgent,"Nintendo 3DS");
}

// array.includes and string.includes does not work on the 3DS browser
/**
 * Performs a linear interpolation between 2 numbers
 * @param  {Object, String, Array} container The object you want to search in
 * @param {*} search Value you want to check if exists
 * @return {Boolean}
 */
function includes(container,search){
    if(typeof container === "string" || Array.isArray(container)){
        return container.indexOf(search) !== -1;
    }

    return container[search] !== undefined
}

/**
 * Returns the specified array without the specified value
 * @param  {Array} array The current array
 * @param  {*} exclude The value you want to exclude
 */
function getWithout(array,exclude){
    return array.filter(function (item) {
        return item !== exclude;
    });
}

/**
 * Returns the webkit gamepad for the 3DS. Returns null if not detected.
 * @return {Gamepad, null}
 */
function getGamepad(){
    if(navigator.webkitGetGamepads === undefined) return null; // Unsupported browser (most likely not the 3DS one)
    return navigator.webkitGetGamepads()[0];
}

var justPressed = []
var lastPressed = []
var pressedKeycodes = [] // for keyboard

/**
 * Returns an Array of the pressed gamepad buttons as strings.
 * @return {[String]}
 */
function getPressedBtns(){
    //const gp = getGamepad();
    var res = [];

    function checkAndAdd(index, name, altKeyCode){
        if( (altKeyCode && includes(pressedKeycodes,altKeyCode)) /* || (gp && gp.buttons[index] === 1) */ ){
            res.push(name)
        }
    }

    // Only arrows and the A key are usable, other buttons have builtin functions for the browser and cannot be disabled

   // checkAndAdd(0,"B",66)
    checkAndAdd(1,"A",65)
    //checkAndAdd(2,"Y",89)
    //checkAndAdd(3,"X",88)
    /*
    checkAndAdd(4,"L")
    checkAndAdd(5,"R")
    checkAndAdd(6,"ZL")
    checkAndAdd(7,"ZR")

    checkAndAdd(8,"START")
    checkAndAdd(9,"SELECT")
    */
    checkAndAdd(12,"Up",38)
    checkAndAdd(13,"Down",40)
    checkAndAdd(14,"Left",37)
    checkAndAdd(15,"Right",39)

    return res;
}

/**
 * Checks if a gamepad button is pressed
 * @param {String} name String name of the button. Any case.
 * @return {Boolean}
 */
function isBtnPressed(name){
    const pressed = getPressedBtns();

    for(var i=0;i<pressed.length;i++){
        if(pressed[i].toLowerCase() === name.toLowerCase()){
            return true
        }
    }
    return false;
}

/**
 * Checks if a gamepad button was pressed and isn't being held
 * @param {String} name String name of the button. Any case.
 * @return {Boolean}
 */
function isBtnJustPressed(name){
    for(var i=0;i<justPressed.length;i++){
        if(justPressed[i].toLowerCase() === name.toLowerCase()){
            return true
        }
    }
    return false;
}

function registerNon3DSlink(a){
    a.onclick = function (e){
        alert("The 3DS doesn't support that page. Please open \n\n"+a.href+"\n\non a external device (with a modern browser)")
        e.preventDefault();
        return false;
    }
}
/**
 * Checks if an Element is scrollable.
 * @param {HTMLElement} element Element you want to check
 * @return {Boolean}
 */
function isScrollable(element){
    const css = window.getComputedStyle(element);

    return (
        css.overflow === "scroll" ||
        css.overflowX === "scroll" ||
        css.overflowY === "scroll"
    );
}

/**
 * Finds the first scrollable ancestor of the specified element or the element itself.
 * @param {HTMLElement} element Element you want to search ancestors of.
 * @return {HTMLElement}
 */
function findScrollableAncestor(element) {
    if(isScrollable(element)) return element;
    var parent = element.parentElement;

    while (parent) {
        if (isScrollable(parent)) return parent;
        parent = parent.parentElement;
    }
}

/**
 * Returns an optimal delay for intervals to ensure parity for a PC browser and the 3DS browser.
 * Please don't use it with intervals that check isBtnJustPressed()
 * @deprecated Please use calculate delta times between frames instead
 * @return {Number}
 */
function optiItv(){
    if(is3DS()) return 0;
    return 16;
}

var forcePosition = true;

setInterval(function (){
    if(forcePosition) window.scrollTo(40,227);

    const curPressed = getPressedBtns();
    justPressed = []

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
    pressedKeycodes = getWithout(pressedKeycodes, e.keyCode);
})

window.addEventListener("blur", function (e){
    pressedKeycodes = [];
})

// This prevents the browser from moving the page using the arrow keys
function prevent(event){
    if(event.keyCode === 8) return true; //backspace
    if(event.keyCode === 116) return true; //f5
    if(event.keyCode === 13) return true; //enter

    if(event.charCode || (event.key && event.key.length === 1 )) return true; // allow character keys

    event.preventDefault();
    return false;
}

document.onkeydown = prevent;
document.onkeyup = prevent;
///////////////////////////////////////////////////////////////////////

// You can't access console logs on the 3DS, so it will show an alert when there's an error
if(is3DS()){
    window.addEventListener("error", function(e) {
        alert(e.filename+":"+e.lineno+" "+e.message);
        return false;
    })
}

// Prevent dragging

var touchStart

document.addEventListener('touchstart', function(e) {
    touchStart = e.touches[0];
});

document.addEventListener('touchmove', function(e){
    pressedKeycodes = [];
    const scrollable = findScrollableAncestor(e.target);

    if(scrollable){
        const css = window.getComputedStyle(scrollable);

        if(css.overflow === "scroll") return;

        const touching = e.touches[0];

        const deltaX = touching.clientX - touchStart.clientX;
        const deltaY = touching.clientY - touchStart.clientY;

        var direction = 1;

        const scrollX = scrollable.scrollLeft;
        const scrollY = scrollable.scrollTop;
        const w = scrollable.scrollWidth - scrollable.clientWidth;
        const h = scrollable.scrollHeight - scrollable.clientHeight;

        if(Math.abs(deltaX) > Math.abs(deltaY)){
            // Horizontal
            if(deltaX > 0) direction = -1

            const notExtended = (direction === 1 && scrollX<w) || (direction === -1 && scrollX>0);
            if(notExtended && css.overflowX === "scroll") return true;
        }
        else {
            // Vertical
            if(deltaY < 0) direction = -1

            // TODO: Fix drag prevention not working when scrolling upwards
            const notExtended = (direction === 1 && scrollY<h) || (direction === -1 && scrollY>0);
            if(notExtended && css.overflowY === "scroll") return true;
        }

    }

    e.preventDefault();
});

window.addEventListener("load",function (){
    if(is3DS()){
        const non3dsLinks = document.getElementsByClassName("non-3ds-link");
        for(var i=0;i<non3dsLinks.length;i++) registerNon3DSlink(non3dsLinks[i]);

    } else {
        const only3ds = document.getElementsByClassName("only-3ds");
        for(var i=0;i<only3ds.length;i++){
            only3ds[i].style.display = "none";
        }
    }

    // This ensures that the canvas isn't stretched
    const dualScreen = document.getElementsByClassName("dual-screen");
    for(var i=0;i<dualScreen.length;i++){
        const elm = dualScreen[i];
        if(elm.tagName.toLowerCase() === "canvas"){
            elm.width = 320
            elm.height = 457
        }
    }
})