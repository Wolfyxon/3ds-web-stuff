const terminalTexts = [
    "rm -rf /* --no-preserve-root",
    "pacman -Syu",
    "sudo -s",
    "neofetch",
    "Hacking database",
    "Establishing connection",
    "Hi",
    "undefined",
    "Hello World!",
    "Goodbye World!",
    "Ah free at last",
    "A visitor. Hm indeed, I've slept long enough.",
    "Rise and shine mr Freeman",
    "Get out",
    "kernel panic - not syncing: Attempted to kill inint !",
    "Uncaught ReferenceError: message is not defined",
    "Exception in thread \"main\" java.lang.NullPointerException",
    "Segmentation fault (core dumped)",
    "Fatal error: Unexpectedly found nil while unwrapping an Optional value",
    "ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'WHERE id=1' at line 1",
    "System.NullReferenceException: Object reference not set to an instance of an object.",
    "panic: runtime error: index out of range [5] with length 3",
    "Type mismatch: inferred type is Int but String was expected",
    "thread 'main' panicked at 'attempt to add with overflow', src/main.rs:4:9",
    "for(int i = 0; i < sizeof(arr); i++) {}",
]

window.addEventListener("load", function() {
    const terminal = document.getElementById("terminal");
    const numbers = document.getElementById("numbers");

    const radarScan = document.getElementById("scan");
    var scanRot = 0;

    function echo(text) {
        const line = document.createElement("div");
        line.innerText = text;

        if(terminal.children.length > 15) {
            terminal.removeChild( terminal.children[0] );
        }

        terminal.appendChild(line);
    }

    function terminalLoop() {
        echo( terminalTexts[randi(0, terminalTexts.length-1)] );
        setTimeout(terminalLoop, randi(1,50));
    }
    terminalLoop();

    setInterval(function () {
        const cols = 6;
        const rows = 30;

        var html = "";
        for(var row = 0; row < rows; row++) {

            for(var col = 0; col < cols; col++) {
                html += randi(0, 64) + " ";
            }

           html += "<br>";
        }

        numbers.innerHTML = html;

    }, 20);

    var prevFrameTime = Date.now();
    setInterval(function (){
        const delta = (Date.now() - prevFrameTime) / 16;
        prevFrameTime = Date.now();

        scanRot += delta * 5;
        radarScan.style.webkitTransform = "rotate(" + scanRot + "deg)";
    });
});