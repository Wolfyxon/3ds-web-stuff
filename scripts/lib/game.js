function Vector2(x=0,y=0){
    var vec = {
        x: x,
        y: y
    }

    vec.distanceTo = function(vector){
        return distanceToXY(vec.x, vec.y ,vector.x, vector.y);
    }

    vec.offset = function(vector){
        vec.x += vector.x;
        vec.y += vector.y;
        return vec;
    }

    return vec;
}

function distanceToXY(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}