 
     var waitingforDoubleclick = false;
        var doubleclickInterval;
        
        var drawingMode = false;
        var mouseDown =false;
        var width=160;
        var height=52;
        var screenCharacterArray = Array();
                
        var currentCharset=1;
        var currentChar=216;
        
        var codepageImg;
        var currentColor=15;
        var ctx;
        var cursorShown=false;
        var ansimation;
        var cursorPosX=1;
        var cursorPosY=1;
        var cursorShown=true;
        var cursorInterval;
        var characterWidth, characterHeight;
        var insert=true;
        var currentBackground=0;
        var currentForeground=15;
        
        
        function setD(asciiCode, drawingBox) {
        
            currentCharset=drawingBox;
            currentChar=asciiCode;
        }
        
        var ansicolors = [
      '000000', 'cd0000', '00cd00', 'cdcd00', '1e90ff', 'cd00cd', '00cdcd', 'e5e5e5', '4c4c4c', 'ff0000',
      '00ff00', 'ffff00', '4682b4', 'ff00ff', '00ffff', 'FFFFFF', '000000', '00005F', '000087', '0000af', 
      '0000D7', '0000FF', '005F00', '005F5F', '005f87', '005faf', '005fd7', '005fff', '008700', '00875f', 
      '008787', '0087af', '0087d7', '0087ff', '00af00', '00af5f', '00af87', '00afaf', '00afd7', '00afff', 
      '00d700', '00d787', '00d787', '00d7af', '00d7af', '00d7ff', '00ff00', '00ff5f', '00ff87', '00ffaf', 
      '00ffd7', '00ffff', '5f0000', '5f5fff', '5f0087', '5f00af', '5f00d7', '5f00ff', '5f5f00', '5f5f5f', 
      '5f5f87', '5f5faf', '5f5fd7', '5f5fff', '5f8700', '5f875f', '5f8787', '5f87af', '5f87d7', '5f87ff', 
      '5faf00', '5faf5f', '5faf87', '5fafaf', '5fafd7', '5fafff', '5fd700', '5fd75f', '5fd787', '5fd7af', 
      '5fd7d7', '5fd7ff', '5fff00', '3399cc', '5fff87', '5fffaf', '5fffd7', '5fffff', '870000', '87005f', 
      '870087', '8700af', '8700af', '8700ff', '875f00', '875f5f', '875f87', '875faf', '875fd7', '875fff', 
      '878700', '87875f', '878787', '8787af', '8787d7', '8787ff', '87af00', '87af5f', '87af87', '87afaf', 
      '87afd7', '87afff', '87d700', '87d75f', '87d787', '87d7af', '87d7d7', '87d7ff', '87ff00', '87ff5f', 
      '87ff87', '87ffaf', '87ffd7', '87ffff', 'af0000', 'af005f', 'af0087', 'af00af', 'af00d7', 'af00ff', 
      'af5f00', 'af5f5f', 'af5f87', 'af5faf', 'af5fd7', 'af5fff', 'af8700', 'af875f', 'af8787', 'af87af', 
      'af87d7', 'af87ff', 'afaf00', 'afd7af', 'afaf87', 'afafaf', 'afafd7', 'afafff', 'afd700', 'afd75f', 
      'afd787', 'afd7af', 'afd7d7', 'afd7ff', 'afff00', 'afff5f', 'afff87', 'afffaf', 'afffd7', 'afffff', 
      'd70000', 'd7005f', 'dd2699', 'd700af', 'd700d7', 'd700ff', 'd75f00', 'd75f5f', 'd75f87', 'd75faf', 
      'd75fd7', 'd75fff', 'd78700', 'd7875f', 'd78787', 'd787af', 'd787d7', 'd787ff', 'd7af00', 'd7af5f', 
      'd7af87', 'd7afaf', 'd7afd7', 'd7afff', 'd7d75f', 'd7d75f', 'd7d787', 'd7d7af', 'd7d7d7', 'd7d7ff', 
      'd7ff00', 'd7ff5f', 'd7ff87', 'd7ffaf', 'd7ffd7', 'd7ffff', 'ff0000', 'ff005f', 'ff0087', 'ff00af', 
      'ff00d7', 'ff00ff', 'ff5f00', 'ff5f5f', 'ff5f87', 'ff5faf', 'ff5fd7', 'ff5fff', 'ff8700', 'ff875f', 
      'ff8787', 'ff87af', 'ff87d7', 'ffaf00', 'ffaf00', 'ffaf5f', 'ffaf87', 'ffafaf', 'ffafd7', 'ffafff', 
      'ffd700', 'ffd75f', 'ffd787', 'ffd7af', 'ffd7d7', 'ffd7ff', 'ffff00', 'ffff5f', 'ffff87', 'ffffaf',
      'ffffd7', 'ffffff', '080808', '121212', '1c1c1c', '262626', '303030', '3a3a3a', '444444', '4e4e4e',
      '585858', '626262', '6c6c6c', '767676', '808080', '8a8a8a', '949494', '9e9e9e', 'a8a8a8', 'b2b2b2',
      'bcbcbc', 'c6c6c6', 'd0d0d0', 'e4e4e4', 'e4e4e4', 'eeeeee', 'ffffff', '000000', '000000', '000000'
    ];
    
     var keys = new Array();
                keys[0] = [ 49, 50, 51, 52, 53, 54, 55, 56, 57, 48 ];
                keys[1] = [ 218, 191, 192, 217, 196, 179, 195, 180, 193, 194 ];
                keys[2] = [ 201, 187, 200, 188, 205, 186, 204, 185, 202, 203 ];
                keys[3] = [ 251, 184, 212, 190, 205, 179, 198, 181, 207, 209 ];
                keys[4] = [ 161, 183, 211, 135, 179, 186, 199, 182, 208, 144 ];
                keys[5] = [ 197, 206, 139, 140, 232, 163, 155, 156, 153, 239 ];
                keys[6] = [ 176, 177, 178, 219, 223, 219, 124, 141, 254, 250 ];
                keys[7] = [ 001, 002, 003, 004, 005, 006, 196, 127, 014, 207 ];
                keys[8] = [ 024, 025, 024, 025, 016, 017, 023, 023, 020, 021 ];
                keys[9] = [ 174, 175, 061, 243, 169, 170, 253, 246, 171, 172 ];
                keys[10] = [ 149, 241, 020, 021, 235, 157, 227, 167, 251, 252 ];
                keys[11] = [ 162, 225, 147, 228, 230, 232, 235, 236, 237, 237 ];
                keys[12] = [ 128, 135, 165, 164, 152, 159, 044, 249, 173, 168 ];
                keys[13] = [ 131, 132, 133, 160, 248, 134, 142, 143, 145, 146 ];
                
   
                keys[14] = [ 136, 137, 138, 130, 144, 140, 139, 141, 161, 158 ];
                keys[15] = [ 147, 148, 149, 224, 167, 150, 129, 151, 163, 154 ];
        
        function updateCanvasSize() {
            
        }
        
         function redrawCursor() {
            cursorShown=true;
            //clearInterval(cursorInterval);
            ctx = document.getElementById("ansi").getContext("2d");
        
            codepage.drawChar(ctx, insert==false ? 220 : 95, 15, 0, cursorPosX, cursorPosY, true); // shows cursor transparently
            //cursorInterval = setInterval(function() { toggleCursor(); }, 500);
        }
       
        function getDisplayWidth() {
            return width; // return parseInt(document.getElementById('displaywidth').value);
        }
        function getDisplayHeight() {
            return height; // return parseInt(document.getElementById('displayheight').value);
        }
        
        function setCursorPosX(x) {
             console.log("setting x to "+x);
            cursorPosX=x;
        }
        
        function setCursorPosY(y) {
            console.log("setting y to "+y);
            cursorPosY=y;
        }
        
        function setCursorPosXNoDebug(x) {
            cursorPosX=x;
        }
        
        function setCursorPosYNoDebug(y) {
            cursorPosY=y;
        }
        
        function initansicanvas() {
                setTimeout(function() { toggleCursor(true); }, 1000);
             
                ansicanvas = document.getElementById('ansi');
                ansicanvas.addEventListener('mousedown', function(e) {
                    
                    if (waitingforDoubleclick==false) {
                        hidePanel();
                        waitingforDoubleclick = true;
                        clearTimeout(doubleclickInterval);
                        doubleclickInterval = setTimeout(function() { waitingforDoubleclick=false; }, 300);
                        
                    } else {
                        showPanel();
                    }
                    
                    mouseDown=true;
                    mouseMove(ansicanvas, e);
                   
                    console.log("drawing mode:"+drawingMode);
                    if (drawingMode) {
                        console.log("char:"+currentChar);
                        codepage.drawChar(ctx, currentChar, currentForeground, currentBackground, cursorPosX, cursorPosY, false); // false == update coordinate system
                    }
                    
                     
                    
                }, true);
                
                document.getElementById('panel').addEventListener('mousedown', function(e) {
                    if (waitingforDoubleclick==false) {
                        waitingforDoubleclick = true;
                        clearTimeout(doubleclickInterval);
                        doubleclickInterval = setTimeout(function() { waitingforDoubleclick=false; }, 400);
                    } else { // we can save us the work and clear the timeout
                        hidePanel();
                        waitingforDoubleclick = false;
                        clearTimeout(doubleclickInterval);
                    }
                });
                    
                
                ansicanvas.addEventListener('mouseleave', function(e) {
                    mouseDown=false;
                });
                
                ansicanvas.addEventListener('mouseup', function(e) {
                   mouseDown=false; 
                });
                
                ansicanvas.addEventListener('mousemove', function(e) {
                   
                   if (mouseDown==true) {
                    
                   mouseMove(ansicanvas,e);
                    
                   if (drawingMode==true) {
                        codepage.drawChar(ctx, currentChar, currentForeground, currentBackground, cursorPosX, cursorPosY, false); // false == update coordinate system
                    }
                    
                   }
                   
                });

               
        }
        
        function mouseMove(ansicanvas, e) {
            
            var mouse = getMousePos(ansicanvas, e);
                    var mx = mouse.x;
                    var my = mouse.y;                    
                    
                    showCharacter();
                    
                    myCursorPosX = Math.floor(mx / canvasCharacterWidth)+1;
                    myCursorPosY = Math.floor(my / canvasCharacterHeight)+1;
                    
                    if (myCursorPosX>width) { console.log(myCursorPosX+" too far"); setCursorPosX(width); redrawCursor(); return; }
                    if (myCursorPosY>height) { console.log(myCursorPosY+" too high"); setCursorPosY(height); redrawCursor(); return; }
                    
                    setCursorPosX(myCursorPosX);
                    setCursorPosY(myCursorPosY);
                    
                    redrawCursor();
            
        }
        
        function showPanel() {
            if ($('#panel').css('display')!="block") {
                         $(".panel").slideDown("slow", "easeOutBounce");
                        } 
                        waitingforDoubleclick = false;
                        clearTimeout(doubleclickInterval);
        }
        
        function hidePanel() {
            if ($('#panel').css('display')=="block") {
                 $(".panel").slideUp("slow", "easeOutBounce");
            }
            waitingforDoubleclick = false;
            clearTimeout(doubleclickInterval);
        }
        
        function setANSICanvasSize() {
            var displayWidth=getDisplayWidth();
            var displayHeight=getDisplayHeight();
            
            for (var y = 1; y <= displayHeight; y++) 
            {                    
                    var xArray = Array();
                    for (var x = 1; x <= displayWidth; x++) 
                    {
                     var data = Array();
                     data[0]=32; // ascii code
                     data[1]=15; // foreground color
                     data[2]=0; // background color
                     xArray[x]=data;
                    }
                    screenCharacterArray[y]=xArray;
                    
                    //console.log("y:"+y+" length:"+screenCharacterArray[y].length);
            }
           $('body').attr('onresize', 'resize_canvas();');
            
        }
        
        function toggleCursor(interval) {
     
            cursorShown=!cursorShown;
            ctx = document.getElementById("ansi").getContext("2d");
            
            if (cursorShown) {
            // Depending on what cursor is active, shows character code 220 or character code 95
            codepage.drawChar(ctx, insert==false ? 220 : 95, 15, 0, cursorPosX, cursorPosY, true); // shows cursor transparently
            
            } else {
                showCharacter();
            }
            
            if ( (typeof(interval)!="undefined") && (interval==true) ) {
                setTimeout(function() { toggleCursor(true); }, 500);
            }
            
        }
        
       
        
        function showCharacter() {
            console.log("x:"+cursorPosX+" y: "+cursorPosY);
            var asciiCode = screenCharacterArray[cursorPosY][cursorPosX][0];
            var foreground = screenCharacterArray[cursorPosY][cursorPosX][1];
            var background = screenCharacterArray[cursorPosY][cursorPosX][2];
            
            ctx = document.getElementById("ansi").getContext("2d");
     
            codepage.drawChar(ctx, asciiCode, foreground, background, cursorPosX, cursorPosY, false);
            
        }
        
       function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }
    
    function cursorMove() {
        
    }
    
   function handleKeyCode(keyCode,e) {
                console.log(keyCode);
                
               
               
                console.log("keyCode:"+keyCode);
                if ( (keyCode>=48) && (keyCode<=57) )
                {
                        if (keyCode==48) keyCode=9; else
                        keyCode=keyCode-49;
                   
                        executeKey(keys[(currentCharset-1)][keyCode]);
                   
                    return true;
                }
              
                switch(keyCode){
                    case 249 :
                               executeKey(151); // high two becomes ( for french keyboard
                        return true;
                        break;
                            
                    case 178: executeKey(40); // high two becomes ( for french keyboard
                        return true;
                        break;
                            
                       case 224: executeKey(133); // a accent
                             
                
                      return true;
                        case 232: executeKey(138); // e accent
                             
                
                      return true;
                      break;
                         case 231: executeKey(135); // ca
                             
                
                      return true;
                      break;
            case 233: executeKey(130); // e accent
                
                      return true;
                      break;
            case 176 : 
                            executeKey(167);
                    return true;
                    break;
                     case 96 : // opening single quote - convert to standard single quote due to cursor right bug on single quote
                            executeKey(39);
                            return true;
                            break;
                    case 219 : // bracket right
                            executeKey(93);
                            return true;
                            break;
                        case 221: // bracket left
                            executeKey(91);
                            return true;
                            break;
                     case 220 : // UE or backslash
                            if (e.shiftKey) { 
                                executeKey(154);
                            } else {
                                executeKey(92);
                            }
                            return true;
                            break;
                             case 214 :
                            executeKey(153);
                            return true;
                            break;
                             case 196 :
                            executeKey(142);
                            return true;
                            break;
                    case 228 :
                            executeKey(132);
                            return true;
                            break;
                    case 246 :
                            executeKey(148);
                            return true;
                            break;
                        case 252 :
                            executeKey(129);
                            return true;
                            break;
                        case 191: 
                            executeKey(47);
                            return true;
                            break;
                    case 222: // single/double quote
                            if (!e.shiftKey) { 
                            executeKey(39);
                            } else {
                            executeKey(34); // double quote
                            }
                            return true;
                            break;
                    case 192 :
                            executeKey(39);
                            return true;
                            break;
                    case 48 : 
                            if (!e.shiftKey) { 
                                executeKey(48);
                            } else {
                                executeKey(61);
                            }
                            return true;
                            break;
                        case 223: // sz
                            executeKey(225);
                            break;
                    case 13 : 
                            showCharacter();
                            setCursorPosX(1);
                            if (cursorPosY<getDisplayHeight()) {
                              setCursorPosY(cursorPosY+1);
                            }
                            redrawCursor();
                            break;
                        case 180 : // single quote above sz
                            executeKey(39);
                            return true;
                            break;
                    case 39 : // right
                            if (e.shiftKey) { 
                              
                                        executeKey(39);
                              }
                              return true;
                              break;
                          case 40 : // down
                              if (e.shiftKey) { 
                              
                              executeKey(40);
                              }
                              return true;
                              break;
                          case 37: // left, %
                              if (e.shiftKey) { 
                                
                                  executeKey(37);
                              }
                            return true;
                              break;
                          case 38: // up
                               if (e.shiftKey) { 
                              
                                   executeKey(38);
                               }
                            return true;
                              break;
                          case 8:
                              setCursorPosX(cursorPosX-1);
                              var currentPos = cursorPosX;
                              
                              while (currentPos < getDisplayWidth()) 
                              {
                                      var asciiCode = screenCharacterArray[cursorPosY][currentPos+1][0];
                                      var fgcolor = screenCharacterArray[cursorPosY][currentPos+1][1];
                                      var bgcolor = screenCharacterArray[cursorPosY][currentPos+1][2];
                                      codepage.drawChar(ctx, asciiCode, fgcolor, bgcolor, currentPos, cursorPosY);
                                      currentPos++;                                      
                              }
                              
                              redrawCursor();
                          return true;
                         
                          default : 
                              
                                  
                                 
                                executeKey(keyCode);
                           
                              return true;
                              break;
                }
                return false;
   }
   
   
   
   function handleKeyCode2(keyCode,e) {
             
                
                switch(keyCode){
             
                    case 39 : // right
                            if (!e.shiftKey) { 
                                showCharacter();
                                if (cursorPosX<getDisplayWidth()) {
                                    setCursorPosX(cursorPosX+1);
                                    redrawCursor();
                                }
                              }
                              return true;
                              break;
                          case 40 : // down
                              if (!e.shiftKey) {
                                showCharacter();
                                if (cursorPosY<getDisplayHeight()) {
                                cursorPosY++;
                                redrawCursor();
                                }
                              }
                              return true;
                              break;
                          case 37: // left, %
                              if (!e.shiftKey) { 
                              showCharacter();
                              if (cursorPosX>1) {
                              setCursorPosX(cursorPosX-1);
                              redrawCursor();
                            }
                              }
                            return true;
                              break;
                          case 38: // up
                               if (!e.shiftKey) { 
                              showCharacter();
                              if (cursorPosY>1) {
                                    cursorPosY--;
                                    redrawCursor();
                                }
                               }
                              
                              break;
                          default:
                         
                              return true;
                              break;
                }
                return false;
   }
   
   function executeKey(keyCode) {
       
       if (insert==false) {
        
                                    codepage.drawChar(ctx, keyCode, currentForeground, currentBackground, cursorPosX, cursorPosY);
                                    if (cursorPosX<getDisplayWidth()) { setCursorPosX(cursorPosX+1); }
                                    redrawCursor();
                                } else {
                                    var currentPos=getDisplayWidth();
                                    while (currentPos>cursorPosX) 
                                    {
                                      var asciiCode = screenCharacterArray[cursorPosY][currentPos-1][0];
                                      var fgcolor = screenCharacterArray[cursorPosY][currentPos-1][1];
                                      var bgcolor = screenCharacterArray[cursorPosY][currentPos-1][2];

                                      codepage.drawChar(ctx, asciiCode, fgcolor, bgcolor, currentPos, cursorPosY);
                                      currentPos--;
                                      
                                    }
                                    
                                    codepage.drawChar(ctx, keyCode, currentForeground, currentBackground, cursorPosX, cursorPosY);
                                    if (cursorPosX<getDisplayWidth()) { setCursorPosX(cursorPosX+1); }
                                    redrawCursor();
                                }
       
   }
   
    function clearScreen() 
    {
       if (confirm('Are you sure?')) {
       setCursorPosX(1);
       setCursorPosY(1);
       redrawCursor();
      
       while (cursorPosY<=height) 
       {
        setCursorPosX(1);
        while (cursorPosX<=width) 
        {
               
                //codepage.drawChar(ctx, 32, 0, currentBackground, cursorPosX, cursorPosY, false);
                var charArray = Array();
                         charArray[0]=32;
                         charArray[1]=currentForeground;
                         charArray[2]=currentBackground;
                         
                screenCharacterArray[cursorPosY][cursorPosX]=charArray;
                setCursorPosXNoDebug(cursorPosX+1);
                
        }
        setCursorPosY(cursorPosY+1);
       }
       setCursorPosX(1);
       setCursorPosY(1);
       var bgstring = "#"+ansicolors[currentBackground];
      
       ctx = document.getElementById("ansi").getContext("2d");
       ctx.fillStyle = bgstring;
       ctx.fillRect(0, 0, canvas.width, canvas.height);
       redrawCursor();
        }
    }
   
   function registerKeyEventListener() { 
		
                document.body.addEventListener('keypress',
                function(e)
                {
                
                    var keyCode = e.which;
                    if (keyCode!=0) {
                        if(window.handleKeyCode(keyCode,e)) e.preventDefault();
                    }
                
                },
                false);
                
                document.body.addEventListener('keydown',
                function(e)
                {
                    var keyCode = e.which;
                    if (keyCode==27) {
                        showHidePanel();
                    } else
                    if ( (keyCode<=40) && (keyCode>=37) ) { 
                        if(window.handleKeyCode2(keyCode,e)) e.preventDefault();
                    }
                    
                
                },
                false);
                
               
                
    }
        
        function resize_canvas(){
            
            canvas = document.getElementById("ansi");
            ctx = document.getElementById("ansi").getContext("2d");
            resize(canvas);
           
            for (var y = 1; y < screenCharacterArray.length; y++) {
           
                for (var x = 1; x < screenCharacterArray[y].length; x++) {
                
                     
                     var charArray = screenCharacterArray[y][x];
                     asciiCode=charArray[0];
                     foreground=charArray[1];
                     background=charArray[2];
                    
                    
                     codepage.drawChar(ctx, asciiCode, foreground, background, x, y, false);
                     
                }
            }
        }
        
        function resize(canvas) {
      
        var window_innerWidth = $(window).width();
        var window_innerHeight = $(window).height();
      
                var canvaswidth  = window_innerWidth-20;
                var canvasheight=Math.floor(window_innerWidth*0.5625);
                if (canvasheight>(window_innerHeight-20)) {
                    x=(window_innerHeight-20)/canvasheight;
                    canvasheight=Math.floor(canvasheight*x);
                    canvaswidth=Math.floor(canvaswidth*x);
                }
                
                canvas.width=canvaswidth;
                canvas.height=canvasheight;
              
                
                canvasCharacterWidth=Math.floor(canvaswidth/getDisplayWidth());
                canvasCharacterHeight=Math.floor(canvasheight/getDisplayHeight());
              
                
            return canvas;
        }
        
        
       function d2h(d) {return d.toString(16);}
       function h2d(h) {return parseInt(h,16);} 
        
      
        
       function myexport() {
       
                cursorY=1;

                var html="";

                while (cursorY<=height) 
                {
                 
                 cursorX=1;
                 
                 var lineWidth=width;
                 
                 
                 lineAsciiCode=screenCharacterArray[cursorY][lineWidth][0];
                 lineBackground=screenCharacterArray[cursorY][lineWidth][2];
                 
                 while ( (lineAsciiCode==32) && (lineBackground==0) && (lineWidth>=1) ) 
                 {
                     lineAsciiCode=screenCharacterArray[cursorY][lineWidth][0];
                     lineBackground=screenCharacterArray[cursorY][lineWidth][2];
                     if (lineAsciiCode==32)
                     lineWidth--;
                 }
                 
                
                 while (cursorX<=lineWidth) 
                 {
                        var charArray = screenCharacterArray[cursorY][cursorX];

                        var asciiCode = String(d2h(charArray[0]));
                        var foreground = String(d2h(charArray[1]));
                        var background = String(d2h(charArray[2]));
                   
                        while (asciiCode.length<2) asciiCode="0"+asciiCode;
                        while (foreground.length<2) foreground="0"+foreground;
                        while (background.length<2) background="0"+background;
                        
                        
                        html+=asciiCode+foreground+background;

                        cursorX++;
                 }
                 html+="brklne";
                 cursorY++;
                }
                
                
                $.ajax({
                url: 'export.php',
                type: 'POST',
                dataType : 'json',
                data: { value: html },
                success: function(result) {
                   $('#file').html(result.filename);
                   $('#file').attr("href", "download/"+result.filename);
                   $('#part1').css('display', 'inline');
                   $('#part2').css('display', 'none');
                   $('#popup').bPopup();
                }
                });
            
        }