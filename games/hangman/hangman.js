window.addEventListener('load', function() {
    const button = document.getElementById('btn-reset'),
        keyboard = document.getElementById('keyboard'),
        wordDisplay = document.getElementById('display'),
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        lines = [ // x from, y from, x to, y to
            [10, 140, 70, 140],
            [40, 140, 40, 10],
            [40, 30, 60, 10],
            [40, 10, 100, 10],
            [100, 10, 100, 30],
            null,
            [100, 70, 100, 110],
            [100, 80, 80, 100],
            [100, 80, 120, 100],
            [100, 110, 80, 130],
            [100, 110, 120, 130]
        ],
        words = [
            'Hangman',
            'Magiczocker',
            'Wolfyxon',
            'Trickygamers',
            'Nintendo',
            'Mario',
            'Luigi',
            'Waluigi',
            'Wario',
            'Peach',
            'Toad',
            'Daisy',
            'Bowser',
            'Yoshi',
            'Toadette',
            'DonkeyKong',
            'Rosalina',
            'Luma',
            'Blooey',
            'Kirby',
            'Boolossus',
            'Kart',
            'Ware',
            'Tomodachi',
            'Badge',
            'Switch',
            'GameBoy',
            'VirtualBoy',
            'GameCube'
        ];
    var mistakes, gameOver;
    //ctx.strokeStyle = '#f6f6f6';

    function draw() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (var m=0; m<=mistakes; m++) { // loop only needed for old 3DS
            const l = lines[m];
            ctx.beginPath();
            if (m < 5 || m > 5) {
                ctx.moveTo(l[0], l[1]);
                ctx.lineTo(l[2], l[3]);
            } else {
                ctx.arc(100, 50, 20, 0, 2 * Math.PI);
            }
            ctx.stroke();
            ctx.closePath();
        }
    }
    function drawKeyboard() {
        const layers = [
            [65, 73], // A - J
            [74, 81], // K - S
            [82, 90] // T - Z
        ];
        for (var l=0; l<3; l++) {
            const layer = document.createElement('div'),
                i = layers[l];
            for (var k=i[0]; k<=i[1]; k++) {
                const ele = document.createElement('span'),
                    char = String.fromCharCode(k);
                ele.setAttribute('data-key', char)
                ele.textContent = char;
                layer.appendChild(ele);
            }
            keyboard.appendChild(layer);
        }
    }

    function tryKey(k) {
        if (!k || gameOver) return;
        var ele = keyboard.querySelector('span[data-key="' + k + '"]');
        if (ele.getAttribute('data-disabled')) return;
        ele.setAttribute('data-disabled', true);

        var b = wordDisplay.querySelectorAll('span[data-letter="' + k.toLowerCase() + '"]');
        if (b.length) {
            for (var i=0; i<b.length; i++) {
                b[i].innerText = b[i].getAttribute('data-displayletter');
                b[i].removeAttribute('data-hidden');
            }
            if (!wordDisplay.querySelectorAll('span[data-letter][data-hidden]').length) {
                var c = wordDisplay.querySelectorAll('span[data-letter]');
                for (var l = 0; l < c.length; l++) {
                    c[l].className += 'success';
                }
                gameOver = true;
            }
        } else {
            mistakes++;
            if (mistakes > 9) {
                var s = wordDisplay.querySelectorAll('span[data-hidden]');
                for (var j=0; j<s.length; j++) {
                    s[j].innerText = s[j].getAttribute('data-displayletter');
                    s[j].removeAttribute('data-hidden');
                    s[j].className += 'failed';
                }
                gameOver = true;
            }
        }
        draw();
    }

    function reset() {
        mistakes = 0;
        gameOver = false;
        draw();

        // Reset keyboard
        const keys = keyboard.querySelectorAll('span[data-disabled]');
        for (var i=0; i<keys.length; i++) {
            keys[i].removeAttribute('data-disabled');
        }

        // Reset word
        wordDisplay.innerHTML = '';
        var selectedWord = words[Math.floor(Math.random() * words.length)];
        for (var j = 0; j < selectedWord.length; j++) {
            var ele = document.createElement("span");
            ele.innerText = "_";
            ele.setAttribute('data-displayletter', selectedWord.substring(j, j + 1));
            ele.setAttribute('data-letter', ele.getAttribute('data-displayletter').toLowerCase());
            ele.setAttribute('data-hidden', '.');
            wordDisplay.appendChild(ele);
        }
    }

    keyboard.addEventListener('click', function(e) {
        if (e.target.nodeName !== 'SPAN') return;
        tryKey(e.target.textContent);
    });

    document.addEventListener('keydown', function(e) {
        if (e.isComposing || e.key === 229) { return; }
        const ele = keyboard.querySelector('span[data-key="' + e.key.toUpperCase() + '"]');
        if (ele) tryKey(ele.getAttribute('data-key'));
    });

    button.addEventListener('click', reset);

    drawKeyboard();
    reset();
});
