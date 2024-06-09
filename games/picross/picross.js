function requestText(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  xhr.onload = function() {
    if (this.status === 200) {
      callback(this.responseText);
    } else {
      callback("Request failed with status " + this.status);
    }
  };

  xhr.onerror = function() {
    callback("Request failed after " + e.loaded + " bytes transfered");
  };

  xhr.send();
}

Element.prototype.appendNew = function(tagname, content, attributes) {
  content = content || "";
  attributes = attributes || {};
  var elem = document.createElement(tagname);
  elem.innerHTML = content;
  for (attribute in attributes) {
    elem[attribute] = attributes[attribute];
    elem.setAttribute(attribute, attributes[attribute]);
  }
  this.appendChild(elem);
  return elem;
};

Array.prototype.last = function(set) {
  if(set){
    this[this.length - 1] = set;
  } else {
    return this[this.length - 1];
  }
}

String.prototype.startsWith = function (str) { // This is a polyfill
  return this.substring(0, str.length) == str;
};

function boardClick(event, buttons, obj) {
  if (event.target.getAttribute("data-state") != "flagged" && document.getElementById("flag").checked) {
    event.target.setAttribute("data-state", "flagged");
  } else if (event.target.getAttribute("data-state") == "unpressed") {
    event.target.setAttribute("data-state", "pressed");
  } else {
    event.target.setAttribute("data-state", "unpressed");
  }
  console.log(hasWon(buttons, obj));
}

requestText("boards/demo.non", function(text){play(parseNon(text));});
function play(non){
  const height = non.height;
  const width = non.width;
  const title = document.getElementById("title");
  if (non.title !== null) {
    title.appendNew("h2", non.title, { id: "name" });
    title.appendNew("h3", "By " + non.by, { id: "author" });
  }

  const board = document.getElementById("board");
  const table = board.appendNew("table");
  var tr = table.appendNew("thead").appendNew("tr");
  tr.appendNew("th");
  for (var i = 0; i < width; i++) {
    tr.appendNew("th", non.columns[i].join("<br>"));
  }

  const tbody = table.appendNew("tbody");
  var buttons = [];
  for (var i = 0; i < height; i++) {
    buttons.push([]);
    tr = tbody.appendNew("tr");
    tr.appendNew("th", non.rows[i].join(" "));
    for (var j = 0; j < width; j++) {
      buttons[i].push(tr.appendNew("td").appendNew("div").appendNew("button", "", {class: "boardButton", "data-pos": j + "," + i, "data-state": "unpressed"}));
      buttons[i][j].addEventListener("click", function(event){boardClick(event, buttons, non);});
    }
  }
}

function parseNon(nonStr) {
  // bundling and the 'color' key are not supported
  var non = nonStr.split("\n");
  var obj = {catalogue: null, title: null, by: null, copyright: null, license: null, width: null, height: null, rows: [], columns: [], goal: null};
  const keys = ["catalogue", "title", "by", "copyright", "license", "width", "height", "goal"];
  for (var i = 0; i < non.length; i++) {
    for (var j = 0; j < keys.length; j++) {
      if (non[i].startsWith(keys[j])) {
        obj[keys[j]] = non[i].substr(keys[j].length + 1).match(/[^"]+/g)[0];
        break;
      }
      if (non[i].startsWith("rows")) {
        for (var j = 0; j < obj.height; j++) {
          i++;
          obj.rows.push(non[i].split(","));
        }
      }
      if (non[i].startsWith("columns")) {
        for (var j = 0; j < obj.width; j++) {
          i++;
          obj.columns.push(non[i].split(","));
        }
      }
    }
  }
  return obj;
}

function hasWon(buttons, non) {
  for(var i = 0; i < non.width; i++) {
    var ansIndex = 0;
    for(var j = 0; j < non.height; j++) {
      if(buttons[i][j].getAttribute("data-state") == "pressed"){
        if(ansIndex == non.cols[i].length){
          console.log("too many on " + i);
          return false;
        }
        var consec = 0;
        while(buttons[i][j].getAttribute("data-state") == "pressed" && j < non.height){
          j++;
          consec++;
        }
        if(consec != non.cols[i][ansIndex]) {
          console.log("Expected " + non.cols[i][ansIndex] + " got " + consec + " on " + i);
          return false;
        }
        ansIndex++;
      }
    }
  }
  console.log("cols passed");

  for(var i = 0; i < non.height; i++) {
    var ansIndex = 0;
    for(var j = 0; j < non.width; j++) {
      if(buttons[i][j].getAttribute("data-state") == "pressed"){
        if(ansIndex == non.rows[i].length){
          return false;
        }
        var consec = 0;
        while(buttons[i][j].getAttribute("data-state") == "pressed" && j < non.width){
          j++;
          consec++;
        }
        if(consec != non.rows[i][ansIndex]) {
          return false;
        }
        ansIndex++;
      }
    }
  }

  return true;
}
