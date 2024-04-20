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
        this._parent = null;
        this._children = [];
        this.element.style.position = "absolute";

        this._rotation = 0;
        this._pos = new Vector2(0, 0);

        this.updateTransform();
    },

    setPositionVec: function(vec) {
        this._pos = vec;
        this.updateTransform();
    },

    setPositionXY: function(x, y) {
        this.setPositionVec( new Vector2(x, y) );
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
        node._parent = this;
        this._children.push(node);
        this.element.appendChild(node.element);
    },

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

    getChildren: function() {
        return this._children;
    },

    getParent: function() {
        return this._parent;
    },

    remove: function() {
        const par = this.getParent();

        if(par) {
            par.removeChild(this);
            return;
        }

        this.element.remove();
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