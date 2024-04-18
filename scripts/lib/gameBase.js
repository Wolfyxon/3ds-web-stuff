libName("gameBase");

/**
 * Performs a linear interpolation between 2 angles in degrees
 * @param {Number} startDeg Current angle
 * @param {Number} endDeg Target angle
 * @param {Number} speed Speed of the interpolation
 * @return {Number}
 */
function lerpAngle(startDeg, endDeg, speed) {
    if(speed >= 1) return endDeg;

    startDeg = deg2rad(startDeg);
    endDeg = deg2rad(endDeg);

    const TAU = Math.PI * 2;
    const diff = fmod(endDeg - startDeg, TAU);
    const shortest = fmod(2 * diff, TAU) - diff;
    return rad2deg(startDeg + shortest * speed);
}

/**
 * Checks if objects are touching based on their positions and sizes
 * @param {number} x1 Horizontal position of the 1st object
 * @param {number} y1 Vertical position of the 1st object
 * @param {number} w1 Width of the 1st object
 * @param {number} h1 Height of the 1st object
 * @param {number} x2 Horizontal position of the 2nd object
 * @param {number} y2 Vertical position of the 2nd object
 * @param {number} w2 Width of the 2nd object
 * @param {number} h2 Height of the 2nd object
 * @return {Boolean}
 */
function isTouching(x1, y1, w1, h1, x2, y2, w2, h2) {
    const left1 = x1;
    const right1 = x1 + w1;
    const top1 = y1;
    const bottom1 = y1 + h1;

    const left2 = x2;
    const right2 = x2 + w2;
    const top2 = y2;
    const bottom2 = y2 + h2;

    return !(left1 > right2 || right1 < left2 || top1 > bottom2 || bottom1 < top2);
}

/**
 * Calculates the distance between 2 points
 * @param {number} x1 Horizontal position of the 1st point
 * @param {number} y1 Vertical position of the 1st point
 * @param {number} x2 Horizontal position of the 2nd point
 * @param {number} y2 Vertical position of the 2nd point
 * @return {Object}
 */
function distanceToXY(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

/**
 * Converts degrees to radians
 * @param {number} degrees Angle in degrees
 * @return {number}
 */
function deg2rad(degrees){
    return degrees*Math.PI/180;
}

/**
 * Converts radians to degrees
 * @param {number} radians Angle in radians
 * @return {number}
 */
function rad2deg(radians){
    return radians*180/Math.PI;
}

/**
 * Calculates the distance of a Vector2 from a line
 * @param {Object} lineStart Starting position of the line
 * @param {Object} lineEnd Ending position of the line
 * @param {Object} point Position of the point
 * @return {number}
 */
function distanceToLine(lineStart, lineEnd, point) {
    const dx1 = point.x - lineStart.x;
    const dy1 = point.y - lineStart.y;

    const dx2 = lineEnd.x - lineStart.x;
    const dy2 = lineEnd.y - lineStart.y;

    const dotProduct = dx1 * dx2 + dy1 * dy2;
    const segmentLengthSquared = dx2 * dx2 + dy2 * dy2;

    var parametricValue = -1;

    if (segmentLengthSquared !== 0) {
        parametricValue = dotProduct / segmentLengthSquared;
    }

    var closestX;
    var closestY;

    if (parametricValue < 0) {
        closestX = lineStart.x;
        closestY = lineStart.y;
    } else if (parametricValue > 1) {
        closestX = lineEnd.x;
        closestY = lineEnd.y;
    } else {
        closestX = lineStart.x + parametricValue * dx2;
        closestY = lineStart.y + parametricValue * dy2;
    }

    return Math.sqrt(pow(point.x - closestX, 2) + pow(point.y - closestY,2));
}