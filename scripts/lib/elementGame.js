// Alternative to canvasGame that utilizes DOM elements instead of drawing on canvases

libName("elementGame");
depend("gameBase");


/**
 * Scene node used for elements such as sprites
 * @param {HTMLElement} element Target element
 * @constructor
 */
function SceneNode(element) {
    this.element = element;
}

/**
 * Scene constructor
 * @param {HTMLElement} element Container element of the scene
 * @constructor
 */
function Scene(element) {
    this.element = element;
}
Scene.prototype = Object.create(SceneNode.prototype);


// TODO: Implement the rest