function requestText(url, callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);

	xhr.onload = function() {
		if (this.status == 200) {
			callback(this.responseText);
		} else {
			callback("Request failed with status " + this.status);
		}
	};

	xhr.onerror = function(e) {
		callback("Request failed after " + e.loaded + " bytes transfered");
	};

	xhr.send();
}

Element.prototype.appendNew = function(tagname, content, attributes) {
	content = content || "";
	attributes = attributes || {};
	var elem = document.createElement(tagname);
	elem.innerHTML = content;
	for (var attribute in attributes) {
		if (attributes.hasOwnProperty(attribute)) {
			elem[attribute] = attributes[attribute];
			elem.setAttribute(attribute, attributes[attribute]);
		}
	}
	this.appendChild(elem);
	return elem;
};

Element.prototype.startIconAnim = function() {
  const elem = this;
  var animIndex = 0;
  elem["data-iconAnimInterval"] = setInterval(function() {
    const rot = Math.sin(animIndex/20) * 8;
    const scale = 1 + (Math.abs(((animIndex/80) % 2) - 1) - 0.5) * 0.1; // Triangle Wave
    elem.style["-webkit-transform"] = "rotate(" + rot + "deg) scale(" + scale + ")";
    animIndex++;
  }, 10);
};

Element.prototype.stopIconAnim = function() {
  const elem = this;
  clearInterval(elem["data-iconAnimInterval"]);
  elem.style["-webkit-transform"] = "rotate(0deg) scale(1)";
};

Array.prototype.last = function(set) {
	if (set) {
		this[this.length - 1] = set;
	} else {
		return this[this.length - 1];
	}
};

String.prototype.startsWith = function (str) { // This is a polyfill
	return this.substring(0, str.length) == str;
};

showLevelSelect();

function boardClick(event, buttons, non) {
	if (event.target.getAttribute("data-state") != "flagged" && document.getElementById("flag").checked) {
		event.target.setAttribute("data-state", "flagged");
	} else if (event.target.getAttribute("data-state") == "unpressed") {
		event.target.setAttribute("data-state", "pressed");
	} else {
		event.target.setAttribute("data-state", "unpressed");
	}
	if (hasWon(buttons, non)) {
		gameWin(buttons);
	}
}

function play(non){
	const height = non.height,
		width = non.width,
		title = document.getElementById("title");
	if (non.title !== null) {
		title.appendNew("h2", non.title, { id: "name" });
		title.appendNew("h3", "By " + non.by, { id: "author" });
	}

	const board = document.getElementById("board"),
		table = board.appendNew("table");
	var tr = table.appendNew("thead").appendNew("tr");
	tr.appendNew("th");
	for (var k = 0; k < width; k++) {
		tr.appendNew("th", non.columns[k].join("<br>"));
	}

	const tbody = table.appendNew("tbody");
	var buttons = [];
	for (var i = 0; i < height; i++) {
		buttons.push([]);
		var tr = tbody.appendNew("tr");
		tr.appendNew("th", non.rows[i].join(" "));
		for (var j = 0; j < width; j++) {
			buttons[i].push(tr.appendNew("td").appendNew("button", "", {
				"class": "boardButton",
				"data-pos": j + "," + i,
				"data-state": "unpressed"
			}));
			buttons[i][j].addEventListener("click", function(event) {
				boardClick(event, buttons, non);
			}, false);
		}
	}
}

function parseNon(nonStr) {
	// bundling and the 'color' key are not supported
	var non = nonStr.split(/\r?\n/),
		obj = {
			catalogue: null,
			title: null,
			by: null,
			copyright: null,
			license: null,
			width: null,
			height: null,
			rows: [],
			columns: [],
			goal: null
		};
	const keys = ["catalogue", "title", "by", "copyright", "license", "width", "height", "goal"];
	for (var i = 0; i < non.length; i++) {
		for (var j = 0; j < keys.length; j++) {
			if (non[i].startsWith(keys[j])) {
				obj[keys[j]] = non[i].substr(keys[j].length + 1).match(/[^"]+/g)[0];
				break;
			}
			if (non[i].startsWith("rows")) {
				for (var k = 0; k < obj.height; k++) {
					i++;
					obj.rows.push(non[i].split(","));
				}
			}
			if (non[i].startsWith("columns")) {
				for (var l = 0; l < obj.width; l++) {
					i++;
					obj.columns.push(non[i].split(","));
				}
			}
		}
	}
	return obj;
}

function hasWon(buttons, non) {
	// Make an array of 
	var buttonsBool = [];
	for(var i = 0; i < buttons.length; i++){
		buttonsBool.push([]);
		for(var j = 0; j < buttons[i].length; j++){
			buttonsBool[i].push(buttons[i][j].getAttribute("data-state") == "pressed");
		}
	}

	// Function to check if a sequence matches the hints
	function matchesHints(sequence, hints) {
		var myHints = hints.slice(),
			i = 0,
			hintsIndex = 0;
		while (i < sequence.length) {
			if(sequence[i]){
				if(hintsIndex == myHints.length){
					return false;
				}
				myHints[hintsIndex]--;
			} else {
				if(i != 0 && sequence[i - 1]){
					if(myHints[hintsIndex] != 0){
						return false;
					}
					hintsIndex++;
				}
			}
			i++;
		}
		if (hintsIndex < myHints.length && myHints[hintsIndex] != 0) {
			return false;
		}

		return true;
	}

	// Check rows
	for (var rowIndex = 0; rowIndex < buttonsBool.length; rowIndex++) {
		if (!matchesHints(buttonsBool[rowIndex], non.rows[rowIndex])) {
			//alert("Row " + (rowIndex + 1) + " failed");
			return false;
		}
	}

	// Check columns
	for (var colIndex = 0; colIndex < buttonsBool[0].length; colIndex++) {
		const column = [];
		for (var rowIndex = 0; rowIndex < buttonsBool.length; rowIndex++) {
			column.push(buttonsBool[rowIndex][colIndex]);
		}
		if (!matchesHints(column, non.columns[colIndex])) {
			//alert("Column " + (colIndex + 1) + " failed");
			return false;
		}
	}

	return true;
}

function gameWin(buttons){
	for(var i = 0; i < buttons.length; i++){
		for(var j = 0; j < buttons[i].length; j++){
			const newButton = buttons[i][j].cloneNode(true);
			buttons[i][j].parentNode.replaceChild(newButton, buttons[i][j]); // Removes the event listener
			buttons[i][j] = newButton;
		}
	}

	document.getElementById("winMessage").innerHTML = "You win!";
}

function showLevelSelect(){
  const ls = document.getElementById("bottom-screen").appendNew("div", "", {id: "levelSelect"});
  const table = ls.appendNew("table", "", {id: "levelSelectTable"});
  const groupNames = ["Tutorial", "Easy", "Medium", "Hard"];
  const groupColors = ["#80B0FF", "#20D020", "#FFFF20", "#FF4040"]
  for(var i = 0; i < 4; i++) {
    const tr = table.appendNew("tr");
    for(var j = 0; j < 5; j++) {
      const lt = table.appendNew("td").appendNew("div", "", {class: "LevelTile"});
      lt.style["background-color"] = groupColors[i];
      lt.appendNew("div", groupNames[i], {class: "LevelGroupName"});
      lt.appendNew("div", j + 1, {class: "LevelNumber"});
      lt.addEventListener("mouseover", function(){lt.startIconAnim()});
      lt.addEventListener("mouseout", function(){lt.stopIconAnim()});
      lt.addEventListener("click", function(){
        const fadeDiv = ls.parentElem.appendNew("div", "", {id: "LevelFadeTransition", style: "display: none;"});
        var fadeTimer = 0;
        const fadeTimeout = setInterval(function() {
          fadeDiv.style.opacity = Math.min(1.25 - Math.abs((fadeTimer/40) - 1), 1);
          fadeDiv.style.display = "block";
          if(fadeTimer == 30){
            ls.remove();
            requestText("boards/demo.non", function(text){play(parseNon(text));});
          }
          if(fadeTimer == 90) {
            clearInterval(fadeTimeout);
            fadeDiv.remove();
          }
          fadeTimer++;
        }, 10);
      });
    }
  }
}