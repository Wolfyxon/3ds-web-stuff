libName("createNode");

// IIFE to keep helper functions private
(function() {
	// Helper functions

	var isObjectPlain = Object.getPrototypeOf
		? function(obj) {
			return (
				obj instanceof Object &&
				Object.getPrototypeOf(obj) === Object.prototype
			);
		}
		: function(obj) {
			return (
				obj instanceof Object && (
					!Object.prototype.constructor ||
					obj.constructor === Object ||
					Object.prototype.hasOwnProperty.call(obj, "constructor")
				) && (
					!Object.prototype.__proto__ ||
					obj.__proto__ === Object.prototype ||
					Object.prototype.hasOwnProperty.call(obj, "__proto__")
				)
			);
		};

	var lookupObjectGetter = Object.getOwnPropertyDescriptor
		? function (obj, prop) {
			do {
				var desc = Object.getOwnPropertyDescriptor(obj, prop);
				if (desc) return desc.get;
			} while (obj = Object.getPrototypeOf(obj));
			return false;
		}
		: function (obj, prop) {
			return Object.prototype.__lookupGetter__.call(obj, prop);
		};

	var lookupObjectSetter = Object.getOwnPropertyDescriptor
		? function (obj, prop) {
			do {
				var desc = Object.getOwnPropertyDescriptor(obj, prop);
				if (desc) return desc.set;
			} while (obj = Object.getPrototypeOf(obj));
			return false;
		}
		: function (obj, prop) {
			return Object.prototype.__lookupSetter__.call(obj, prop);
		};

	/**
	 * Applies CSS properties for an element given an object where each key is a property name and its value is the desired property value
	 * @param {Object} obj
	 */
	Element.prototype.applyStyle = function(obj) {
		if(isObjectPlain(obj)) {
			for (var prop in obj) {
				try {
					if(isNaN(prop) && prop.substring(0, 3) != "css") {
						this.style[prop] = obj[prop];
					}
				} catch (err) {}
				this.style.setProperty(prop, obj[prop], undefined);
			}
		} else {
			throw new TypeError("Expected a plain object");
		}
	};

	/**
	 * Sets atributes of an element given a object where each key is an attribute name and its value is the desired attribute value
	 * The only difference between calling this and calling setAttribute several times is that you can set an on(_) event listener to a function instead of just a string
	 * @param {Object} obj
	 */
	Element.prototype.setAttributes = function(obj) {
		if (isObjectPlain(obj)) {
			for (var attr in obj) {
				if (attr == "style" && isObjectPlain(obj[attr])) {
					this.applyStyle(obj[attr]);
					continue;
				}

				if (obj[attr] instanceof Array) obj[attr] = obj[attr].join(' ');

				if (
					lookupObjectSetter(this, attr) &&
					lookupObjectGetter(this, attr) &&
					attr.substring(0, 2) == "on" &&
					typeof obj[attr] == "function"
				) {
					try {
						this[attr] = obj[attr];
						continue;
					} catch(err) {}
				}

				try {
					this.setAttribute(attr, obj[attr]);
					continue;
				} catch(err) {}
				
				throw new TypeError(
					"'" + attr + "' could not be set to '" + obj[attr] + "'"
				);
			}
		} else {
			throw new TypeError("Expected a plain object");
		}
	};

	/**
	 * Creates a node represented by the given structure
	 * - When structure is a string, a text node (Text) is created with the string as its content
	 * - When structure is a Node, the unmodified node is returned
	 * - When structure is an Array with a string as its first item, an element is created with that string as its tag name
	 *   - If there are no further items in the array, the element is returned
	 *   - If the second item is a plain object (see isPlainObject), Element.prototype.setAttributes is called on the element with the plain object as its argument
	 *   - All remaining items in the array are recursivly passed into this.createNode and appended as children to the element
	 * 
	 * @param {string | Node | Array} structure
	 * @returns {Node} node
	 */
	Document.prototype.createNode = function (structure) {
		if (arguments.length != 1) {
			throw new TypeError(
				"Expected 1 argument; Found " + arguments.length + " arguments."
			);
		}

		if (typeof structure == "string") return this.createTextNode(arguments[0]);

		if (structure instanceof Node) return structure;

		if (structure instanceof Array) {
			if (structure.length < 1)
				throw new TypeError("Structure array must have at least one element");
			if (typeof structure[0] != "string")
				throw new TypeError(
					"Expected tag name of type string: Got '" + typeof structure[0] + "'"
				);
			var elem = this.createElement(structure[0]);
			if (structure.length == 1) return elem;
			var i = isObjectPlain(structure[1])
				? (elem.setAttributes(structure[1]), 2)
				: 1;
			
			while (i < structure.length) {
				elem.appendChild(this.createNode(structure[i]));
				i++;
			}
			return elem;
		}

		throw new TypeError(
			"Expected argument of type string/Node/array; Got '" + typeof structure + "'"
		);
	};

	/**
	 * The structure is passed to Document.prototype.createNode and the resulting node is appended to the element
	 * The document createNode is called on is this.ownerDocument if it exists, or window.document if it doesn't
	 * @param {string | Node | Array} structure
	 * @returns {Node} newNode
	 */
	Element.prototype.appendNew = function (structure) {
		return this.appendChild((this.ownerDocument || window.document).createNode(structure));
	};

	/**
	 * The structure is passed to Document.prototype.createNode and the resulting node is added to the document with its position dependant on the position string:
	 * - If the position string is "beforebegin", the new nodes are added before this element
	 * - If the position string is "afterbegin", the new nodes are added before the first node in this element
	 * - If the position string is "beforeend", the new nodes are added after the last node in this element
	 * - If the position string is "afterend", the new nodes are added after this element
	 * @param {"beforebegin" | "afterbegin" | "beforeend" | "afterend"} position
	 * @param {string | Node | Array} structure
	 * @returns {Node} newNode
	 */
	Element.prototype.insertNewAdjacent = function(position, structure) {
		var parentNode, referenceNode;
		switch(position.toLowerCase()) {
			case "beforebegin": {
				parentNode = this.parentNode;
				referenceNode = this;
			}; break;

			case "afterbegin": {
				parentNode = this;
				referenceNode = this.firstChild;
			}; break;

			case "beforeend": {
				parentNode = this;
				referenceNode = null;
			}; break;

			case "afterend": {
				parentNode = this.parentNode;
				referenceNode = this.nextSibling;
			}; break;

			default: {
				throw new SyntaxError("An invalid or illegal string was specified");
			}
		}

		return parentNode.insertBefore((this.ownerDocument || window.document).createNode(structure), referenceNode);
	};

	/**
	 * The structure is passed to Document.prototype.createNode and the resulting node replaces this node
	 * @param {string | Node | Array} structure
	 * @returns {Node} newNode
	 */
	Element.prototype.replaceWithNew = function(structure) {
		var newNode = (this.ownerDocument || document).createNode(structure);

		this.parentNode.replaceChild(newNode, this);

		return newNode;
	};
})();
