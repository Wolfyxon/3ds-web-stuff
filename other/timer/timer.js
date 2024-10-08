window.addEventListener("load", function() {
    Element.prototype.appendNew = function(tagname, attributes1, attributes2) {
		/* Examples:
	        myElem.appendNew("div")  ->  myElem.innerHTML == "<div></div>"
	        myElem.appendNew("div", "Hello, world!")  ->  myElem.innerHTML == "<div>Hello, world!</div>"
	        myElem.appendNew("div", {id: "foo"})  ->  myElem.innerHTML == "<div id='foo'></div>"
	        myElem.appendNew("div", {id: "foo"}, "Hello, world!");  ->  myElem.innerHTML == "<div id='foo'>Hello, world!</div>"
	    */
		attributes1 = attributes1 || "";
		attributes2 = attributes2 || "";
		var content,
			attributes;
		if(typeof attributes1 === "object") {
			attributes = attributes1;
			content = attributes2;
		} else {
			attributes = {};
			content = attributes1;
		}

		var elem = document.createElement(tagname);
		if (tagname !== 'input') elem.innerHTML = content;
		for (var attribute in attributes) {
			if (attributes.hasOwnProperty(attribute)) {
				elem[attribute] = attributes[attribute];
				elem.setAttribute(attribute, attributes[attribute]);
			}
		}
		this.appendChild(elem);
		return elem;
	};

	Element.prototype.prependNew = function(tagname, attributes1, attributes2) {
		/* Examples:
	        myElem.prependNew("div")  ->  myElem.innerHTML == "<div></div>"
	        myElem.prependNew("div", "Hello, world!")  ->  myElem.innerHTML == "<div>Hello, world!</div>"
	        myElem.prependNew("div", {id: "foo"})  ->  myElem.innerHTML == "<div id='foo'></div>"
	        myElem.prependNew("div", {id: "foo"}, "Hello, world!");  ->  myElem.innerHTML == "<div id='foo'>Hello, world!</div>"
	    */
		attributes1 = attributes1 || "";
		attributes2 = attributes2 || "";
		var content,
			attributes;
		if(typeof attributes1 === "object") {
			attributes = attributes1;
			content = attributes2;
		} else {
			attributes = {};
			content = attributes1;
		}

		var elem = document.createElement(tagname);
		if (tagname !== 'input') elem.innerHTML = content;
		for (var attribute in attributes) {
			if (attributes.hasOwnProperty(attribute)) {
				elem[attribute] = attributes[attribute];
				elem.setAttribute(attribute, attributes[attribute]);
			}
		}
		this.insertBefore(elem, this.childNodes[0]);
		return elem;
	};
    
    const timeDisplay = document.getElementById("time-display"),
        appControls = document.getElementById("app-controls"),
        tabTimer = document.getElementById("tab-timer"),
        tabStopwatch = document.getElementById("tab-stopwatch");
	// Elements
    var timeSelect, hourSelect, minuteSelect, secondSelect, timerButtons, timerStartButton, timerStopButton, stopwatchButtons, stopwatchStartButton, stopwatchLapButton, stopwatchStopButton, stopwatchLapTable;
	// Misc variables
	var activeTab, timerInterval, flashInterval, stopwatchInterval, stopwatchStartTime, stopwatchPausedTime, stopwatchLapTime, stopwatchLapNumber;
    openTab("timer");
    
    tabTimer.addEventListener("click", function() {
        tabTimer.setAttribute("data-selected", "true");
        tabStopwatch.setAttribute("data-selected", "false");
        openTab("timer");
    }, false);
    
    tabStopwatch.addEventListener("click", function() {
        tabStopwatch.setAttribute("data-selected", "true");
        tabTimer.setAttribute("data-selected", "false");
		stopTimer(false);
        openTab("stopwatch");
    }, false);

    function openTab(tabName) {
		if(tabName == activeTab) return;
        activeTab = tabName;
        if(tabName == "timer") {
			clearInterval(stopwatchInterval);
			appControls.innerHTML = "";
			timeDisplay.innerHTML = "";
			timeDisplay.innerText = timerTime(0, 0, 0);
            timeSelect = appControls.appendNew("div", {"id": "time-select"});
            hourSelect = timeSelect.appendNew("select");
            for(var i = 0; i < 24; i++) {
                hourSelect.appendNew("option", {"value": i.toString()}, i.toString());
            }
            
            timeSelect.appendNew("div", ":");
            
            minuteSelect = timeSelect.appendNew("select");
            for(var i = 0; i < 60; i++) {
                minuteSelect.appendNew("option", {"value": i.toString()}, ("0" + i).slice(-2));
            }
            
            timeSelect.appendNew("div", ":");
            
            secondSelect = timeSelect.appendNew("select");
            for(var i = 0; i < 60; i++) {
                secondSelect.appendNew("option", {"value": i.toString()}, ("0" + i).slice(-2));
            }

            timerButtons = appControls.appendNew("div", {"id": "control-buttons"});

            timerStartButton = timerButtons.appendNew("button", "Start");
			timerStartButton.addEventListener("click", startTimer, false);
        } else if(tabName == "stopwatch") {
			resetStopwatch();
        }
    }

	function startTimer() {
		var hourValue = hourSelect.value,
			minuteValue = minuteSelect.value,
			secondValue = secondSelect.value;
		timerButtons.innerHTML = "";
		timerStopButton = timerButtons.appendNew("button", "Stop");
		timerStopButton.addEventListener("click", function() {stopTimer(false)}, false);
		timeDisplay.innerText = timerTime(hourValue, minuteValue, secondValue);
		timerInterval = setInterval(function() {
			if(secondValue == 0 && minuteValue == 0 && hourValue == 0) {
				stopTimer(true);
				return;
			}
			secondValue -= 1;
			if(secondValue < 0) {
				minuteValue -= 1;
				secondValue = 59;
			}
			if(minuteValue < 0) {
				hourValue -= 1;
				minuteValue = 59;
			}
			timeDisplay.innerText = timerTime(hourValue, minuteValue, secondValue);
		}, 1000);
	}

	function timerTime(hours, minutes, seconds) {
		if(hours > 0) {
			return hours + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
		}else if(minutes > 0) {
			return minutes + ":" + ("0" + seconds).slice(-2);
		} else {
			return seconds.toString();
		}
	}

	function stopTimer(alarm) {
		clearInterval(timerInterval);
		timeDisplay.innerText = timerTime(0, 0, 0);
		if(alarm) {
			timeDisplay.setAttribute("data-flashing", true)
		} else {
			if(timerButtons.contains(timerStopButton)) {
				timerButtons.innerHTML = "";
				timerStartButton = timerButtons.appendNew("button", "Start");
				timerStartButton.addEventListener("click", startTimer, false);
			}
			timeDisplay.setAttribute("data-flashing", false)
		}
	}

	function startStopwatch() {
		stopwatchStartTime = new Date().getTime();
		stopwatchPausedTime = 0;
		stopwatchLapTime = 0;
		stopwatchLapNumber = 1;
		resumeStopwatch();
	}

	function lapStopwatch() {
		const stopwatchEllapsedTime = stopwatchPausedTime + (new Date().getTime() - stopwatchStartTime),
			lapTime = stopwatchEllapsedTime - stopwatchLapTime;
		stopwatchLapTime = stopwatchEllapsedTime;
		const lapRow = stopwatchLapTable.prependNew("tr");
		lapRow.appendNew("td", "Lap " + stopwatchLapNumber);
		lapRow.appendNew("td", stopwatchTime(lapTime));
		lapRow.appendNew("td", stopwatchTime(stopwatchEllapsedTime));
		stopwatchLapNumber++;
	}

	function stopStopwatch() {
		stopwatchPausedTime += new Date().getTime() - stopwatchStartTime;
		clearInterval(stopwatchInterval);
		stopwatchButtons.innerHTML = "";
		stopwatchResetButton = stopwatchButtons.appendNew("button", "Reset");
		stopwatchResetButton.addEventListener("click", resetStopwatch, false);
		stopwatchResumeButton = stopwatchButtons.appendNew("button", {"style": "font-size: 21px; letter-spacing: 0px;"}, "Resume");
		stopwatchResumeButton.addEventListener("click", resumeStopwatch, false);
	}

	function resetStopwatch() {
		appControls.innerHTML = "";
		timeDisplay.innerHTML = stopwatchTime(0);
		stopwatchLapTable = appControls.appendNew("div", {"id": "stopwatch-laps"}).appendNew("table");
		stopwatchButtons = appControls.appendNew("div", {"id": "control-buttons"});

        stopwatchStartButton = stopwatchButtons.appendNew("button", "Start");
		stopwatchStartButton.addEventListener("click", startStopwatch, false);
	}

	function resumeStopwatch() {
		stopwatchStartTime = new Date().getTime();
		stopwatchButtons.innerHTML = "";
		stopwatchLapButton = stopwatchButtons.appendNew("button", "Lap");
		stopwatchLapButton.addEventListener("click", lapStopwatch, false);
		stopwatchStopButton = stopwatchButtons.appendNew("button", "Stop");
		stopwatchStopButton.addEventListener("click", stopStopwatch, false);
		stopwatchInterval = setInterval(updateStopwatch);
	}

	function updateStopwatch() {
		const stopwatchEllapsedTime = stopwatchPausedTime + (new Date().getTime() - stopwatchStartTime);
		timeDisplay.innerText = stopwatchTime(stopwatchEllapsedTime);
	}
	
	function stopwatchTime(stopwatchEllapsedTime) {
		const centiseconds = Math.floor(stopwatchEllapsedTime / 10) % 100,
			seconds = Math.floor(stopwatchEllapsedTime / 1000) % 60,
			minutes = Math.floor(stopwatchEllapsedTime / 60000);
		
		if(minutes > 0) {
			return minutes + ":" + ("0" + seconds).slice(-2) + "." + (centiseconds + "0").substring(0, 2);
		} else {
			return seconds + "." + (centiseconds + "0").substring(0, 2);
		}
	}
}, false);