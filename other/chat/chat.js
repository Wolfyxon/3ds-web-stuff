depend("api");

window.addEventListener("load", function() {
    const chatLog = document.getElementById("chat-log");

    function addMessage(author, text) {
        const msg = document.createElement("div");
        
        const authorEle = document.createElement("span");
        authorEle.className = "message-author";
        authorEle.textContent = author;
        msg.appendChild(authorEle);

        const textEle = document.createElement("span");
        textEle.className = "message-text";
        textEle.textContent = text;
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

    /*loadMessages();
    /setInterval(loadMessages, 2000);*/

    document.getElementById("btn-about").addEventListener("click", function() {
        alert(
            "3DS Web Stuff chat room \n\n" +
            "All messages you send are public and are temporarily stored in a database.\n" +
            "Your IP address is stored in the database as a sha1 encrypted hash which can be used to identify malicious users, but cannot be decrypted and traced back to the original address.\n" +
            "This app talks to the API available at https://github.com/Wolfyxon/3ds-web-stuff-backend/ to send and retrieve messages. \n\n" +
            "This app is experimental. Continued abuse may result in a shutdown. \n\n" +
            "Inspired by Tycho10101. API hosted on Vercel."
        );
    }, false)

    
}, false);