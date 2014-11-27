


function Interpreter(url, display) {
        var http, buffer, pos, escaped, escapeCode;

		

        

        http = new XMLHttpRequest();
        http.open("GET", url, true);

        http.onreadystatechange = function () {
            
            if (http.readyState === 4) {
                if (http.status === 200) {
					globalPos = 0;
					escapeCode = "";
					globalEscaped = false;
					globalDisplay = display;
                    globalBuffer = new Uint8Array(http.response);
                   
                } else {
                    throw ("Could not retrieve: " + url);
                }
            }
        };

        http.setRequestHeader("Content-Type", "application/octet-stream");
        http.responseType = "arraybuffer";
        http.send();

		
    }

