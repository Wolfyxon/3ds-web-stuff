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

function lerpColor(color1, color2, amt) {
    color1 = color1.replace("#","");
    color2 = color2.replace("#","");

    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    const r = Math.round(lerp(r1,r2,amt));
    const g = Math.round(lerp(g1,g2,amt));
    const b = Math.round(lerp(b1,b2,amt));

    const hex = rgbToHex(r,g,b)
    console.log(hex)
    return hex
}