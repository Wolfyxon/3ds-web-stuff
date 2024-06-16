window.addEventListener("load", function() {
    const homeLink = document.getElementById("back");

    if(window.location.href.indexOf("3ds-web-stuff") !== -1) {
        homeLink.href = "/3ds-web-stuff";
    }
}, false);