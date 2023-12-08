window.addEventListener("load",function(){
    const code = document.getElementById("code");
    code.value = "alert(\"Hello World\")"

    document.getElementById("btn-run").addEventListener("click",function(){
        eval(code.value);
    })
})