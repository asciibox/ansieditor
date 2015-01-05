var bps=57600;

var charsAtOnce=99999;
if (bps==300) charsAtOnce=20; else if (bps==1200) charsAtOnce=80; else if (bps==2400) charsAtOnce=160; else if (bps==16800) charsAtOnce=6*160; else if (bps==19200) charsAtOnce=7*160; else if (bps==57600)  charsAtOnce=20*160;

var globalBuffer="";
var escapeCode="";
var globalEscaped=false;
var globalPos=0;
// usage:
// instead of setInterval(render, 16) ....


// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


(function animloop(){
  requestAnimFrame(animloop);
  render();
})();

function getValues() {
                return escapeCode.substr(1, escapeCode.length - 2).split(";").map(function (value) {
                    var parsedValue;
                    parsedValue = parseInt(value, 10);
                    return isNaN(parsedValue) ? 1 : parsedValue;
                });
            }

			function render() {

				var counter=0;
				
			if (globalPos < globalBuffer.length)
			{
			

			while ( (globalPos < globalBuffer.length) && (counter < charsAtOnce) ) {

			counter++;
			
			var j, code, values;

				ctx = document.getElementById("ansi").getContext("2d");
                
               
                code = globalBuffer[globalPos++];

				

                if (globalEscaped) {
					
                    escapeCode += String.fromCharCode(code);
                    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
                        globalEscaped = false;
                        values = getValues();
                        if (escapeCode.charAt(0) === "[") {
                            switch (escapeCode.charAt(escapeCode.length - 1)) {
                            case "A":
                                globalDisplay.up(values[0]);
                                break;
                            case "B":
                                globalDisplay.down(values[0]);
                                break;
                            case "C":
                                globalDisplay.forward(values[0]);
                                break;
                            case "D":
                                globalDisplay.back(values[0]);
                                break;
                            case "H":
                                if (values.length === 1) {
                                    globalDisplay.setPos(1, Math.min(values[0]));
                                } else {
                                    globalDisplay.setPos(values[1], values[0]);
                                }
                                break;
                            case "J":
                                if (values[0] === 2) {
                                    globalDisplay.clearScreen();
                                }
                                break;
                            case "K":
                                globalDisplay.clearToEndOfLine();
                                break;
                            case "m":
                                var j = 0;
                                while ( j < values.length ) {
                                    if (values[j] >= 30 && values[j] <= 37) {
                                        globalDisplay.setForeground(values[j] - 30);
                                    } else if (values[j] >= 40 && values[j] <= 47) {
                                        globalDisplay.setBackground(values[j] - 40);
                                    } else if (values[j]==48) { // background, 256colors
                                       // alert("bg:"+values);
                                        myvalues=String(values);
                                        //alert(myvalues.substring(5));
                                        var color = myvalues.substring(5);
                                        j=j+2;
                                       
                                        globalDisplay.setBackground(color);
                                    } else if (values[j]==38) { // foreground, 256colors
                                        //alert("fg:"+values);
                                        myvalues=String(values);
                                        var color = myvalues.substring(5);
                                        j=j+2;
                                        globalDisplay.setForeground(color);
                                    } else {
                                        switch (values[j]) {
                                        case 0:
                                            globalDisplay.resetAttributes();
                                            break;
                                        case 1:
                                            globalDisplay.setBold(true);
                                            break;
                                        case 5:
                                            break;
                                        case 7:
                                            globalDisplay.setInverse(true);
                                            break;
                                        case 22:
                                            globalDisplay.setBold(false);
                                            break;
                                        case 27:
                                            globalDisplay.setInverse(false);
                                            break;
                                        case 39:
                                            break;
                                        default:
                                            break;
                                        }
                                    }
                                    
                                    j++;
                                }
                                break;
                            case "s":
                                globalDisplay.savePosition();
                                break;
                            case "u":
                                globalDisplay.restorePosition();
                                break;
                            default:
                                break;
                            }
                        }
                        escapeCode = "";
                    }
                } else {
					
                    if (code === 27 && globalBuffer[globalPos] === 0x5B) {
                        globalEscaped = true;
                    } else if (code === 13 && globalBuffer[globalPos] === 10) {
                        ++globalPos;
                        if (globalDisplay.newLine()) {
                            //globalI = globalI + 1;
                        }
                    } else {
                      
                       
                        if (globalDisplay.drawChar(code)) {
                            //globalI = globalI + 1;
                        }
                    }
                }

					

            }
           //globalContext = document.getElementById("ansi").getContext("2d");
                    
			
           globalContext.drawImage(globalDisplay.canvas, 0, 0);
			}

        }

		