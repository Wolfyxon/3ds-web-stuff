window.addEventListener("load",function(){
    const minInput = document.getElementById("min");
    const maxInput = document.getElementById("max");
    const resultTxt = document.getElementById("result");

    document.getElementById("btn-gen").addEventListener("click",function(){
        resultTxt.innerText = randi(minInput.value, maxInput.value);
    });
});