window.addEventListener("load",function (){
    const qr = document.getElementById("qr")
    const input = document.getElementById("text")

    function generate(str){
        qr.src = "http://api.qrserver.com/v1/create-qr-code/?size=200x200&data="+str
    }

    document.getElementById("btn-gen").addEventListener("click",function (){
        if(input.value === "") return;
        generate(input.value)
    })
})