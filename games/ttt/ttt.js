window.addEventListener("load",function(){
    const grid = document.getElementById("grid");
    const cells = grid.getElementsByTagName("td");
    const plrTxt = document.getElementById("plr");
    const winTxt = document.getElementById("win");

    var currentPlayer = "X";
    var winsO = 0;
    var winsX = 0;

    function getType(x, y) {
        return grid.rows[y].cells[x].textContent;
    }

    function testPatterns(player){
        for (var i=0; i<3; i++) {
            // horizontal
            if ((getType(0, i) === getType(1, i)) &&
                (getType(0, i) === getType(2, i)) &&
                (getType(0, i).length)) {
                return true;
            } else
    
            // vertical
            if ((getType(i, 0) === getType(i, 1)) &&
                (getType(i, 0) === getType(i, 2)) &&
                (getType(i, 0).length)) {
                return true;
            }
        }
    
        // diagonal \
        if ((getType(0, 0) === getType(1, 1)) &&
            (getType(1, 1) === getType(2, 2)) &&
            (getType(0, 0).length)) {
            return true;
        } else
    
        // diagonal /
        if ((getType(2, 0) === getType(1, 1)) &&
            (getType(1, 1) === getType(0, 2)) &&
            (getType(2, 0).length)) {
            return true;
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
	grid.addEventListener("click",function(event){
		const cell = event.target;
		if(cooldown) return;
		if(cell.innerText !== "") return;

		cell.innerText = currentPlayer;
		var win = false;
		if(testPatterns(currentPlayer)){
			cooldown = true;
			win = true;
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

		if(!win) {
			var filled = 0;
			for(var i=0;i<cells.length;i++){
				if(cells[i].innerText !== "") filled++;
			}
			if(filled >= 9) reset();
		}
	});
})
