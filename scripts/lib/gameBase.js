/*
// A library with basic classes and mathematical functions useful for making games

Do not put here things like:
- Canvas operations
- Rendering solutions
- Advanced element operations

This library is for basic things, for more advanced features see: canvasGame and elementGame (they also depend on this library).

 */
libName("gameBase");

/////////  CLASSES  /////////

/**
 * 2D position
 * @param {number} x
 * @param {number} y
 * @constructor
 */
function Vector2(x, y) {
    this.x = x;
    this.y = y;
}
Vector2.prototype = {
    /**
     * Offsets the vector by X and Y values
     * @param {Number} x Horizontal offset
     * @param {Number} y Vertical offset
     * @return {Vector2}
     */
    offsetXY: function (x, y) {
        this.x += x;
        this.y += y;
        return this;
    },

    /**
     * Returns an offset copy of the vector by X and Y values
     * @param {Number} x Horizontal offset
     * @param {Number} y Vertical offset
     * @return {Vector2}
     */
    getOffsetXY: function(x, y) {
        return this.copy().offsetXY(x, y);
    },

    /**
     * Returns an offset copy of the vector
     * @param {Vector2} vec Offset vector
     * @return {Vector2}
     */
    getOffsetVec: function(vec) {
        return this.copy().offsetVec(vec);
    },

    /**
     * Offsets the vector by another Vector2
     * @param {Vector2} vec Offset vector
     * @return {Vector2}
     */
    offsetVec: function (vec) {
        return vec.offsetXY(vec.x, vec.y);
    },

    /**
     * Offsets the vector respecting the given rotation
     * @param {Number} x X amount to offset
     * @param {Number} y Y amount to offset
     * @param {Number} rotation Rotation in degrees
     * @returns {Vector2}
     */
    offsetRotatedXY: function(x, y, rotation) {
        const angle = deg2rad(rotation);
        const localX = x * Math.cos(angle) - y * Math.sin(angle);
        const localY = x * Math.sin(angle) + y * Math.cos(angle);

        return this.offsetXY(localX, localY);
    },

    /**
     * Offsets the vector respecting the given rotation
     * @param {Vector2} vec Offset vector
     * @param {Number} rotation Rotation in degrees
     */
    offsetRotatedVec: function (vec, rotation) {
        return this.offsetRotatedXY(vec.x, vec.y, rotation);
    },

    /**
     * Performs a linear interpolation to the X and Y values
     * @param {Number} x Horizontal position
     * @param {Number} y Vertical position
     * @param {Number} weight Speed of the interpolation
     * @return {Vector2}
     */
    lerpXY: function (x, y, weight) {
        this.x = lerp(this.x, x, weight);
        this.y = lerp(this.y, y, weight);

        return this;
    },

    /**
     * Performs a linear interpolation to the target Vector2
     * @param {Vector2} vec The target Vector2
     * @param {Number} weight Speed of the interpolation
     * @return {Vector2}
     */
    lerpVec: function(vec, weight) {
        return this.lerpXY(vec.x, vec.y, weight);
    },

    /**
     * Returns a linearly interpolated copy of the vector by the X and Y values
     * @param {Number} x Horizontal position
     * @param {Number} y Vertical position
     * @param {Number} weight Speed of the interpolation
     * @return {Vector2}
     */
    getLerpedXY: function(x, y, weight) {
        return this.copy().lerpXY(x, y, weight);
    },

    /**
     * Returns a linearly interpolated copy of the vector to the target Vector2
     * @param {Vector2} vec The target Vector2
     * @param {Number} weight Speed of the interpolation
     * @return {Vector2}
     */
    getLerpedVec: function(vec, weight) {
        return this.getLerpedXY(vec.x, vec.y, weight);
    },

    /**
     * Kept for backwards compatibility, use lerpVec()
     * @deprecated
     */
    lerp: function(vec, weight) {
        return this.lerpVec(vec, weight);
    },

    /**
     * Kept for backwards compatibility, use getLerpedVec()
     * @deprecated
     */
    getLerped: function(vec, weight) {
        return this.getLerpedVec(vec, weight);
    },

    /**
     * Calculates an angle in degrees to the target point at X and Y values
     * @param {Number} x Horizontal position
     * @param {Number} y Vertical position
     * @return {Object}
     */
    getRotationToXY: function(x, y) {
        const deltaX = x - this.x;
        const deltaY = y - this.y;
        return rad2deg( Math.atan2(deltaY, deltaX) );
    },

    /**
     * Calculates an angle in degrees to the target Vector2
     * @param {Vector2} vec Target Vector2
     * @return {number}
     */
    getRotationToVec: function(vec) {
        return this.getRotationToXY(vec.x, vec.y);
    },

    /**
     * Moves the vector towards the target point at X and Y values
     * @param {Number} x Horizontal position
     * @param {Number} y Vertical position
     * @param {Number} amt Speed of the movement
     * @return {Vector2}
     */
    moveTowardXY: function(x, y, amt) {
        const angle = Math.atan2(y - this.y, x - this.x);
        this.x += Math.cos(angle) * amt;
        this.y += Math.sin(angle) * amt;
        return this;
    },

    /**
     * Moves the vector towards tge target Vector2
     * @param {Vector2} vec Target Vector2
     * @param {Number} amt Speed of the movement
     * @return {Vector2}
     */
    moveTowardVec: function(vec, amt) {
        return this.moveTowardXY(vec.x, vec.y, amt);
    },

    /**
     * Multiplies the vector
     * @param {number} value
     */
    mul: function(value) {
        this.x *= value;
        this.y *= value;
        return this;
    },

    /**
     * Returns a copy of the vector multiplied by the value
     * @param {number} value
     * @return {Vector2}
     */
    getMul: function(value) {
        return this.copy().mul(value);
    },

    /**
     * Returns an independent copy of this vector
     * @return {Vector2}
     */
    copy: function() {
        return new Vector2(this.x, this.y);
    }
}

///////// FUNCTIONS /////////

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