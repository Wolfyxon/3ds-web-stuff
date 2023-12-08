function lerpColor(color, targetColor, amt) {
    const r1 = color >> 16 & 255;
    const g1 = color >> 8 & 255;
    const b1 = color & 255;

    const r2 = targetColor >> 16 & 255;
    const g2 = targetColor >> 8 & 255;
    const b2 = targetColor & 255;

    const lerpedR = Math.round(lerp(r1, r2, amt));
    const lerpedG = Math.round(lerp(g1, g2, amt));
    const lerpedB = Math.round(lerp(b1, b2, amt));


    return (lerpedR << 16) | (lerpedG << 8) | lerpedB;
}