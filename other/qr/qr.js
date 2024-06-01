window.addEventListener('load', function() {
	const qr = document.getElementById('qr'),
		input = document.getElementById('text');
		codeSelectors = document.getElementsByName('codeSelectRadio');

	function getSelectedCode(){
		for(var i = 0; i < codeSelectors.length; i++){
			if(codeSelectors[i].checked){
				return codeSelectors[i].value;
			}
		}
	}

	function loadImageAsDataURL(url, callback) { // 3DS refuses to wait for api when just setting the src, so I need to request it through JS
    		var xhr = new XMLHttpRequest();
    		xhr.open('GET', url, true);
    		xhr.responseType = 'blob';

    		xhr.onload = function() {
        		if (this.status === 200) {
            			var reader = new FileReader();
            			reader.onloadend = function() {
                			var base64data = reader.result.replace("data:", "").replace(/^.+,/, "");
                			callback(base64data);
            			}
            			reader.readAsDataURL(this.response);
        		} else {
            			console.error("Failed to load image", this.statusText);
        		}
    		};

    		xhr.onerror = function() {
        		console.error("Request failed");
    		};

   		xhr.send();
	}

	
	function generate(str) {
		var imageUrl = 'https://barcodeapi.org/api/' + getSelectedCode() + '/' + decodeURIComponent(str);
		loadImageAsDataURL(imageUrl, function(dataUrl) {
    			qr.src = dataUrl;
		});
	}

	document.getElementById('btn-gen').addEventListener('click', function() {
		if (input.value.length) generate(input.value);
	}, false);
}, false);
