/*
TODO:
 - Change onclick string handler over to function
*/
window.addEventListener('load', function() {
    function generateMaze(rows, cols) {
        var maze = [];
        for(var i = 0; i < rows; i++) {
            maze[i] = [];
            for(var j = 0; j < cols; j++) {
                maze[i][j] = {
                    inMaze: false,
                    inPath: false,
                    top: true,
                    bottom: true,
                    left: true,
                    right: true
                };
            }
        }

        // Wilson's algorithm

        /*
            This algorithm gaurentees that there is
            exactly one path between any two points.
        */

        function addPath() {
            var row, col, path = [];

            do {
                if(path.length == 0) {
                    do {
                        row = Math.floor(Math.random() * rows);
                        col = Math.floor(Math.random() * cols);
                    } while(maze[row][col].inMaze);

                    maze[row][col].inPath = true;

                    path.push([row, col]);
                }

                var dir = Math.floor(Math.random() * 4);
                
                switch(dir) {
                    case 0: { // up
                        if(row - 1 < 0) continue;
                        maze[row][col].top = false;
                        row--;
                    } break;

                    case 1: { // down
                        if(row + 1 >= rows) continue;
                        maze[row][col].bottom = false;
                        row++;
                    } break;

                    case 2: { // left
                        if(col - 1 < 0) continue;
                        maze[row][col].left = false;
                        col--;
                    } break;

                    case 3: { // right
                        if(col + 1 >= cols) continue;
                        maze[row][col].right = false;
                        col++;
                    } break;
                }

                if(maze[row][col].inPath) {
                    var pos;
                    do {
                        pos = path.pop();
                        maze[pos[0]][pos[1]].inPath = false;
                        maze[pos[0]][pos[1]].top = true;
                        maze[pos[0]][pos[1]].bottom = true;
                        maze[pos[0]][pos[1]].left = true;
                        maze[pos[0]][pos[1]].right = true;
                    } while(row != pos[0] || col != pos[1])

                    if(path.length > 0) {
                        row = path[path.length - 1][0];
                        col = path[path.length - 1][1];
                    }
                    
                    continue;
                }

                maze[row][col].inPath = true;

                path.push([row,col]);

                switch(dir) {
                    case 0: { // up
                        maze[row][col].bottom = false;
                    } break;

                    case 1: { // down
                        maze[row][col].top = false;
                    } break;

                    case 2: { // left
                        maze[row][col].right = false;
                    } break;

                    case 3: { // right
                        maze[row][col].left = false;
                    } break;
                }
            } while(!maze[row][col].inMaze);

            for(var i = 0; i < path.length; i++) {
                maze[path[i][0]][path[i][1]].inPath = false;
                maze[path[i][0]][path[i][1]].inMaze = true;
            }
        }

        var startRow = Math.floor(Math.random() * rows);
        var startCol = Math.floor(Math.random() * cols);

        maze[startRow][startCol].inMaze = true;

        var done = false;
        do {
            addPath();

            done = true;
            for(var i = 0; i < rows && done; i++) {
                for(var j = 0; j < cols && done; j++) {
                    if(!maze[i][j].inMaze) {
                        var done = false;
                    }
                }
            }
        } while(!done);

        for(var i = 0; i < maze.length; i++) {
            for(var j = 0; j < maze[i].length; j++) {
                if(i > 0) {
                    maze[i][j].top = maze[i][j].top || maze[i - 1][j].bottom;
                }

                if(i < maze.length - 1) {
                    maze[i][j].bottom = maze[i][j].bottom || maze[i + 1][j].top;
                }

                if(j > 0) {
                    maze[i][j].left = maze[i][j].left || maze[i][j - 1].right;
                }

                if(j < maze[i].length - 1) {
                    maze[i][j].right = maze[i][j].right || maze[i][j + 1].left;
                }
            }
        }

        return maze;
    }

    function generateCellLabel(row, col) {
        var colLabel = "";

        while(col >= 0) {
            colLabel = String.fromCharCode(65 + (col % 26)) + colLabel;
            col = Math.floor(col / 26) - 1;
        }

        return colLabel + (row + 1);
        
    }

    function createMazeDisplay(screen, rows, cols, maze) {
        const containerStyle = getComputedStyle(document.getElementsByClassName(screen + "-maze-container")[0]);
        
        const screenWidth = containerStyle.width.match(/\d+/)[0];
        const screenHeight = is3DS() && screen == "bottom" ? window.innerHeight : containerStyle.height.match(/\d+/)[0];

        const table = document.getElementById(screen + "-maze-table");

        var cellSize;
        
        if(rows / cols < (screenHeight - 20) / (screenWidth - 20)) {
            cellSize = (screenWidth - 20) / cols;

            table.applyStyle({
                width: (screenWidth - 20) + "px",
                height: (rows * cellSize) + "px",
                marginLeft: "10px",
                marginTop: ((screenHeight - (rows * cellSize)) / 2) + "px"
            });
        } else {
            cellSize = (screenHeight - 20) / rows;

            table.applyStyle({
                width: (cols * cellSize) + "px",
                height: (screenHeight - 20) + "px",
                marginLeft: ((screenWidth - (cols * cellSize)) / 2) + "px",
                marginTop: "10px"
            });
        }

        const tbody = document.getElementById(screen + "-maze-tbody");

        while(tbody.childNodes.length) tbody.removeChild(tbody.childNodes[0]);

        const sides = ["top", "bottom", "left", "right"];

        const mazeCells = [];
        const mazeImages = [];

        for(var i = 0; i < rows; i++) {
            const tr = tbody.appendNew(["tr"]);
            mazeCells[i] = [];
            mazeImages[i] = [];
            for(var j = 0; j < cols; j++) {
                const imgSize = is3DS() ? cellSize - 1 : cellSize;

                const td = tr.appendNew([
                    "td", 
                    {
                        style: {
                            width: cellSize + "px",
                            height: cellSize + "px",
                            "background-color": "#FFFFFF"
                        }
                    },
                    [
                            "img",
                            {
                                style: {
                                    width: imgSize + "px",
                                    height: maze ? "100%" : imgSize + "px"
                                },
                                src: "images/empty.png",
                                alt: generateCellLabel(i, j),
                                onclick: (maze ? "selectTile" : "selectZoomedTile") + "(" + i + ", " + j + ");"
                            }
                    ]
                ]);

                if(maze) {
                    const tdStyle = {};

                    for(var d = 0; d < 4; d++) {
                        if(maze[i][j][sides[d]]) {
                            tdStyle["border-" + sides[d]] = "1px solid black";
                        }
                    }

                    td.applyStyle(tdStyle);
                }

                mazeCells[i][j] = td;
                mazeImages[i][j] = td.childNodes[0];
            }
        }

        return {cells: mazeCells, images: mazeImages};
    }

    function updateZoomedDisplay() {
        function applyZoomedCellStyles() {
            for(var i = 0; i < zoomedRows; i++) {
                for(var j = 0; j < zoomedCols; j++) {
                    if(cellStyles[i][j]) {
                        zoomedCells[i][j].applyStyle(cellStyles[i][j]);
                    }
                }
            }
        }
        if(zoomedRows % 2 == 0 || zoomedCols % 2 == 0) {
            console.error("Rows and cols in zoomed display must be even");
            return;
        }

        const sides = ["top", "bottom", "left", "right"];

        const cellStyles = [];

        var neededImages = 0;

        var loadedImages = 0;

        for(var i = 0; i < zoomedRows; i++) {
            cellStyles[i] = [];
            for(var j = 0; j < zoomedCols; j++) {
                var mazeRow = i + prow - Math.floor(zoomedRows / 2);
                var mazeCol = j + pcol - Math.floor(zoomedCols / 2);

                if(mazeRow >= 0 && mazeCol >= 0 && mazeRow < rows && mazeCol < cols) {
                    const cellStyle = {"background-color": "#FFFFFF"};

                    for(var d = 0; d < 4; d++) {
                        if(maze[mazeRow][mazeCol][sides[d]]) {
                            cellStyle["border-" + sides[d]] = "thin solid black";
                        } else {
                            cellStyle["border-" + sides[d]] = "";
                        }
                    }

                    cellStyles[i][j] = cellStyle;

                    if(mazeImages[mazeRow][mazeCol].src != zoomedImages[i][j].src) {
                        zoomedImages[i][j].onload = function() {
                            loadedImages++;
                            if(loadedImages == neededImages) {
                                applyZoomedCellStyles();
                            }
                        };
                    
                        zoomedImages[i][j].src = mazeImages[mazeRow][mazeCol].src;

                        neededImages++;
                    }
                } else {
                    cellStyles[i][j] = {
                        "border-top": "",
                        "border-bottom": "",
                        "border-left": "",
                        "border-right": "",
                        "background-color": ""
                    };

                    zoomedImages[i][j].src = "images/empty.png";
                }
            }
        }

        if(neededImages == 0) applyZoomedCellStyles();
    }

    function updateMainDisplay() {
        if(pathNum == 0) {
            mazeImages[prow][pcol].src = "images/dot.png"
        } else {
            for(var i = 0; i < rows; i++) {
                for(var j = 0; j < cols; j++) {
                    mazeImages[i][j].src = getLineImage(path[i][j]);
                }
            }
        }

        if(!hasWon) {
            mazeImages[grow][gcol].src = "images/goal.png";
        }
    }

    function generatePathArray(rows, cols) {
        var path = [];
        for(var i = 0; i < rows; i++) {
            path[i] = [];
            for(var j = 0; j < cols; j++) {
                path[i][j] = {
                    pathNum: -1,
                    up: false,
                    down: false,
                    left: false,
                    right: false
                };
            }
        }

        return path;
    }

    function getGoalPos(rows, cols, prow, pcol) {
        function countWalls(walls) {
            const sides = ["top", "bottom", "left", "right"];
            var count = 0;
            for(var i = 0; i < 4; i++) {
                if(walls[sides[i]]) {
                    count++;
                }
            }
            return count;
        }

        var frow = prow;
        var fcol = pcol;
        var fdist = 0;

        /*
        Try at least 5 different points, keep picking until
        the distance is at least half of the maze diagonal
        or it has tried 50 different points and the point
        isn't on top of the player
        */
        
        const minDist = Math.sqrt(Math.pow((rows - 1) / 2, 2) + Math.pow((cols - 1) / 2, 2)) / 2;

        for(var i = 0; i < 5 || (fdist < minDist && (i < 50 || (frow == prow && fcol == pcol))); i++) {
            // Keep picking until the spot is in a corner
            var trow, tcol;
            do {
                trow = Math.floor(Math.random() * rows);
                tcol = Math.floor(Math.random() * cols);
            } while(countWalls(maze[trow][tcol]) < 3);

            var tdist = Math.sqrt(Math.pow(prow - trow, 2) + Math.pow(pcol - tcol, 2));
            if(tdist > fdist) {
                frow = trow;
                fcol = tcol;
                fdist = tdist;
            }
        }

        return {
            row: frow,
            col: fcol
        };
    }

    function getLineImage(sides) {
        var imageName = "";

        if(sides.up) imageName += 't';

        if(sides.down) imageName += 'b';

        if(sides.left) imageName += 'l';

        if(sides.right) imageName += 'r';

        switch(imageName.length) {
            case 0: {
                return "images/empty.png";
            }

            case 1: case 2: {
                return "images/" + imageName + ".png";
            }

            default: {
                return "images/error.png";
            }
        }
    }

    function smoothstep(x) {
        return 3 * x * x - 2 * x * x * x;
    }

    function showMenu(menuText) {
        menuShown = true;
        
        document.getElementById("zoom-in").disabled = true;
        document.getElementById("zoom-out").disabled = true;
        document.getElementById("menu-button").disabled = true;
        document.getElementById("swap-screens").disabled = true;

        document.getElementById("menu-overlay").style.display = "block";
        document.getElementById("menu-box").style.display = "block";

        document.getElementById("menu-text").textContent = menuText;

        document.getElementsByName("rows-slider")[0].value = rows;
        document.getElementsByName("cols-slider")[0].value = cols;
        document.getElementById("rows-slider-number").textContent = rows;
        document.getElementById("cols-slider-number").textContent = cols;
        sliderValues.rows = rows;
        sliderValues.cols = cols;
    }

    function hideMenu() {
        menuShown = false;
        
        document.getElementById("zoom-in").disabled = false;
        document.getElementById("zoom-out").disabled = false;
        document.getElementById("menu-button").disabled = false;
        document.getElementById("swap-screens").disabled = false;

        document.getElementById("menu-overlay").style.display = "none";
        document.getElementById("menu-box").style.display = "none";
    }

    function startGame() {
        maze = generateMaze(rows, cols);

        const mazeDisplay = createMazeDisplay(mainDisplay, rows, cols, maze);

        mazeCells = mazeDisplay.cells;
        mazeImages = mazeDisplay.images;

        const zoomedDisplay = createMazeDisplay(subDisplay, zoomedRows, zoomedCols);

        zoomedCells = zoomedDisplay.cells;
        zoomedImages = zoomedDisplay.images;

        path = generatePathArray(rows, cols);

        pathNum = 0;

        // Bias starting position towards the edges
        prow = Math.floor(smoothstep(Math.random()) * rows);
        pcol = Math.floor(smoothstep(Math.random()) * cols);

        const goalPos = getGoalPos(rows, cols, prow, pcol);

        grow = goalPos.row;
        gcol = goalPos.col;

        hasWon = false;

        mazeImages[grow][gcol].src = "images/goal.png";

        mazeImages[prow][pcol].src = "images/dot.png";
        path[prow][pcol].pathNum = pathNum;

        updateZoomedDisplay();
    }

    if(isDS() || isDSi()) {
        // These browsers seem to argue that 40px + 240px + 40px > 320px
        document.getElementsByClassName("bottom-maze-container")[0].style.width = "230px";
    }

    var mainDisplay = "bottom";
    var subDisplay = "top";

    var rows = 10;
    var cols = 10;

    var zoomedRows = 5;
    var zoomedCols = 9;

    var menuShown = false;

    var sliderValues = {
        rows: rows,
        cols: cols
    };

    var maze;

    var mazeCells, mazeImages;

    var zoomedCells, zoomedImages;

    var path;

    var pathNum;

    var prow, pcol;

    var grow, gcol;

    var hasWon;
    
    startGame();

    // Global functions so they can be called by onclick event handlers
    selectTile = function(trow, tcol, fromButton) {
        if(menuShown) return;
        
        if(trow < 0 || tcol < 0 || trow >= rows || tcol >= cols) return;

        if(path[trow][tcol].pathNum == -1) {
            if(!(trow - prow) != !(tcol - pcol)) {
                // Extend the line one or more spaces in a single direction
                
                const drow = Math.sign(trow - prow);
                const dcol = Math.sign(tcol - pcol);

                const dir = ((3 * drow) + dcol + 3) / 2; // 0 = up, 1 = left, 2 = right, 3 = down

                var tempRow = prow;
                var tempCol = pcol;
                while(tempRow != trow || tempCol != tcol) {
                    if(maze[tempRow][tempCol][["top", "left", "right", "bottom"][dir]]) {
                        // Can't move through a wall
                        return;
                    }

                    tempRow += drow;
                    tempCol += dcol;
                }

                if(path[prow + drow][pcol + dcol].pathNum != -1) {
                    do {
                        // Erase the line if it already exists
                        path[prow][pcol].pathNum = -1;
                        path[prow][pcol].up = false;
                        path[prow][pcol].down = false;
                        path[prow][pcol].left = false;
                        path[prow][pcol].right = false;

                        mazeImages[prow][pcol].src = getLineImage(path[prow][pcol]);

                        prow += drow;
                        pcol += dcol;

                        pathNum--;
                    } while(path[prow + drow][pcol + dcol].pathNum != -1);

                    path[prow][pcol][["down", "right", "left", "up"][dir]] = false;
                }

                while(prow != trow || pcol != tcol) {
                    path[prow][pcol][["up", "left", "right", "down"][dir]] = true;

                    mazeImages[prow][pcol].src = getLineImage(path[prow][pcol]);

                    prow += drow;
                    pcol += dcol;

                    path[prow][pcol][["down", "right", "left", "up"][dir]] = true;

                    path[prow][pcol].pathNum = ++pathNum;
                }

                mazeImages[trow][tcol].src = getLineImage(path[prow][pcol]);
            }

            if(!hasWon && prow == grow && pcol == gcol) {
                hasWon = true;
                showMenu("You Win!");
            }
        } else if(!(fromButton && path[prow][pcol].pathNum > path[trow][tcol].pathNum + 1)) {
            // Backtrack along the line

            var dirName;

            while(path[prow][pcol].pathNum > path[trow][tcol].pathNum) {
                path[prow][pcol].pathNum = -1;
                path[prow][pcol].up = false;
                path[prow][pcol].down = false;
                path[prow][pcol].left = false;
                path[prow][pcol].right = false;

                mazeImages[prow][pcol].src = getLineImage(path[prow][pcol]);

                if(prow > 0 && path[prow - 1][pcol].pathNum == pathNum - 1) {
                    prow = prow - 1;
                    dirName = "down";
                } else if(prow < rows - 1 && path[prow + 1][pcol].pathNum == pathNum - 1) {
                    prow = prow + 1;
                    dirName = "up";
                } else if(pcol > 0 && path[prow][pcol - 1].pathNum == pathNum - 1) {
                    pcol = pcol - 1;
                    dirName = "right";
                } else if(pcol < cols - 1 && path[prow][pcol + 1].pathNum == pathNum - 1) {
                    pcol = pcol + 1;
                    dirName = "left";
                } else {
                    console.error("Unable to find connecting path");
                    return;
                }

                pathNum--;
            }

            path[prow][pcol][dirName] = false;

            if(pathNum > 0) {
                mazeImages[prow][pcol].src = getLineImage(path[prow][pcol]);
            } else {
                mazeImages[prow][pcol].src = "images/dot.png";
            }
        }

        updateZoomedDisplay();
    };

    selectZoomedTile = function(zrow, zcol) {
        selectTile(zrow + prow - Math.floor(zoomedRows / 2), zcol + pcol - Math.floor(zoomedCols / 2));
    }

    // Button input
    document.addEventListener('keydown', function(e) {
		e.preventDefault();
		const k = e.keyCode;

		if (isButton(k, 'left')) {
			selectTile(prow, pcol - 1, true);
		} else if (isButton(k, 'up')) {
			selectTile(prow - 1, pcol, true);
		} else if (isButton(k, 'right')) {
			selectTile(prow, pcol + 1, true);
		} else if (isButton(k, 'down')) {
			selectTile(prow + 1, pcol, true);
		}
	}, false);

    // Bottom Screen Controls
    document.getElementById("zoom-in").addEventListener("click", function() {
        if(zoomedRows > 3 && zoomedCols > 3) {
            zoomedRows -= 2;
            
            if(subDisplay == "top") {
                zoomedCols = Math.floor(Math.ceil(zoomedRows * 9 / 5) / 2) * 2 + 1;
            } else {
                zoomedCols = zoomedRows;
            }

            const zoomedDisplay = createMazeDisplay(subDisplay, zoomedRows, zoomedCols);

            zoomedCells = zoomedDisplay.cells;
            zoomedImages = zoomedDisplay.images;

            updateZoomedDisplay();
        }
    }, false);

    document.getElementById("zoom-out").addEventListener("click", function() {
        if(zoomedRows <= rows * 2 + 2 && zoomedCols <= cols + 2) {
            zoomedRows += 2;
            
            if(subDisplay == "top") {
                zoomedCols = Math.floor(Math.ceil(zoomedRows * 9 / 5) / 2) * 2 + 1;
            } else {
                zoomedCols = zoomedRows;
            }

            const zoomedDisplay = createMazeDisplay(subDisplay, zoomedRows, zoomedCols);

            zoomedCells = zoomedDisplay.cells;
            zoomedImages = zoomedDisplay.images;

            updateZoomedDisplay();
        }
    }, false);

    document.getElementById("swap-screens").addEventListener("click", function() {
        const tempDisplay = mainDisplay;
        mainDisplay = subDisplay;
        subDisplay = tempDisplay;

        if(subDisplay == "top") {
            zoomedCols = Math.floor(Math.ceil(zoomedRows * 9 / 5) / 2) * 2 + 1;
        } else {
            zoomedCols = zoomedRows;
        }

        const mazeDisplay = createMazeDisplay(mainDisplay, rows, cols, maze)

        mazeCells = mazeDisplay.cells;
        mazeImages = mazeDisplay.images;

        const zoomedDisplay = createMazeDisplay(subDisplay, zoomedRows, zoomedCols);

        zoomedCells = zoomedDisplay.cells;
        zoomedImages = zoomedDisplay.images;

        updateMainDisplay();
        updateZoomedDisplay();
    }, false);

    document.getElementById("menu-button").addEventListener("click", function() {
        showMenu("Paused");
    }, false);

    function sliderUpdate(event) {
        const which = event.target.name.slice(0, 4);
        sliderValues[which] = event.target.value;
        document.getElementById(which + "-slider-number").textContent = sliderValues[which];
    }

    // Menu controls
    if(isDSi() || isDS()) {
        document.getElementsByName("rows-slider")[0].addEventListener("change", sliderUpdate, false);
        document.getElementsByName("cols-slider")[0].addEventListener("change", sliderUpdate, false);
    } else {
        document.getElementsByName("rows-slider")[0].addEventListener("input", sliderUpdate, false);
        document.getElementsByName("cols-slider")[0].addEventListener("input", sliderUpdate, false);
    }

    document.getElementById("close-menu").addEventListener("click", function() {
        hideMenu();
    }, false);

    document.getElementById("regenerate-button").addEventListener("click", function() {
        rows = sliderValues.rows;
        cols = sliderValues.cols;
        zoomedRows = Math.min(zoomedRows, rows);
        zoomedCols = Math.min(zoomedCols, cols);

        hideMenu();
        startGame();
    }, false);

    

    if(is3DS()) { // TODO: This could be isNew3DS, but that function currently doesn't exist
        var currentHeight = window.innerHeight;
        setInterval(function() {
            if(window.innerHeight != currentHeight && (window.innerHeight == 212 || window.innerHeight == 240)) {
                currentHeight = window.innerHeight;
                if(mainDisplay == "bottom") {
                    const mazeDisplay = createMazeDisplay("bottom", rows, cols, maze);

                    mazeCells = mazeDisplay.cells;
                    mazeImages = mazeDisplay.images;
                    
                    updateMainDisplay();
                } else {
                    const zoomedDisplay = createMazeDisplay("bottom", zoomedRows, zoomedCols);

                    zoomedCells = zoomedDisplay.cells;
                    zoomedImages = zoomedDisplay.images;
                    
                    updateZoomedDisplay();
                }
            }
        });
    }
}, false);
