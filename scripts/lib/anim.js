function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

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


function lerpColor(color1, color2, amt) {
    color1 = colorNameToHex(color1) || color1
    color2 = colorNameToHex(color2) || color2

    const rgb1 = extractRgb(color1) || hexToRgb(color1)
    const rgb2 = extractRgb(color2) || hexToRgb(color2)

    const r = Math.round(lerp(rgb1.r,rgb2.r,amt));
    const g = Math.round(lerp(rgb1.g,rgb2.g,amt));
    const b = Math.round(lerp(rgb1.b,rgb2.b,amt));

    return rgbToHex(r,g,b)
}