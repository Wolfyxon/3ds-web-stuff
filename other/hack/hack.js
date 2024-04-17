const terminalTexts = [
    'rm -rf /* --no-preserve-root',
    'pacman -Syu',
    'sudo -s',
    'neofetch',
    'Hacking database',
    'Establishing connection',
    'Hi',
    'undefined',
    'Hello World!',
    'Goodbye World!',
    'Ah free at last',
    'A visitor. Hm indeed, I\'ve slept long enough.',
    'Rise and shine mr Freeman',
    'Get out',
    'kernel panic - not syncing: Attempted to kill inint !',
    'Uncaught ReferenceError: message is not defined',
    'Exception in thread \"main\" java.lang.NullPointerException',
    'Segmentation fault (core dumped)',
    'Fatal error: Unexpectedly found nil while unwrapping an Optional value',
    'ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near \'WHERE id=1\' at line 1',
    'System.NullReferenceException: Object reference not set to an instance of an object.',
    'panic: runtime error: index out of range [5] with length 3',
    'Type mismatch: inferred type is Int but String was expected',
    'thread \'main\' panicked at \'attempt to add with overflow\', src/main.rs:4:9',
    'for(int i = 0; i < sizeof(arr); i++) {}',
];

window.addEventListener('load', function() {
    const terminal = document.getElementById('terminal'),
        numbers = document.getElementById('numbers'),
        tileTbl = document.getElementById('tiles'),
        bars = document.getElementById('bars'),
        termLength = terminalTexts.length,
        barLength = 30;
    var tiles = [],
        lines = [],
        barTxt = '',
        tileLength;

    function ran(num) {
        return Math.floor(Math.random() * num);
    }

    function init() {
        // terminal
        for (var i=0; i<16; i++) {
            const line = document.createElement('div');
            terminal.appendChild(line);
        }

        // tiles
        const cols = 16,
            rows = 16;
        for (var row = 0; row < rows; row++) {
            const tr = tileTbl.insertRow();

            for (var col = 0; col < cols; col++) {
                tiles.push(tr.insertCell());
            }
        }
        tileLength = tiles.length;

        // bars
        for (var i=0; i<9; i++) {
            const bar = document.createElement('div');
            bars.appendChild(bar);
            lines.push(bar);
        }
        for (var j=0; j<barLength; j++) {
            barTxt += '|';
        }

    }

    function echo() {
        const line = terminal.children[0];
        terminal.appendChild(line);
        line.textContent = terminalTexts[ran(termLength-1)];
    }

    function genTiles() {
        for (var i=0; i<tileLength; i++) {
            tiles[i].style.backgroundColor = Math.random() < 0.5 ? 'black' : '';
        }
    }

    function genBars() {
        for (var ln=0; ln<9; ln++) {
            lines[ln].textContent = ln + " ) |" + barTxt.substring(0, ran(barLength));
        }
    }

    function genNums() {
        const cols = 6,
            rows = 30;

        var html = '';
        for(var row=0; row<rows; row++) {

            for(var col=0; col<cols; col++) {
                html += ran(64) + ' ';
            }

            html += '<br>';
        }

        numbers.innerHTML = html;
    }

    init();
    echo();
    genTiles();
    genBars();
    genNums();

    setInterval(echo, 50);
    setInterval(genTiles, 1000);
    setInterval(genBars, 500);
    setInterval(genNums, 20);
});