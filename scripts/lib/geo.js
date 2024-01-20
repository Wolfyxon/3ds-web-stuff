// This library utilizes the free public OpenMeteo API
// https://open-meteo.com/

if(!window.httpGet) throw new Error("net.js not imported!")

/***
 * Searches for real life locations with the given query and returns the results to the callback function
 * @param {String} query
 * @param {Function} callback Callback function called with the result array
 */
function searchLocations(query, callback){
    const url = "https://geocoding-api.open-meteo.com/v1/search?name="
    if(!isDomainAllowed(getDomain(url))) throw new Error("Please add 'geocoding-api.open-meteo.com' to the allowed CORS domains");
    httpGet(url+query, function(code, body){
        const jsonBody = JSON.parse(body);
        var results = [];
        const gottenResults = jsonBody["results"];
        if(gottenResults) results = gottenResults;
        callback(results);
    });
}

/***
 * Searches for the first real life location with the given query and returns the location data to the callback function
 * @param {String} query
 * @param {Function} callback Callback function called with the result array
 */
function findFirstLocation(query, callback){
    searchLocations(query, function(results){
        if(results.length === 0) callback(null);
        callback(results[0]);
    });
}
