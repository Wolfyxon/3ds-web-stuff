window.addEventListener("load",function(){
    const minInput = document.getElementById("min");
    const maxInput = document.getElementById("max");
    const resultTxt = document.getElementById("result");
    const intChk = document.getElementById("chk-int");

    document.getElementById("btn-gen").addEventListener("click",function(){
        var res = randf(minInput.value, maxInput.value);
        if(intChk.checked) res = Math.floor(res);

        resultTxt.innerText = res;
    });
});