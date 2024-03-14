// Originally made by magiczocker10

window.addEventListener('load', function() {
    const field = document.getElementById('field'),
        minesDisplay = document.getElementById('mines'),
        timeDisplay = document.getElementById('time'),
        restartMsg = document.getElementById('restart-msg'),
        width = 9,
        height = 9,
        mines = 10,
        content = [
            ['', ''],
            ['1', '#0000F5'],
            ['2', '#377E22'],
            ['3', '#EA3323'],
            ['4', '#00007B'],
            ['5', '#75140C'],
            ['6', '#377E7F'],
            ['7', '#000'],
            ['8', '#808080']
        ];
    var lost = false,
        won = false,
        first = true,
        cells = [],
        time = 0,
        timeout;

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function getType(x, y) {
        const row = field.rows[y];
        if (!row) return false;
        return row.cells[x] ? row.cells[x].textContent : false;
    }

    function generate(excludeX, excludeY) {
        excludeX = excludeX || -1;
        excludeY = excludeY || -1;
        field.innerHTML = '';
        cells = [];

        /* generate cells */
        for (var y=0; y<height; y++) {
            const row = field.insertRow();
            for (var x=0; x<width; x++) {
                const cell = row.insertCell();
                if (!((excludeX === x) && (excludeY === y))) cells.push(cell);
            }
        }

        /* place bombs */
        for (var i=0; i<mines; i++) {
            var index = getRandomInt(cells.length);
            cells[index].textContent = 'o';
            cells[index].className += ' mine';
            cells.splice(index, 1);
        }

        /* update mine count */
        for (var y=0; y<height; y++) {
            for (var x=0; x<width; x++) {
                if (getType(x, y) !== 'o') {
                    var count = 0;
                    if (getType(x-1, y-1) === 'o') count++;
                    if (getType(x, y-1) === 'o') count++;
                    if (getType(x+1, y-1) === 'o') count++;
                    if (getType(x-1, y) === 'o') count++;
                    if (getType(x+1, y) === 'o') count++;
                    if (getType(x-1, y+1) === 'o') count++;
                    if (getType(x, y+1) === 'o') count++;
                    if (getType(x+1, y+1) === 'o') count++;
                    const cell = field.rows[y].cells[x];
                    if (count > 0) {
                        cell.style.color = content[count][1];
                        cell.textContent = content[count][0];
                    }
                }
            }
        }
    }

    function open(x, y) {
        if(!x || !y) return;

        const curType = field.rows[y].cells[x].textContent;
        field.rows[y].cells[x].className += ' open';
        if (curType !== '') return;
        const pos = [
            [x-1, y-1],
            [x,   y-1],
            [x+1, y-1],
            [x-1, y],
            [x+1, y],
            [x-1, y+1],
            [x,   y+1],
            [x+1, y+1]
        ];
        for (var i=0; i<pos.length; i++) {
            const cell = field.rows[pos[i][1]] && field.rows[pos[i][1]].cells[pos[i][0]];
            if (cell && (cell.className.indexOf('open') < 0)) open(pos[i][0], pos[i][1]);
        }
    }

    function reset() {
        lost = false;
        won = false;
        first = true;
        time = 0;
        minesDisplay.textContent = mines;
        timeDisplay.textContent = '0 sec';
        restartMsg.style.visibility = '';
        generate();
        field.style.display = '';
    }
    reset();

    function updateTime() {
        if (first || won || lost) return setTimeout(updateTime, 1000);
        time = time + 1;
        timeDisplay.textContent = time + ' sec';
        timeout = setTimeout(updateTime, 1000);
    }
    timeout = setTimeout(updateTime, 1000);

    field.addEventListener('click', function(event) {
        if (won || lost) return;
        var cell = event.target;
        const row = cell.parentElement.rowIndex,
            column = cell.cellIndex;

        if (cell.className.indexOf('open') > 0) return;

        // Reset if first click is a bomb
        if (first && cell.textContent === 'o') {
            generate(column, row);
            cell = field.rows[row].cells[column];
        }

        // Open cell
        first = false;
        cell.className += ' open';
        if (cell.textContent === 'o') {
            restartMsg.style.visibility = "visible";
            cell.style.backgroundColor = '#EA3323';
            cell.style.borderColor = '#CD372E';
            lost = true;
            const all = field.querySelectorAll('td.mine');
            for (var i=0; i<all.length; i++) {
                all[i].className += ' open';
            }
            return;
        }
        open(column, row);
        const all = field.querySelectorAll('td:not(.open)');
        if (all.length === mines) {
            alert('You won!');
            won = true;
        }
    });

    onBtnJustPressed("a", function() {
        if(lost) reset();
    })
})