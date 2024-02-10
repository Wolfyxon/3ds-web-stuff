window.addEventListener("load",function (){

    const petImg = document.getElementById("pet");

    const petRoot = "img/pets/";

    const animPigeon = Animation(petImg);
    animPigeon.looped = true;
    animPigeon.loopDelay = 3;
    animPigeon.spacing = 0.2;
    animPigeon.addKeyframe("src", petRoot+"pigeon/pigeon1.png");
    animPigeon.addKeyframe("src", petRoot+"pigeon/pigeon2.png");
    animPigeon.addKeyframe("src", petRoot+"pigeon/pigeon1.png");

    const animMaxwell = Animation(petImg);
    animMaxwell.looped = true;
    animMaxwell.spacing = 0.1;
    animMaxwell.addKeyframe("src", petRoot+"maxwell/maxwell1.png");
    animMaxwell.addKeyframe("src", petRoot+"maxwell/maxwell2.png",0.1);
    animMaxwell.addKeyframe("src", petRoot+"maxwell/maxwell3.png");
    animMaxwell.addKeyframe("src", petRoot+"maxwell/maxwell2.png");

    const animChicken = Animation(petImg);
    animChicken.looped = true;
    animChicken.spacing = 0.1;
    animChicken.loopDelay = 3;
    animChicken.addKeyframe("src", petRoot+"chicken/chicken1.png");
    animChicken.addKeyframe("src", petRoot+"chicken/chicken2.png");
    animChicken.addKeyframe("src", petRoot+"chicken/chicken3.png");
    animChicken.addKeyframe("src", petRoot+"chicken/chicken2.png");
    animChicken.addKeyframe("src", petRoot+"chicken/chicken3.png");
    animChicken.addKeyframe("src", petRoot+"chicken/chicken2.png");
    animChicken.addKeyframe("src", petRoot+"chicken/chicken1.png");

    const animCat = Animation(petImg);
    animCat.looped = true;
    animCat.spacing = 0.4;
    animCat.addKeyframe("src", petRoot+"cat/cat1.png");
    animCat.addKeyframe("src", petRoot+"cat/cat0.png");
    animCat.addKeyframe("src", petRoot+"cat/cat2.png");
    animCat.addKeyframe("src", petRoot+"cat/cat3.png");
    animCat.addKeyframe("src", petRoot+"cat/cat2.png");


    const petAnimations = [
        animPigeon,
        animMaxwell,
        animChicken,
        animCat,
    ]

    pickRandom(petAnimations).play();

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
            //tabBtns.children[i].targetColor = "#653198"
            tabBtns.children[i].style.backgroundColor = "#653198"

        }
        tab.style.display = ""
        currentTab = tab
    }

    function setTabByName(name){
        setTab(document.getElementById("tab-"+name.toLowerCase()))
    }

    function updateTabBtn(){
        //tabBtns.children[tabIdx].targetColor = "darkred"
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
        btn.addEventListener("click",function(){
            setTabByName(btn.innerHTML.toLowerCase())
            //btn.targetColor = "darkred";
            btn.style.backgroundColor = "darkred";
        })/*
        setInterval(function (){
            const col = btn.targetColor;
            const current = btn.style.backgroundColor || "#653198"
            if(col) btn.style.backgroundColor = lerpColor(current,col,0.2)
        })*/
    }

    for(var i=0;i<tabBtns.children.length;i++){
        registerTabBtn(tabBtns.children[i])
    }

    setTab(tabs.children[tabIdx])
    updateTabBtn()

    var prevFrameTime = Date.now();
    setInterval(function (){
        const delta = (Date.now() - prevFrameTime);
        prevFrameTime = Date.now();
        if(currentTab){
            const scrollAmt = 1;
            if(isBtnPressed("down")){
                currentTab.scrollTop += scrollAmt * delta;
            } else if(isBtnPressed("up")){
                currentTab.scrollTop -= scrollAmt * delta;
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