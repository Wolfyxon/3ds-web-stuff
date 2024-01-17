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
