libName("net");

const net = {}

/**
 * Gets the domain name from the given URL
 * @param  {String} url URL of the server/website
 * @return {String}
 */
net.getDomain = function(url) {
    const protocolSplit = url.split("//");
    return protocolSplit[protocolSplit.length-1].split("/")[0];
}

/**
 * Performs a GET HTTP request
 * @param  {String} domain Checks if HTTP requests can be sent to the specified domain
 * @return {boolean}
 */
net.isDomainAllowed = function(domain) {
    if(domain.indexOf("localhost") !== -1) {
        console.warn("localhost is always blocked by CORS on most browsers. Consider installing an extension to bypass it");
        return true;
    }

    const content = document.head.getAttribute("content");
    return document.head.getAttribute("http-equiv") === "Access-Control-Allow-Origin" && (content === "*" || content.indexOf(domain) !== -1);
}

/**
 * Performs a GET HTTP request
 * @param  {String} url URL of the server/website
 * @param {Function} callback Callback function containing the response code and body
 * @param {Boolean} [allowInsecure=false] Allows the raw usage of HTTP. Please only use HTTP instead of HTTPS if the request can't be made with HTTPS.
 */
net.httpGet = function(url, callback, allowInsecure) {
    if(!url){
        throw "No URL specified";
    }
    if(!callback){
        throw "No callback function specified";
    }

    if(!is3DS() && !allowInsecure) url = url.replace("http://","https://");

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
net.httpPost = function(url, data, callback, contentType) {
    if(!url) {
        throw "No URL specified";
    }
    if(!callback){
        throw "No callback function specified";
    }
    if(!contentType) contentType = "application/json";

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) callback(xhr.status, xhr.responseText);
    };

    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", contentType);

    const jsonData = JSON.stringify(data);
    xhr.send(jsonData);
}