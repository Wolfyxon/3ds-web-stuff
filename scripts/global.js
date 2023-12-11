function randf(min, max) {
    return Math.random() * (max - min) + min;
}

function randi(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function lerp(start, end, amt){
    return (1-amt)*start+amt*end
}

function colorNameToHex(colour) {
    const colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
        "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
        "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
        "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
        "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
        "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
        "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
        "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
        "honeydew":"#f0fff0","hotpink":"#ff69b4",
        "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
        "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
        "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
        "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
        "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
        "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
        "navajowhite":"#ffdead","navy":"#000080",
        "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
        "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
        "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
        "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
        "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
        "violet":"#ee82ee",
        "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
        "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colours[colour.toLowerCase()] != 'undefined') return colours[colour.toLowerCase()];
}

function is3DS(){
    return includes(window.navigator.userAgent,"Nintendo 3DS") && getGamepad();
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
        if( (altKeyCode && includes(pressedKeycodes,altKeyCode)) || (gp && gp.buttons[index] === 1) ){
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

function registerNon3DSlink(a){
    a.onclick = function (e){
        alert("The 3DS doesn't support that page. Please open \n\n"+a.href+"\n\non a external device (with a modern browser)")
        e.preventDefault();
        return false;
    }
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

// You can't access console logs on the 3DS, so it will show an alert when there's an error
if(is3DS()){
    window.addEventListener("error", function(e) {
        alert(e.filename+":"+e.lineno+" "+e.message);
        return false;
    })
    window.addEventListener("load",function (){
        const non3dsLinks = document.getElementsByClassName("non-3ds-link");
        for(var i=0;i<non3dsLinks.length;i++) registerNon3DSlink(non3dsLinks[i]);
    })
}

