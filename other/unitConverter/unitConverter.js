window.addEventListener('load', function() {
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
    
    net.httpGet("json/conversions.json", function(status, text){
        window.conv = JSON.parse(text);
        const unitType = document.getElementById("unit-type");
        const keys = Object.keys(conv);
        for(var i = 0; i < keys.length; i++) {
            unitType.appendNew("option", {"value": keys[i]}, keys[i]);
        }
        updateInputUnit();
    });

    function getSingular(name) {
        return name.split('|')[0].split('/')[0];
    }

    function getPlural(name) {
        if(name.indexOf('/') != -1) {
            return name.replace('/', '');
        } else {
            return name.split('|')[1];
        }
    }

    function updateInputUnit() {
        const unitType = document.getElementById("unit-type"),
			inputUnitFrom = document.getElementById("input-unit-from"),
			inputUnitTo = document.getElementById("input-unit-to");
        inputUnitFrom.innerHTML = "";
        inputUnitTo.innerHTML = "";
        
        const keys = Object.keys(conv[unitType.value]);
        for(var i = 0; i < keys.length; i++) {
            inputUnitFrom.appendNew("option", {"value": keys[i]}, getPlural(keys[i]));
            inputUnitTo.appendNew("option", {"value": keys[i]}, getPlural(keys[i]));
        }

		updateUnitsFrom();
    }

	function updateUnitsFrom() {
		const unitFrom = document.getElementById("unit-from"),
			inputUnitFrom = document.getElementById("input-unit-from");

		unitFrom.innerHTML = getPlural(inputUnitFrom.value);
	}

	function convert() {
		const unitType = document.getElementById("unit-type"),
			inputUnitFrom = document.getElementById("input-unit-from"),
			inputUnitTo = document.getElementById("input-unit-to"),
			inputNum = document.getElementById("input-num"),
			outputNum = document.getElementById("output-num");
		
		var calculated = inputNum.value * conv[unitType.value][inputUnitTo.value] / conv[unitType.value][inputUnitFrom.value];

		calculated = calculated.toFixed(Math.max(Math.min(5 - Math.log(calculated), 5 - 1 / Math.log(calculated)), 0));
		
		if(calculated == 1) {
			outputNum.innerHTML = Number(calculated) + " " + getSingular(inputUnitTo.value);
		} else {
			outputNum.innerHTML = Number(calculated) + " " + getPlural(inputUnitTo.value);
		}
		
	}

	document.getElementById("unit-type").addEventListener("change", updateInputUnit);
	document.getElementById("input-unit-from").addEventListener("change", updateUnitsFrom);
	document.getElementById("btn-convert").addEventListener("click", convert);
	document.getElementById("input-num").addEventListener("change", function() {
		inputNum =document.getElementById("input-num");
		if(inputNum.value < 0) {
			inputNum.value = 0;
		}
	});
});

