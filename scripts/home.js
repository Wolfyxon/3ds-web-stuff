window.addEventListener("load",function (){

    const petImg = document.getElementById("pet");

    const petRoot = "img/pets/";
    const pets = ["maxwell", "pigeon"];

    // TODO: Animated pets
    const currentPet = pickRandom(pets);
    petImg.src = petRoot + currentPet + "/" + currentPet + "1.png";


    const tabBtns = document.getElementById("tab-btns")
    const tabs = document.getElementById("tabs")
    var tabIdx = 0;
    var currentTab = null;

    function setTab(tab){
        for(var i=0;i<tabs.children.length;i++){
            if(tabs.children[i] === tab) tabIdx = i;
            tabs.children[i].style.display = "none"
        }
        for(var i=0;i<tabBtns.children.length;i++){
            tabBtns.children[i].targetColor = "#653198"
        }
        tab.style.display = ""
        currentTab = tab
    }

    function setTabByName(name){
        setTab(document.getElementById("tab-"+name.toLowerCase()))
    }

    function updateTabBtn(){
        tabBtns.children[tabIdx].targetColor = "darkred"
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
        btn.addEventListener("click",function(){
            setTabByName(btn.innerHTML.toLowerCase())
            btn.targetColor = "darkred";
        })
        setInterval(function (){
            const col = btn.targetColor;
            const current = btn.style.backgroundColor || "#653198"
            if(col) btn.style.backgroundColor = lerpColor(current,col,0.2)
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