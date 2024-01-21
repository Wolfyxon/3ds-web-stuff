window.addEventListener("load", function(){
    const searchResults = document.getElementById("search-results");
    const searchInput = document.getElementById("input-search");
    const btnSearch = document.getElementById("btn-search");

    function clearResults(){
        searchResults.innerHTML = "";
    }

    function addResult(data){
        const elem = document.createElement("div");
        const name = data["name"] || "";
        const country = data["country"] || "";
        const admin1 = data["admin1"] || "";

        elem.innerText = name+", " + admin1 + ", " + country;
        searchResults.appendChild(elem);
    }

    btnSearch.addEventListener("click",function(){
        if(searchInput.value.replace(" ","").length === 0) return;
        searchLocations(searchInput.value, function (results){
            console.log(results);
            clearResults();
            for(var i=0;i<results.length;i++){
                addResult(results[i]);
            }
        });
    });

    document.getElementById("btn-clear").addEventListener("click",function(){
        searchInput.value = "";
    });

    //clearResults();
});