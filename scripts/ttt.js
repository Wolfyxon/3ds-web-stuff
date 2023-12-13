window.addEventListener("load",function(){
    const grid = document.getElementById("grid");
    const cells = grid.getElementsByTagName("td");
    const plrTxt = document.getElementById("plr");
    const winTxt = document.getElementById("win");

    const winningPatterns = [
        [
            1,1,1,
            0,0,0,
            0,0,0
        ],
        [
            0,0,0,
            1,1,1,
            0,0,0
        ],
        [
            0,0,0,
            0,0,0,
            1,1,1
        ],
        [
            1,0,0,
            1,0,0,
            1,0,0
        ],
        [
            0,1,0,
            0,1,0,
            0,1,0
        ],
        [
            0,0,1,
            0,0,1,
            0,0,1
        ],
        [
            0,0,1,
            0,1,0,
            1,0,0
        ],
        [
            1,0,0,
            0,1,0,
            0,0,1
        ]
    ]

    var currentPlayer = "X";
    var winsO = 0;
    var winsX = 0;

    function testPatterns(player){
        for(var pI=0;pI<winningPatterns.length;pI++){
            const pattern = winningPatterns[pI];
            var correct = 0;
            for(var cI=0;cI<cells.length;cI++){
                if(pattern[cI] === 1 && cells[cI].innerText === player) correct++;
            }
            if(correct >= 3) return true;
        }
        return false;
    }

    function reset(){
        winTxt.style.display = "none";
        for(var i=0;i<cells.length;i++){
            const cell = cells[i];
            cell.innerText = "";
            cell.style.color = "";
        }
        cooldown = false;
    }

    var cooldown = false;
    function registerCell(cell,index){
        cell.addEventListener("click",function(){
            if(cooldown) return;
            if(cell.innerText !== "") return;

            cell.innerText = currentPlayer;
            if(testPatterns(currentPlayer)){
                cooldown = true;
                winTxt.innerText = currentPlayer + " wins";
                winTxt.style.display = "block"

                if(currentPlayer === "O") winsO++;
                else winsX++;

                document.getElementById("wins-o").innerText = winsO;
                document.getElementById("wins-x").innerText = winsX;

                setTimeout(reset,1500)
            }
            if(currentPlayer === "O"){
                cell.style.color = "green";
                plrTxt.style.color = "red";
                currentPlayer = "X";
            } else {
                cell.style.color = "red";
                plrTxt.style.color = "green";
                currentPlayer = "O";
            }
            winTxt.style.color = cell.style.color;
            plrTxt.innerText = currentPlayer;
        })
    }

    for(var i=0;i<cells.length;i++){
        registerCell(cells[i],i);
    }
})