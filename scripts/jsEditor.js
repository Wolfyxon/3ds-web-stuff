
window.addEventListener("load",function(){
    const editor = ace.edit(document.getElementById("code-input"), {
        mode: "ace/mode/javascript",
        selectionStyle: "text"
    })
    editor.setOptions({
        autoScrollEditorIntoView: true,
        copyWithEmptySelection: true,
    });

})