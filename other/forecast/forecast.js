window.addEventListener("load", function(){
    const searchResults = document.getElementById("search-results");
    const searchInput = document.getElementById("input-search");
    const btnSearch = document.getElementById("btn-search");
    const bottomScreen = document.getElementById("bottom-screen");

    const degreesTxt = document.getElementById("degrees");
    const locationTxt = document.getElementById("location");

    function clearResults(){
        searchResults.innerHTML = "";
    }

    function addResult(data){
        const elem = document.createElement("button");
        const name = data["name"] || "";
        const country = data["country"] || "";
        const admin1 = data["admin1"] || "";

        elem.innerText = name+", " + admin1 + ", " + country;
        searchResults.appendChild(elem);

        const lat = data["latitude"];
        const long = data["longitude"];

        elem.addEventListener("click",function(){
            const url = "http://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+long+"&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&hourly=temperature_2m,rain,snowfall,snow_depth,visibility,wind_speed_10m"

            httpGet(url,function(code, body){
                if(code !== 200){
                    alert("Something went wrong. Code: "+code);
                    return;
                }
                const jsonBody = JSON.parse(body);
                console.log(jsonBody);

                degreesTxt.innerText = jsonBody["current"]["temperature_2m"] + "°C";
                locationTxt.innerText = elem.innerText;

                hideResults();
            });

        });
    }

    function showResults(){
        searchResults.style.visibility = "visible";
    }

    function hideResults(){
        searchResults.style.visibility = "hidden";
    }

    btnSearch.addEventListener("click",function(){
        if(searchInput.value.replace(" ","").length === 0) return;
        searchLocations(searchInput.value, function (results){
            console.log(results);
            clearResults();
            showResults();
            for(var i=0;i<results.length;i++){
                addResult(results[i]);
            }
        });
    });

    document.getElementById("btn-clear").addEventListener("click",function(){
        searchInput.value = "";
    });

    bottomScreen.addEventListener("click",function (e){
        if(e.target !== bottomScreen) return;
        hideResults();
    });
    searchInput.addEventListener("focusin",showResults);

    clearResults();
    hideResults();
});