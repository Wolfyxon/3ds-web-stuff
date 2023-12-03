window.addEventListener("load",function (){
    const tabBtns = document.getElementById("tab-btns")
    const tabs = document.getElementById("tabs")
    var tabIdx = 0;
    var currentTab = null;

    function setTab(tab){
        for(var i=0;i<tabs.children.length;i++){
            tabs.children[i].style.display = "none"
        }
        for(var i=0;i<tabBtns.children.length;i++){
            tabBtns.children[i].style.backgroundColor = "#653198"
        }
        tab.style.display = ""
        currentTab = tab
    }

    function setTabByName(name){
        setTab(document.getElementById("tab-"+name.toLowerCase()))
    }

    function updateTabBtn(){
        tabBtns.children[tabIdx].style.backgroundColor = "darkred"
    }

    function nextTab(){
        if(currentTab === null) return;
        if(tabIdx >= tabs.children.length-1) tabIdx = 0;
        else tabIdx++;
        setTab(tabs.children[tabIdx])
        updateTabBtn()
    }
    function prevTab(){
        if(currentTab === null) return;
        if(tabIdx <= 0) tabIdx = tabs.children.length-1;
        else tabIdx--;
        setTab(tabs.children[tabIdx])
        updateTabBtn()
    }

    function registerTabBtn(btn){
        tabBtns.children[i].addEventListener("click",function(){
            setTabByName(btn.innerHTML.toLowerCase())
            btn.style.backgroundColor = "darkred";
        })
    }

    for(var i=0;i<tabBtns.children.length;i++){
        registerTabBtn(tabBtns.children[i])
    }

    setTab(tabs.children[tabIdx])
    updateTabBtn()

    setInterval(function (){

        if(currentTab){
            const scrollAmt = 5
            if(isBtnPressed("down")){
                currentTab.scrollTop += scrollAmt
            } else if(isBtnPressed("up")){
                currentTab.scrollTop -= scrollAmt
            }
        }

        if(isBtnJustPressed("left")){
            prevTab()
        }
        else if(isBtnJustPressed("right")){
            nextTab()
        }
    })
})