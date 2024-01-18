window.addEventListener("load", function(){
    const inputBtns = document.getElementById("pads").getElementsByTagName("button");

    const formula = document.getElementById("formula");
    const result = document.getElementById("result");

    function run(){
        if(formula.innerText === "") return;

        try {
            result.innerText = eval(formula.innerText);
        } catch (e){
            alert(e)
        }
    }

    function registerInputBtn(button){
        if(button.innerText === "="){
            button.addEventListener("click",run);
            return;
        }

        button.addEventListener("click",function(){
            formula.innerText += button.innerText;
        })
    }

    for(var i=0; i<inputBtns.length; i++){
        registerInputBtn(inputBtns[i]);
    }

    document.getElementById("btn-clear").addEventListener("click", function(){
        result.innerText = "";
        formula.innerText = "";
    });
});