function Animation(element){
    var anim = {
        looped: true,
        speedScale: 1,
        spacing: 1,
        loopDelay: 0,
        playing: false,
        keyframes: []
    };

    var loopItv = null;

    anim.addKeyframe = function(property, value, timeOffset){
        anim.keyframes.push({
            property: property,
            value: value,
            timeOffset: timeOffset || 0
        })
    }

    anim.getDuration = function(){
        var dur = 0;
        for(var i=0; i<anim.keyframes.length; i++) {
            const frame = anim.keyframes[i];
            dur += (anim.spacing + frame.timeOffset) * (1 / anim.speedScale);
        }

        return dur;
    }

    function set(property, value){ element[property] = value; }

    anim.playOnce = function(){
        anim.playing = true;
        if(anim.speedScale === 0) return;

        for(var i=0; i<anim.keyframes.length; i++){
            if(!anim.playing) break;

            const frame = anim.keyframes[i];
            console.log(frame)
            setTimeout(function(){
                set(frame.property, frame.value);
            },( (anim.spacing + frame.timeOffset) * (1 / anim.speedScale) ) * 1000 * i );
        }
    }

    anim.play = function(){
        if(anim.looped){
            loopItv = setInterval(anim.playOnce, anim.getDuration()*1000);
        } else {
            anim.playOnce();
        }
    }

    anim.stop = function(){
        anim.playing = false;
        if(loopItv) clearInterval(loopItv);
    }

    return anim;
}


/**
 * Converts RGB into a hexadecimal color.
 * @param {number} r red
 * @param {number} g green
 * @param {number} b blue
 * @return {string}
 */
function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

/**
 * Extracts RGB values from an RGB string.
 * @param {String} input RGB string
 * @return {null|{r: string, b: string, g: string}}
 */
function extractRgb(input){
    const inner = input.substring(
        input.indexOf("(") + 1,
        input.lastIndexOf(")")
    );
    const split = inner.split(",")
    if(split.length !== 3) return null;

    return {
        "r": split[0],
        "g": split[1],
        "b": split[2]
    }
}

/**
 * Converts a hexadecimal color into RGB
 * @param {String} hex The hexadecimal color
 * @return {{r: number, b: number, g: number}|null}
 */
function hexToRgb(hex) {
    const hexRegex = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    if (!hexRegex.test(hex)) return null;

    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;

    return {
        "r": r,
        "g": g,
        "b": b
    };
}


/**
 * Performs a linear interpolation between 2 colors
 * @param {String} color1 Current color
 * @param {String} color2 Target color
 * @param {number} weight Speed of the interpolation
 * @return {String|string|*}
 */
function lerpColor(color1, color2, weight) {
    if(color1 === color2) return color1;

    color1 = colorNameToHex(color1) || color1
    color2 = colorNameToHex(color2) || color2

    if(color1 === color2) return color1;

    const rgb1 = extractRgb(color1) || hexToRgb(color1)
    const rgb2 = extractRgb(color2) || hexToRgb(color2)

    if(rgb1 === rgb2) return color1;

    const r = Math.round(lerp(rgb1.r,rgb2.r,weight));
    const g = Math.round(lerp(rgb1.g,rgb2.g,weight));
    const b = Math.round(lerp(rgb1.b,rgb2.b,weight));

    return rgbToHex(r,g,b)
}