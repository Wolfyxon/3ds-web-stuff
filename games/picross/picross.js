Element.prototype.appendNew = function (
  tagname,
  content = "",
  attributes = {},
) {
  var elem = document.createElement(tagname);
  elem.innerHTML = content;
  for (attribute in attributes) {
    elem[attribute] = attributes[attribute];
    elem.setAttribute(attribute, attributes[attribute]);
  }
  this.append(elem);
  return elem;
};

String.prototype.startsWith = function (str) {
  return this.substring(0, str.length) == str;
};

function boardClick(event) {
  console.log(event.target.getAttribute("data-pos"));
  if (
    event.target.getAttribute("data-state") != "flagged" && document.getElementById("flag").checked) {
    event.target.setAttribute("data-state", "flagged");
  } else if (event.target.getAttribute("data-state") == "unpressed") {
    event.target.setAttribute("data-state", "pressed");
  } else {
    event.target.setAttribute("data-state", "unpressed");
  }
}

const non = parseNon(document.getElementById("testfile").innerHTML);
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
    buttons[i].push(
      tr
        .appendNew("td")
        .appendNew("button", "", {
          class: "boardButton",
          "data-pos": j + "," + i,
          "data-state": "unpressed",
        }),
    );
    buttons[i][j].addEventListener("click", boardClick);
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
