window.addEventListener("load", function(){
    const searchResults = document.getElementById("search-results");
    const searchInput = document.getElementById("input-search");
    const btnSearch = document.getElementById("btn-search");

    const bottomScreen = document.getElementById("bottom-screen");
    const topScreen = document.getElementById("top-screen");

    const degreesTxt = document.getElementById("degrees");
    const locationTxt = document.getElementById("location");

    var userPickedLocation = false;

    function getTemperatureColor(temperature) {
        const minTemperature = -20;
        const maxTemperature = 80;

        temperature = Math.max(minTemperature, Math.min(temperature, maxTemperature));

        const minColor = [0, 0, 255]; // Blue
        const maxColor = [255, 0, 0]; // Red

        const factor = (temperature - minTemperature) / (maxTemperature - minTemperature);

        const interpolatedColor = [
            Math.round((1 - factor) * minColor[0] + factor * maxColor[0]),
            Math.round((1 - factor) * minColor[1] + factor * maxColor[1]),
            Math.round((1 - factor) * minColor[2] + factor * maxColor[2])
        ];

        return "rgb(" + interpolatedColor.join(",") + ")";
    }

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
            userPickedLocation = true;
            loadWeather(lat, long, elem.innerText);
        }, false);
    }

    function loadWeather(lat, long, locationString){
        const currentFlags = ["temperature_2m","relative_humidity_2m","rain","wind_speed_10m"];
        const hourlyFlags = ["temperature_2m","rain","snowfall","snow_depth","visibility","wind_speed_10m"];
        const url = "http://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+long+"&current="+currentFlags.join(",")+"&hourly="+hourlyFlags.join(",");

        httpGet(url,function(code, body){
            if(code !== 200){
                alert("Failed to load weather. Code: "+code);
                return;
            }
            const jsonBody = JSON.parse(body);
            console.log(jsonBody);

            degreesTxt.innerText = jsonBody["current"]["temperature_2m"] + "°C";
            locationTxt.innerText = locationString;

            const color = getTemperatureColor(jsonBody["current"]["temperature_2m"]);
            topScreen.style.backgroundColor = color;
            bottomScreen.style.backgroundColor = color;

            hideResults();
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
    }, false);

    document.getElementById("btn-clear").addEventListener("click",function(){
        searchInput.value = "";
    }, false);

    bottomScreen.addEventListener("click",function (e){
        if(e.target !== bottomScreen) return;
        hideResults();
    }, false);
    searchInput.addEventListener("focusin",showResults, false);

    clearResults();
    hideResults();

    approximateUserLocation(function(data){
        if(userPickedLocation) return;

        if(data["status"] !== "success"){
            console.error("API returned  " + data["status"] + " status. Message: " + data["message"]);
            return;
        }

        if(!data["lat"]){
            console.error("Missing lat");
            return;
        }
        if(!data["lon"]){
            console.error("Missing lon");
            return;
        }

        const locStr = data["city"] + ", " + data["regionName"] + ", " + data["country"];
        loadWeather(data["lat"], data["lon"], locStr);
    });
}, false);