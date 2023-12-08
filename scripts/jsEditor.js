
window.addEventListener("load",function(){
    const editor = document.getElementById("editor");
    editor.value = "alert(\"Hello World!\")"
    document.getElementById("btn-run").addEventListener("click",function(){
        try{
            eval(editor.value);
        } catch (e){
            alert(e.line | e.lineNumber)
        }
    })
    virtualKeyboard.focusElement(editor);
})