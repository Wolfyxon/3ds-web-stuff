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
        this._classList = [];
        this.extraCss = "position: absolute;";

        this._rotation = 0;
        this._pos = new Vector2(0, 0);
        this._scale = new Vector2(1, 1);

        this.updateTransform();
        this.updateClass();
    },

    /**
     * Sets the node's element ID
     * @param {String} id
     */
    setId: function(id) {
        if(!this.element) {
            console.warn("Node has no element. Attempting to apply id: " + id);
            return;
        }

        this.element.id = id;
    },

    /**
     * Returns the node's element ID.
     * @return {string|null}
     */
    getId: function() {
        if(!this.element) return null;
        return this.element.id;
    },

    /**
     * Assigns a class to the node
     * @param {String} className
     */
    addClass: function(className) {
        this._classList.push(className);
        this.updateClass();
    },

    /**
     * Removes an assigned class from the node
     * @param {string} className
     */
    removeClass: function(className) {
        const idx = this._classList.indexOf(className);

        if(idx === -1) {
            console.warn("Does not belong to class '"+className+"'");
            return;
        }

        this._classList.splice(idx, 1);
        this.updateClass();
    },

    /**
     * Returns the node's class list
     * @return {[String]}
     */
    getClassList: function() {
        return this._classList;
    },

    /**
     * Updates the node's element class list
     */
    updateClass: function() {
        this.element.className = "scene-node " + this.getClassString();
    },

    /**
     * Checks if the node belongs to a class
     * @param className
     * @return {boolean}
     */
    isClass: function(className) {
        return this._classList.indexOf(className) !== -1;
    },

    /**
     * Returns the node's class list in a string that can be assigned to an element's className
     * @return {String}
     */
    getClassString: function() {
        return this._classList.join(" ");
    },

    /**
     * Sets the node's position to a Vector2
     * @param {Vector2} vec
     */
    setPositionVec: function(vec) {
        if(vec.equals(this._pos)) return;
        this._pos = vec;
        this.updateTransform();
    },

    /**
     * Sets the node's position to X and Y values
     * @param {number} x Horizontal position
     * @param {number} y Vertical position
     */
    setPositionXY: function(x, y) {
        if(this._pos.x == x && this._pos.y == y) return; // use == for compatibility with strings
        this._pos.x = x;
        this._pos.y = y;
        this.updateTransform();
    },

    /**
     * Sets the node's scale to the specified vector
     * @param {Vector2} vec
     */
    setScaleVec: function(vec) {
        if(vec.equals(this._pos)) return;
        this._scale = vec;
        this.updateTransform();
    },

    /**
     * Sets the node's scale to the specified X and Y values
     * @param {number} x Horizontal scale
     * @param {number} y Vertical scale
     */
    setScaleXY: function(x, y) {
        if(x == this._scale.x && y == this._scale.y) // use == for string compatibility
        this._scale.x = x;
        this._scale.y = y;
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
        if(this._rotation === deg) return;
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
        const x = this._pos.x;
        const y = this._pos.y;

        const sX = this._scale.x;
        const sY = this._scale.y;

        const trStr = "rotate(" + this._rotation + "deg) scale(" + sY + "," + sX + ")";
        const posStr = "left: " + x + "px; top: " + y + "px;"

        const style = this.element.style;
        const styleStr = "-webkit-transform: " + trStr + ";" + posStr + this.extraCss;

        if(style.cssText !== styleStr) {
            style.cssText = styleStr;
        }
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
     * Adds multiple nodes to the node. Should provide better performance than calling addChild() in a loop
     * @param {[SceneNode]} nodes
     */
    addChildren: function (nodes) {
        if(nodes.length === 0) return;

        const frag = document.createDocumentFragment();

        for(var i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            node._parent = this;
            this._children.push(node);
            frag.appendChild(node.element);
        }

        this.element.appendChild(frag);
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
     *
     * @param className
     * @return {[SceneNode]}
     */
    getChildrenOfClass: function(className) {
        var res = [];
        const children = this._children;

        for(var i = 0; i < children.length; i++) {
            const ch = children[i];

            if(ch.isClass(className)) {
                res.push(ch);
            }
        }

        return res;
    },

    /**
     * Gets a child node with the specified ID
     * @param {string} id
     * @return {SceneNode|null}
     */
    getChildById: function(id) {
        const children = this.getChildren();

        for(var i = 0; i < children.length; i++) {
            const ch = children[i];
            if(ch.getId() === id) return ch;
        }

        return null;
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

        const pn = this.element.parentNode;
        if(pn) {
            pn.removeChild(this.element);
        }

        this._parent = null;
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
    this.extraCss = "position: relative; overflow: hidden;";
    this.updateTransform();
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

    const container = document.createElement("span");
    container.appendChild(img);

    this.element = container;
    this.init();
    this.addClass("sprite");
}
Sprite.prototype = Object.create(SceneNode.prototype);

// TODO: Implement the rest