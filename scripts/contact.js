window.addEventListener("load",function(){
	const emailInput = document.getElementById("email-input"),
		contentInput = document.getElementById("content-input"),

		contentError = document.getElementById("content-error");

	var submitted = false,
		processing = false,
		noEmailSeen = false;
	document.getElementById("btn-submit").addEventListener("click", function() {
		alert("Not available");
		/*
		if(submitted) return false;
		if(processing) return false;
		const content = contentInput.value;

		if(content.replace(" ","") === ""){
			contentError.innerText = "Message can't be empty";
			return false;
		}
		if(content.length > 2000){
			contentError.innerText = "Too long. Maximum length is 2000 characters.";
			return false;
		}

		var email = emailInput.value;
		if(email.replace(" ","") === "") {
			if(!noEmailSeen) {
				noEmailSeen = true;
				alert("Would be nice if you specified your email address in case I need to ask you more questions =)\n\nIf you still want to be anonymous ignore this message and click submit again");
				return;
			} else {
				email = "No email specified";
			}
		}
		processing = true;

		contentInput.setAttribute("disabled",true);
		const url = "gone";
		httpPost(url,{
			username: email,
			content: content
		},function(code){
			processing = false;
			contentInput.setAttribute("disabled",false);
			if(code === 204){
				alert("Form submitted successfully! \nIf you specified an email, you should get a reply in up to 24 hours.\nReturning to the home page.");
				window.location.href = "index.html";
				submitted = true;
			}
			else {
				alert("Something went wrong. Error: "+code);
			}
		});

		return false;*/
	}, false);

}, false);