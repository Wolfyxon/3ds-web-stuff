libName("anim");

function startAnim(data) {
	return setInterval(function() {
		if (!data.playing) return;
		data.element.children[data.frame].className = '';
		data.frame++;
		if (data.frame === data.frameCount) data.frame = 0;
		data.element.children[data.frame].className = 'vis';

		if (!data.looped && data.frame === 0) data.playing = false;
		if (data.frame === 0 && data.loopDelay > 0) {
			data.playing = false;
			setTimeout(function() {
				data.playing = true;
			}, data.loopDelay * 1000);
		}
	}, data.spacing * 1000);
}

Animation = function(element){
	this.element = element;
	this.looped = false;
	this.spacing = 1;
	this.loopDelay = 0;
	this.playing = false;
	this.frame = 0;
	this.frameCount = 0;
	this.intervalId = 0;
};
Animation.prototype = {
	addKeyframe: function(property, value, timeOffset) {
		this.element.innerHTML += '<img src="' + value + '" alt="Animation">';
		this.frameCount++;
	},

	setDelay: function(v) {
		if (typeof(v) !== 'number') return;
		this.loopDelay = v;
	},

	setLooped: function(v) {
		if (typeof(v) !== 'boolean') return;
		this.looped = v;
	},

	setSpacing: function(v) {
		if (typeof(v) !== 'number') return;
		this.spacing = v;
		if (this.intervalId > 0) {
			clearInterval(this.intervalId);
			this.intervalId = startAnim(this);
		}
	},

	play: function() {
		if (this.intervalId > 0) return;
		this.playing = true;
		this.intervalId = startAnim(this);
		console.log('Play animation', this.intervalId);
	},

	stop: function() {
		if (this.intervalId === 0) return;
		this.playing = false;
		console.log('Stop animation', this.intervalId);
		clearInterval(this.intervalId);
		this.intervalId = 0;
	}
};

/**
 * Converts RGB into a hexadecimal color.
 * @param {number} r red
 * @param {number} g green
 * @param {number} b blue
 * @return {string}
 */
function rgbToHex(r, g, b) {
	return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

/**
 * Extracts RGB values from an RGB string.
 * @param {String} input RGB string
 * @return {null|{r: string, b: string, g: string}}
 */
function extractRgb(input){
	const inner = input.substring(
		input.indexOf("(") + 1,
		input.lastIndexOf(")")
	);
	const split = inner.split(",");
	if(split.length !== 3) return null;

	return {
		"r": split[0],
		"g": split[1],
		"b": split[2]
	};
}

/**
 * Converts a hexadecimal color into RGB
 * @param {String} hex The hexadecimal color
 * @return {{r: number, b: number, g: number}|null}
 */
function hexToRgb(hex) {
	const hexRegex = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
	if (!hexRegex.test(hex)) return null;

	hex = hex.replace("#", "");
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	if (isNaN(r) || isNaN(g) || isNaN(b)) return null;

	return {
		"r": r,
		"g": g,
		"b": b
	};
}


/**
 * Performs a linear interpolation between 2 colors
 * @param {String} color1 Current color
 * @param {String} color2 Target color
 * @param {number} weight Speed of the interpolation
 * @return {String|string|*}
 */
function lerpColor(color1, color2, weight) {
	if(color1 === color2) return color1;

	color1 = colorNameToHex(color1) || color1;
	color2 = colorNameToHex(color2) || color2;

	if(color1 === color2) return color1;

	const rgb1 = extractRgb(color1) || hexToRgb(color1),
		rgb2 = extractRgb(color2) || hexToRgb(color2);

	if(rgb1 === rgb2) return color1;

	const r = Math.round(lerp(rgb1.r,rgb2.r,weight));
	const g = Math.round(lerp(rgb1.g,rgb2.g,weight));
	const b = Math.round(lerp(rgb1.b,rgb2.b,weight));

	return rgbToHex(r,g,b);
}

/**
 * Gets a hexadecimal color for the given colour name
 * @param  {String} colour Name of the colour, example 'red'
 * @return {String}
 */
function colorNameToHex(colour) {
	const colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
        "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
        "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
        "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
        "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
        "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
        "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
        "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
        "honeydew":"#f0fff0","hotpink":"#ff69b4",
        "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
        "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
        "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
        "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
        "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
        "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
        "navajowhite":"#ffdead","navy":"#000080",
        "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
        "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
        "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
        "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
        "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
        "violet":"#ee82ee",
        "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
        "yellow":"#ffff00","yellowgreen":"#9acd32"};

	if (typeof colours[colour.toLowerCase()] != 'undefined') return colours[colour.toLowerCase()];
}
