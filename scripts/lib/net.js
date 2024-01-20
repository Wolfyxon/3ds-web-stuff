
/**
 * Gets the domain name from the given URL
 * @param  {String} url URL of the server/website
 * @return {String}
 */
function getDomain(url){
    const protocolSplit = url.split("//");
    return protocolSplit[protocolSplit.length-1].split("/")[0];
}

/**
 * Performs a GET HTTP request
 * @param  {String} domain Checks if HTTP requests can be sent to the specified domain
 * @return {boolean}
 */
function isDomainAllowed(domain){
    const content = document.head.getAttribute("content");
    return document.head.getAttribute("http-equiv") === "Access-Control-Allow-Origin" && (content === "*" || content.indexOf(domain) !== -1);
}

/**
 * Performs a GET HTTP request
 * @param  {String} url URL of the server/website
 * @param {Function} callback Callback function containing the response code and body
 */
function httpGet(url, callback){
    if(!url){
        console.error("No URL specified");
        return;
    }
    if(!callback){
        console.error("No callback function specified");
        return;
    }

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) callback(xhr.status, xhr.responseText);
    };

    xhr.open('GET', url, true);
    xhr.send();
}

/**
 * Performs a POST HTTP request
 * @param  {String} url URL of the server/website
 * @param  {Object} data Data to send
 * @param {Function} callback Callback function containing the response code and body
 * @param {String} [contentType=application/json] Content type
 */
function httpPost(url, data, callback, contentType) {
    if(!url) {
        console.error("No URL specified");
        return;
    }
    if(!callback){
        console.error("No callback function specified");
        return;
    }
    if(!contentType) contentType = "application/json";

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
        if (xhr.readyState === 4) callback(xhr.status, xhr.responseText);
    };

    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", contentType);

    const jsonData = JSON.stringify(data);
    xhr.send(jsonData);
}