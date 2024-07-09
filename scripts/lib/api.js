// API wrapper for the 3DS Web Stuff API

libName("api");
depend("net");

const api = {
    url: "localhost:3000/api" // TODO: Change when the API is deployed to the web
};

/**
 * Sends an HTTP request to the 3DS Web Stuff API
 * @param {string} endpoint
 * @param {function} callback
 */
api.request = function(endpoint, callback) {
    net.httpGet(url + "/" + endpoint, callback, true);
}
