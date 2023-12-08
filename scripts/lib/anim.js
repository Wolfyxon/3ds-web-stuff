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

function hexToRgb(hex){
    hex = hex.replace("#","")
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    if(isNaN(r)) return null;
    if(isNaN(g)) return null;
    if(isNaN(b)) return null;

    return {
        "r": r,
        "g": g,
        "b": b
    }
}

function lerpColor(color1, color2, amt) {
    const rgb1 = extractRgb(color1) || hexToRgb(color1)
    const rgb2 = extractRgb(color2) || hexToRgb(color2)

    const r = Math.round(lerp(rgb1.r,rgb2.r,amt));
    const g = Math.round(lerp(rgb1.g,rgb2.g,amt));
    const b = Math.round(lerp(rgb1.b,rgb2.b,amt));

    return rgbToHex(r,g,b)
}