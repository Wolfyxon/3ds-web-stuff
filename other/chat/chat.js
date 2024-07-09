depend("api");

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
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function loadMessages() {
        api.get("chat/get", function(code, res) {
            if(code != 200) {
                console.error("Cannot get chat: " + code);
                return;
            }

            const data = JSON.parse(res);
            chatLog.innerHTML = "";

            for(var i = 0; i < data.length; i++) {
                var msg = data[data.length - i - 1];
                addMessage(msg.username, msg.message);
            }
        });
    }

    loadMessages();
    setInterval(loadMessages, 2000);

    
}, false);