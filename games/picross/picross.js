window.addEventListener('load', function() {
	var currentNews, buttonSelectX, buttonSelectY, ltData;

	function startIconAnim(element) {
		var animIndex = 0;
		clearInterval(ltData[element.id].iconAnimInterval);
		ltData[element.id].iconAnimInterval = setInterval(function() {
			const rot = Math.sin(animIndex/20) * 8;
			const scale = 1 + (Math.abs(((animIndex/80) % 2) - 1) - 0.5) * 0.1; // Triangle Wave
			element.style["-webkit-transform"] = "rotate(" + rot + "deg) scale(" + scale + ")";
			animIndex++;
		}, 10);
	};

	function stopIconAnim(element) {
		clearInterval(ltData[element.id].iconAnimInterval);
		element.style["-webkit-transform"] = "rotate(0deg) scale(1)";
	}

	function makeLastChild(element) {
		var tempDiv = element.parentNode.appendNew(["div"]);
		element.parentNode.insertBefore(element, tempDiv);
		element.parentNode.removeChild(tempDiv);
	}

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

	function play(non) {
		document.getElementById("title").innerHTML = "";
		const height = non.height,
			width = non.width,
			title = document.getElementById("title");
		if (non.title !== null) {
			title.appendNew(["h2", { "id": "name" }, non.title]);
			title.appendNew(["h3", { "id": "author" }, "By " + non.by]);
		}

		if (non.tutorial !== null) {
			title.appendNew(["div", { "id": "tutorial" }, non.tutorial]);
		}

		const board = document.getElementById("board"),
			table = board.appendNew(["table"]),
			tool = document.getElementById("tool") || board.parentNode.appendNew(["div", {"id": "tool"}]),
			home = document.getElementById("home") || board.parentNode.appendNew(["div", {"id": "home"}]),
			fadeDiv = document.getElementById("LevelFadeTransition");
		tool.appendNew(["input", {"type": "checkbox", "id": "flag"}]);
		tool.appendNew(["lable", {"for": "flag"}, "Flag"]);
		const hb = home.appendNew(["button", {"id": "homeButton"}, "Home"]);
		hb.addEventListener("click", doFadeToLS, false);

		makeLastChild(fadeDiv);


		var tr = table.appendNew(["thead"]).appendNew(["tr"]);
		tr.appendNew(["th"]);
		for (var i = 0; i < width; i++) {
			const th = tr.appendNew(["th", non.columns[i][0]]);
			for(var j = 1; j < non.columns[i].length; j++) {
				th.appendNew(["br"]);
				th.appendNew(non.columns[i][j]);
			}
		}

		const tbody = table.appendNew(["tbody"]);
		var buttons = [];
		for (var i = 0; i < height; i++) {
			buttons.push([]);
			var tr = tbody.appendNew(["tr"]);
			tr.appendNew(["th", non.rows[i].join(" ")]);
			for (var j = 0; j < width; j++) {
				buttons[i].push(tr.appendNew(["td"]).appendNew(["button", {
					"class": "boardButton",
					"data-pos": j + "," + i,
					"data-state": "unpressed"
				}]));
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
				goal: null,
				tutorial: null
			};
		const keys = ["catalogue", "title", "by", "copyright", "license", "width", "height", "goal", "tutorial"];
		for (var i = 0; i < non.length; i++) {
			for (var j = 0; j < keys.length; j++) {
				if (non[i].startsWith(keys[j])) {
					obj[keys[j]] = non[i].substring(keys[j].length + 1).match(/[^"]+/g)[0];
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
		var buttonsBool = [];
		for(var i = 0; i < buttons.length; i++){
			buttonsBool.push([]);
			for(var j = 0; j < buttons[i].length; j++) {
				buttonsBool[i].push(buttons[i][j].getAttribute("data-state") == "pressed");
			}
		}

		// Function to check if a sequence matches the hints
		function matchesHints(sequence, hints) {
			var myHints = hints.slice(),
				hintsIndex = 0;
			for(var i = 0; i < sequence.length; i++) {
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
			}
			if (hintsIndex < myHints.length && myHints[myHints.length - 1] != 0) {
				return false;
			}

			return true;
		}

		// Check rows
		for (var rowIndex = 0; rowIndex < buttonsBool.length; rowIndex++) {
			if (!matchesHints(buttonsBool[rowIndex], non.rows[rowIndex])) {
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

	function doFadeAndStart(lt) {
		const ls = document.getElementById("levelSelect") || document.getElementById("bottom-screen").appendNew(["div", {"id": "levelSelect"}]);
		const fadeDiv = ls.parentNode.appendNew(["div", {"id": "LevelFadeTransition", "style": "display: none;"}]);
		makeLastChild(fadeDiv);
		var fadeTimer = 0;
		const fadeTimeout = setInterval(function() {
			fadeDiv.style.opacity = Math.min(1.25 - Math.abs((fadeTimer/40) - 1), 1);
			fadeDiv.style.display = "block";
			if(fadeTimer == 30){
				try {
					ls.parentNode.removeChild(ls);
				} catch(err) {
					return;
				}
				var groupName = lt.getElementsByClassName("LevelGroupName")[0].innerHTML;
				var levelNum = lt.getElementsByClassName("LevelNumber")[0].innerHTML;
				net.httpGet("boards/" + groupName + "-" + levelNum + ".non", function(status, text){
					if(status == 404){
						alert("Request failed; Attempting to load demo.non instead");
						net.httpGet("boards/demo.non", function(status, text){play(parseNon(text)); fadeTimer++;});
					} else {
						play(parseNon(text));
						fadeTimer++;
					}
				});
			}else if(fadeTimer == 90) {
				clearInterval(fadeTimeout);
				fadeDiv.parentNode.removeChild(fadeDiv);
			} else {
				fadeTimer++;
			}
		}, 10);
	}

	function doFadeToLS() {
		const fadeDiv = board.parentNode.appendNew(["div", {"id": "LevelFadeTransition", "style": "display: none;"}]);
		makeLastChild(fadeDiv);
		var fadeTimer = 0;
		const fadeTimeout = setInterval(function() {
			fadeDiv.style.opacity = Math.min(1.25 - Math.abs((fadeTimer/40) - 1), 1);
			fadeDiv.style.display = "block";
			if(fadeTimer == 30){
				showLevelSelect();
				makeLastChild(fadeDiv);
			}else if(fadeTimer == 90) {
				clearInterval(fadeTimeout);
				fadeDiv.parentNode.removeChild(fadeDiv);
			}

			fadeTimer++;
		}, 10);
	}

	function showLevelSelect() {
		document.getElementById("title").innerHTML = currentNews;
		document.getElementById("board").innerHTML = "";
		document.getElementById("winMessage").innerHTML = "";
		var tool = document.getElementById("tool"),
			home = document.getElementById("home");
		if(tool) {
			tool.parentNode.removeChild(tool);
		}
		if(home) {
			home.parentNode.removeChild(home);
		}

		buttonSelectX = 0;
		buttonSelectY = 0;
		const ls = document.getElementById("levelSelect") || document.getElementById("bottom-screen").appendNew(["div", {"id": "levelSelect"}]),
			table = ls.appendNew(["table", {"id": "levelSelectTable"}]),
			groupNames = ["Tutorial", "Easy", "Medium", "Hard"],
			groupColors = ["#80B0FF", "#20D020", "#FFFF20", "#FF4040"];
		ltData = {};
		var levelTiles = [];
		for(var i = 0; i < 4; i++) {
			const tr = table.appendNew(["tr"]);
			for(var j = 0; j < 5; j++) {
				const lt = table.appendNew(["td"]).appendNew(["div", {"class": "LevelTile", "id": "lt_" + j + "," + i}]);
				lt.style["background-color"] = groupColors[i];
				lt.appendNew(["div", {"class": "LevelGroupName"}, groupNames[i]]);
				lt.appendNew(["div", {"class": "LevelNumber"}, (j+1).toString()]);
				ltData[lt.id] = {
					startOnClick: false,
					iconAnimInterval: null
				};
				lt.addEventListener("click", function(event) {
					var lt = event.target;
					if(! lt.id.startsWith("lt_")) {
						lt = lt.parentNode;
					}
					if(ltData[lt.id].startOnClick) {
						doFadeAndStart(lt);
					} else {
						buttonSelectX = parseInt(lt.id[3]);
						buttonSelectY = parseInt(lt.id[5]);
						for(var i = 0; i < levelTiles.length; i++) {
							stopIconAnim(levelTiles[i]);
							ltData[levelTiles[i].id].startOnClick = false;
						}
						ltData[lt.id].startOnClick = true;
						startIconAnim(lt);
					}
				}, false);
				levelTiles.push(lt);
			}
		}
	}

	function levelSelectButton(button) {
		const oldSelectedLevel = document.getElementById("lt_" + buttonSelectX + "," + buttonSelectY);
		if(!oldSelectedLevel) {
			return;
		}

		if(button == "A") {
			const selectedLevel = document.getElementById("lt_" + buttonSelectX + "," + buttonSelectY);
			doFadeAndStart(selectedLevel);
			return;
		}

		stopIconAnim(oldSelectedLevel);

		if(button == "Up") {
			buttonSelectY -= 1;
		}
		if(button == "Down") {
			buttonSelectY += 1;
		}
		if(button == "Left") {
			buttonSelectX -= 1;
		}
		if(button == "Right") {
			buttonSelectX += 1;
		}

		if(buttonSelectX > 4) {
			buttonSelectX = 4;
		}
		if(buttonSelectX < 0) {
			buttonSelectX = 0;
		}
		if(buttonSelectY > 3) {
			buttonSelectY = 3;
		}
		if(buttonSelectY < 0) {
			buttonSelectY = 0;
		}

		const newSelectedLevel = document.getElementById("lt_" + buttonSelectX + "," + buttonSelectY);
		startIconAnim(newSelectedLevel);
	}
	currentNews = document.getElementById("title").innerHTML;
	onBtnJustPressed("A", function() {levelSelectButton("A");});
	onBtnJustPressed("Up", function() {levelSelectButton("Up");});
	onBtnJustPressed("Down", function() {levelSelectButton("Down");});
	onBtnJustPressed("Left", function() {levelSelectButton("Left");});
	onBtnJustPressed("Right", function() {levelSelectButton("Right");});
	showLevelSelect();
}, false);
