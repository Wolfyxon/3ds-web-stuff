window.addEventListener("load",function(){
    const minInput = document.getElementById("min");
    const maxInput = document.getElementById("max");
    const resultTxt = document.getElementById("result");
    const intChk = document.getElementById("chk-int");

    document.getElementById("btn-gen").addEventListener("click",function(){
        var res = randf(parseFloat(minInput.value), parseFloat(maxInput.value));
        if(intChk.checked) res = Math.floor(res);

        resultTxt.innerText = res;
    });
});