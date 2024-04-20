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
    this.init();
}
SceneNode.prototype = {

    init: function() {
        this._children = [];
        this.element.style.position = "absolute";

        this._rotation = 0;
        this._pos = new Vector2(0, 0);
    },

    getPosition: function() {
        return this._pos;
    },

    getRotation: function() {
        return this.rotation;
    },

    setRotation: function(deg) {
        this._rotation = deg;
        this.updateTransform();
    },

    updateTransform: function() {
        const x = this._pos.x + "px";
        const y = this._pos.y + "px";
        var trStr = "rotate(" + this._rotation + "deg)";

        this.element.style.webkitTransform = trStr;
        this.element.style.transform = trStr;
        this.element.style.left = x;
        this.element.style.top = y;
    },

    addChild: function(node) {
        this._children.push(node);
        this.element.appendChild(node.element);
    },

    getChildren: function() {
        return this._children;
    }
}

/**
 * Scene constructor
 * @param {HTMLElement} element Container element of the scene
 * @constructor
 */
function Scene(element) {
    this.element = element;
    this.init();
    element.style.position = "relative";
}
Scene.prototype = Object.create(SceneNode.prototype);

/**
 * 2D image for Scenes
 * @param {String} imageUrl
 * @constructor
 */
function Sprite(imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;

    this.element = img;
    this.init();
}
Sprite.prototype = Object.create(SceneNode.prototype);

// TODO: Implement the rest