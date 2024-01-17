window.addEventListener("load", function(){
    const inputBtns = document.getElementById("pads").getElementsByTagName("button");

    const formula = document.getElementById("formula");
    const result = document.getElementById("result");

    function registerInputBtn(button){
        if(button.innerText === "=") return;
        button.addEventListener("click",function(){
            formula.innerText += button.innerText;
        })
    }

    for(var i=0; i<inputBtns.length; i++){
        registerInputBtn(inputBtns[i]);
    }
});