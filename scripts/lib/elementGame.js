// Alternative to canvasGame that utilizes DOM elements instead of drawing on canvases

/**
 * Scene constructor
 * @param {HTMLElement} element Container element of the scene
 * @constructor
 */
function Scene(element) {
    this.element = element;
}
Scene.prototype = Object.create(Node.prototype);

// TODO: Implement the rest