// Alternative to canvasGame that utilizes DOM elements instead of drawing on canvases

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

/**
 * Scene constructor
 * @param {HTMLElement} element Container element of the scene
 * @constructor
 */
function Scene(element) {
    this.element = element;
}
Scene.prototype = Object.create(Node.prototype);

/**
 * Scene node used for elements such as sprites
 * @param {Vector2} position
 * @constructor
 */
function SceneNode(position) {
    this.rotation = 0;
    this.position = position || new Vector2(0, 0);
}
SceneNode.prototype = Object.create(Node.prototype);

// TODO: Implement the rest