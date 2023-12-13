window.addEventListener("load",function(){
    const grid = document.getElementById("grid");
    const cells = grid.getElementsByTagName("td");
    const plrTxt = document.getElementById("plr");

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
        for(var i=0;i<cells.length;i++){
            const cell = cells[i];
            cell.innerText = "";
            cell.style.color = "";
        }
    }

    function registerCell(cell,index){
        cell.addEventListener("click",function(){
            if(cell.innerText !== "") return;

            cell.innerText = currentPlayer;
            if(testPatterns(currentPlayer)){
                reset();
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
            plrTxt.innerText = currentPlayer;
        })
    }

    for(var i=0;i<cells.length;i++){
        registerCell(cells[i],i);
    }
})