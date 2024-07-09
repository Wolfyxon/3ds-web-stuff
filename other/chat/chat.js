window.addEventListener("load", function() {
    const chatLog = document.getElementById("chat-log");

    function addMessage(author, text) {
        const msg = document.createElement("div");
        
        const authorEle = document.createElement("span");
        authorEle.className = "message-author";
        authorEle.innerText = author;
        msg.appendChild(authorEle);

        const textEle = document.createElement("span");
        textEle.className = "message-text";
        textEle.innerText = text;
        msg.appendChild(textEle);

        chatLog.appendChild(msg);
    }

    
}, false);