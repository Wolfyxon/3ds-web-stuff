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

    /**
     * Initializes the node. Called by constructors.
     */
    init: function() {
        this._parent = null;
        this._children = [];
        this.element.style.position = "absolute";

        this._rotation = 0;
        this._pos = new Vector2(0, 0);

        this.updateTransform();
    },

    /**
     * Sets the node's position to a Vector2
     * @param {Vector2} vec
     */
    setPositionVec: function(vec) {
        this._pos = vec;
        this.updateTransform();
    },

    /**
     * Sets the node's position to X and Y values
     * @param {number} x Horizontal position
     * @param {number} y Vertical position
     */
    setPositionXY: function(x, y) {
        this._pos.x = x;
        this._pos.y = y;
        this.updateTransform();
    },

    /**
     * Moves the node by the specified Vector2
     * @param {Vector2} vec
     */
    moveVec: function(vec) {
        this.moveXY(vec.x, vec.y);
    },

    /**
     * Moves the node by X and Y values
     * @param {number} x Horizontal position
     * @param {number} y Vertical position
     */
    moveXY: function(x, y) {
        this.setPositionXY(this._pos.x + x, this._pos.y + y);
    },

    /**
     * Returns the node's Vector2 position
     * @return {Vector2}
     */
    getPosition: function() {
        return this._pos;
    },

    /**
     * Returns the node's rotation in degrees
     * @return {number}
     */
    getRotation: function() {
        return this.rotation;
    },

    /**
     * Sets the node's rotation in degrees
     * @param {number} deg
     */
    setRotation: function(deg) {
        this._rotation = deg;
        this.updateTransform();
    },

    /**
     * Rotates the node by the specified degrees
     * @param {number} deg
     */
    rotate: function(deg) {
        this.setRotation(this._rotation + deg);
    },

    /**
     * Updates the rendered node's position, rotation and size
     */
    updateTransform: function() {
        const x = this._pos.x + "px";
        const y = this._pos.y + "px";
        var trStr = "rotate(" + this._rotation + "deg)";

        this.element.style.webkitTransform = trStr;
        this.element.style.transform = trStr;
        this.element.style.left = x;
        this.element.style.top = y;
    },

    /**
     * Adds a child to the node
     * @param {SceneNode} node
     */
    addChild: function(node) {
        node._parent = this;
        this._children.push(node);
        this.element.appendChild(node.element);
    },

    /**
     * Removes a child from the node
     * @param {SceneNode} node
     */
    removeChild: function(node) {
        const idx = this._children.indexOf(node);
        if(idx === -1) {
            console.warn("Attempt to remove not owned child");
            return;
        }
        this._children.splice(idx, 1);
        node._parent = null;

        node.remove();
    },

    /**
     * Returns an array of the node's children
     * @return {[SceneNode]}
     */
    getChildren: function() {
        return this._children;
    },

    /**
     * Returns the node's parent node
     * @return {SceneNode|null}
     */
    getParent: function() {
        return this._parent;
    },

    /**
     * Removes the node
     */
    remove: function() {
        const par = this.getParent();

        if(par) {
            par.removeChild(this);
            return;
        }

        if(this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
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