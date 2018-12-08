<!--
/* The MIT License (MIT)
 *
 * Copyright (c) 2016 Oliver Bachmann, Karlsruhe, Germany
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
--> 
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <title>ascii.rocks</title>
    <script>
        /** This contains the ansi colors used in the color picker. No guarantee at all **/
        window.ansicolors = [
      '000000', 'cd0000', '00cd00', 'cdcd00', '1e90ff', 'cd00cd', '00cdcd', 'e5e5e5', '4c4c4c', 'ff0000', // 10
      '00ff00', 'ffff00', '4682b4', 'ff00ff', '00ffff', 'FFFFFF', '000000', '00005F', '000087', '0000af', // 20
      '0000D7', '0000FF', '005F00', '005F5F', '005f87', '005faf', '005fd7', '005fff', '008700', '00875f', // 30
      '008787', '0087af', '0087d7', '0087ff', '00af00', '00af5f', '00af87', '00afaf', '00afd7', '00afff', // 40
      '00d700', '00d787', '00d787', '00d7af', '00d7af', '00d7ff', '00ff00', '00ff5f', '00ff87', '00ffaf', // 50
      '00ffd7', '00ffff', '5f0000', '5f5fff', '5f0087', '5f00af', '5f00d7', '5f00ff', '5f5f00', '5f5f5f', // 60
      '5f5f87', '5f5faf', '5f5fd7', '5f5fff', '5f8700', '5f875f', '5f8787', '5f87af', '5f87d7', '5f87ff', // 70
      '5faf00', '5faf5f', '5faf87', '5fafaf', '5fafd7', '5fafff', '5fd700', '5fd75f', '5fd787', '5fd7af', // 80
      '5fd7d7', '5fd7ff', '5fff00', '3399cc', '5fff87', '5fffaf', '5fffd7', '5fffff', '870000', '87005f', // 90
      '870087', '8700af', '8700af', '8700ff', '875f00', '875f5f', '875f87', '875faf', '875fd7', '875fff', // 100 
      '878700', '87875f', '878787', '8787af', '8787d7', '8787ff', '87af00', '87af5f', '87af87', '87afaf', // 110
      '87afd7', '87afff', '87d700', '87d75f', '87d787', '87d7af', '87d7d7', '87d7ff', '87ff00', '87ff5f', // 120
      '87ff87', '87ffaf', '87ffd7', '87ffff', 'af0000', 'af005f', 'af0087', 'af00af', 'af00d7', 'af00ff', // 130
      'af5f00', 'af5f5f', 'af5f87', 'af5faf', 'af5fd7', 'af5fff', 'af8700', 'af875f', 'af8787', 'af87af', // 140
      'af87d7', 'af87ff', 'afaf00', 'afd7af', 'afaf87', 'afafaf', 'afafd7', 'afafff', 'afd700', 'afd75f', // 150
      'afd787', 'afd7af', 'afd7d7', 'afd7ff', 'afff00', 'afff5f', 'afff87', 'afffaf', 'afffd7', 'afffff', // 160
      'd70000', 'd7005f', 'dd2699', 'd700af', 'd700d7', 'd700ff', 'd75f00', 'd75f5f', 'd75f87', 'd75faf', // 170
      'd75fd7', 'd75fff', 'd78700', 'd7875f', 'd78787', 'd787af', 'd787d7', 'd787ff', 'd7af00', 'd7af5f', // 180
      'd7af87', 'd7afaf', 'd7afd7', 'd7afff', 'd7d75f', 'd7d75f', 'd7d787', 'd7d7af', 'd7d7d7', 'd7d7ff', // 190
      'd7ff00', 'd7ff5f', 'd7ff87', 'd7ffaf', 'd7ffd7', 'd7ffff', 'ff0000', 'ff005f', 'ff0087', 'ff00af', // 200
      'ff00d7', 'ff00ff', 'ff5f00', 'ff5f5f', 'ff5f87', 'ff5faf', 'ff5fd7', 'ff5fff', 'ff8700', 'ff875f', // 210
      'ff8787', 'ff87af', 'ff87d7', 'ffaf00', 'ffaf00', 'ffaf5f', 'ffaf87', 'ffafaf', 'ffafd7', 'ffafff', // 220
      'ffd700', 'ffd75f', 'ffd787', 'ffd7af', 'ffd7d7', 'ffd7ff', 'ffff00', 'ffff5f', 'ffff87', 'ffffaf', // 230
      'ffffd7', 'ffffff', '080808', '121212', '1c1c1c', '262626', '303030', '3a3a3a', '444444', '4e4e4e', // 240
      '585858', '626262', '6c6c6c', '767676', '808080', '8a8a8a', '949494', '9e9e9e', 'a8a8a8', 'b2b2b2', // 250
      'bcbcbc', 'c6c6c6', 'd0d0d0', 'e4e4e4', 'e4e4e4', 'eeeeee', 'ffffff', '000000', '000000', '000000'  // 260
    ];
   // Initializes the canvas object using the image that is available inside the images directory for. The image consists of 8x16px blocks in different colors.
   

    
      function initScreenCharacterArray(currentBackground) {
            var charArray = new Array();
            charArray[0]=32;
            charArray[1]=currentForeground;
            charArray[2]=currentBackground;
            var startY = 0;
            
             var bgstring = "#"+ansicolors[currentBackground];
                      while (startY<totalVisibleHeight) 
                      {
                       var startX=0;
                       screenCharacterArray[startY]=[];
                       while (startX<totalVisibleWidth) 
                       {
                               screenCharacterArray[startY][startX++]=charArray;


                       }
                       startY++;
                      }
    }
    


       doRedraw=false;
        var currentDraw=0;
        /** used in connection with mouse click **/
        var waitingforDoubleclick = false;
        /** timer used for mouseclick **/
        var doubleclickInterval;
        /** Canvas context obect **/
        var globalContext;
        /** When we are drawing by using mouse clicks, this is set to true **/
        var drawingMode = false;
        /** Set on mouse click, and evaluated in mousemove **/
        var mouseDown =false;
        /** This is the general width and height, used globally to show the right coordinate system inside the canvas **/
        var width=320;
        var height=90;


        var screenCharacterArray = new Array();
        
        var movingX = false;
        var movingY = false;
        var movingXStartPos = 0;
        var movingYStartPos = 0;
        
        // Check/uncheck if the scrollbar is being shown
        var scrollBarXShown = 1;
        var scrollBarYShown = 1;
        
        var visibleWidth = 160;
        var visibleHeight = 45;
        var totalVisibleWidth = 320;
        var totalVisibleHeight=90;
        var firstLine=0;
        var leftLine=0;

        
        var resizeToScreen=false;
        /** This contains all characters. This is an array with three int values **/
        /*
        asciiCode = screenCharacterArray[cursorPosY][currentPos-1][0];
        fgcolor = screenCharacterArray[cursorPosY][currentPos-1][1];
        bgcolor = screenCharacterArray[cursorPosY][currentPos-1][2];
        */
       var hideTimer; // Gets used when toggling the color using CTRL-Cursor for clearing the currently shown color
 
        var screenCharacterArray = new Array();
        initScreenCharacterArray(14);
                
        /** When changing the charset. Number one indicates characters from 1-9, other characters are ascii codes **/
        var currentCharset=7;
        /** This is the character used when drawing **/
        var currentChar=216;
        
        /** This is an image object, containing the image used when initializing the Codepage object, which has the parameter "images/CO_437_8x16.png" for setting this image **/
        var codepageImg;
        /** Actual color. Can get changed by changing the foreground inside the panel with the colors **/
        var currentColor=15;
        /** This is ctx = document.getElementById("ansi").getContext("2d"); and gets set at different positions. Should be all at one position **/
        var ctx;
        
        /** This is not used at the moment (shape.js) and should be used for dragging a small overview image (rectangular box) showing the complete ANSI image when it's too large **/
        var ansimation;
        /** Cursor X and Y positions start at 0, when the cursor is at 1,1 **/
        var cursorPosX=0;
        var cursorPosY=0;
        /** Used for toggling the cursor **/
        var cursorShown=true;
        /** Timer used or displaying displaying the cursor in a certain time span, toggling from shown to not shown */
        var cursorInterval;
        /** Depending on the screen size, this has a certain value of pixels **/
        var characterWidth, characterHeight;
        /** Depending on what cursor mode is on: Insert or overwrite, whereby in this case different ascii charsets get used **/
        var insert=true;
        /** Stores the current fore and background color **/
        var currentBackground=0;
        var currentForeground=15;
        
        var copyMode=false;
        var copyStartX=0;
        var copyStartY=0;
        var copyEndX=0;
        var copyEndY=0;
        
        
        var copyArray=new Array();
        var copyWidth=0;
        var copyHeight=0;
        
        var undo = new Array();
        var redo = new Array();
        
        
        var ctrlKey=false;
        
        /** This gets called when pressing on the blue window, and sets the character set as well as the ascii code for drawing **/
        function setD(asciiCode, drawingBox) {
        
            currentCharset=drawingBox;
            currentChar=asciiCode;
        }
        
    
    /** This contains the special characters when choosing one of the character blocks inside the blue window **/
     var keys = new Array();
                keys[0] = [ 49, 50, 51, 52, 53, 54, 55, 56, 57, 48 ];
                keys[1] = [ 218, 191, 192, 217, 196, 179, 195, 180, 193, 194 ];
                keys[2] = [ 201, 187, 200, 188, 205, 186, 204, 185, 202, 203 ];
                keys[3] = [ 251, 184, 212, 190, 205, 179, 198, 181, 207, 209 ];
                keys[4] = [ 161, 183, 211, 135, 179, 186, 199, 182, 208, 144 ];
                keys[5] = [ 197, 206, 139, 140, 232, 163, 155, 156, 153, 239 ];
                keys[6] = [ 176, 177, 178, 219, 223, 220, 124, 141, 254, 250 ];
                keys[7] = [ 001, 002, 003, 004, 005, 006, 196, 127, 014, 207 ];
                keys[8] = [ 024, 025, 024, 025, 016, 017, 023, 023, 020, 021 ];
                keys[9] = [ 174, 175, 061, 243, 169, 170, 253, 246, 171, 172 ];
                keys[10] = [ 149, 241, 020, 021, 235, 157, 227, 167, 251, 252 ];
                keys[11] = [ 162, 225, 147, 228, 230, 232, 235, 236, 237, 237 ];
                keys[12] = [ 128, 135, 165, 164, 152, 159, 044, 249, 173, 168 ];
                keys[13] = [ 131, 132, 133, 160, 248, 134, 142, 143, 145, 146 ];
                
   
                keys[14] = [ 136, 137, 138, 130, 144, 140, 139, 141, 161, 158 ];
                keys[15] = [ 147, 148, 149, 224, 167, 150, 129, 151, 163, 154 ];
    </script>
    <script src="scripts/codepagedisplay.js" type="text/javascript"></script>
    <script src="scripts/scrollbar.js" type="text/javascript"></script>
    <script src="scripts/shape.js" type="text/javascript"></script>
    <script src="scripts/jquery-1.9.1.min.js" type="text/javascript"></script>
    <script src="scripts/jquery.simple-color.js" type="text/javascript"></script>
    <script src="scripts/jquery-ui-1.10.4.custom.min.js"></script>
    <script src="scripts/jquery.bpopup.js"></script>
    <script src="scripts/app.js"></script>
    <script src="scripts/buffer.js"></script>
    <script src="scripts/scrollbar.js"></script>
    <script src="asciiss/scripts/parse.js"></script>
    <script src="fileuploader/fileuploader.js"></script>
	  <script src="scripts/interpreter.js"></script>
	  <script src="scripts/requestanimframe.js"></script>
    <link rel="stylesheet" href="css/panel.css" type="text/css" media="screen" />
    <link rel="stylesheet" href="css/style.css" type="text/css" media="screen" />
   
    <style type="text/css" media="screen">
   
    @media only screen and (max-width: 480px) {
        .left, .right {
            float: none;
            width: 100%;
        }
    }
    body {
        overflow:hidden;
    }
    </style>
    <script>
        canvasCharacterWidth = 8;
        canvasCharacterHeight = 16;
        var currentSong=0;
        var JAVASCRIPT_TEXT_DROP_HERE_TO_UPLOAD="Drop files here to upload";
        var JAVASCRIPT_TEXT_UPLOAD_A_FILE="Upload a file"; 
        var JAVASCRIPT_TEXT_CANCEL="Cancel";
        var JAVASCRIPT_TEXT_UPLOAD_FAILED="Upload failed";
        var JAVASCRIPT_TEXT_UPLOAD_SIZE1="Unfortunately the file(s) you selected were not the type we were expecting. Only";
        var JAVASCRIPT_TEXT_UPLOAD_SIZE2="are allowed";
        var JAVASCRIPT_TEXT_MAX_SIZE_ERROR="The file is too large";
        var JAVASCRIPT_TEXT_MIN_SIZE_ERROR="The file is too small";
        var JAVASCRIPT_TEXT_EMPTY_ERROR="Empty";
        var JAVASCRIPT_TEXT_ON_LEAVE="The files are being uploaded, if you leave now the upload will be cancelled.";

     function goodbye(e) {
	if(!e) e = window.event;
	//e.cancelBubble is supported by IE - this will kill the bubbling process.
	e.cancelBubble = true;
	e.returnValue = 'Are you sure you want to leave?'; //This is displayed on the dialog

	//e.stopPropagation works in Firefox.
	if (e.stopPropagation) {
		e.stopPropagation();
		e.preventDefault();
	}
}


window.onbeforeunload=goodbye;
  
    $(document).ready(function(){
        
        codepage = new Codepage("assets/CO_437_8x16vga.png", function() {
            
            setCanvasSize(document.getElementById("ansi"));
            setANSICanvasSize();
              
            globalContext = document.getElementById("ansi").getContext("2d");
            display = new Display();
            doClearScreen(false);
            
                
                
                updateScrollbarX(0);
                updateScrollbarY(0);
           
            if (localStorage["ansicanvas"]) 
            {
                
                if (confirm('Do you want to continue to work on your current drawing?')) {
                var currentPosY=1;
               
                var screenCharacterArray=JSON.parse(localStorage["ansicanvas"]);
               
                while (currentPosY<getDisplayHeight()-1) 
                                    {
                                        var currentPosX=1;
                                        
                                        var maxWidth = getDisplayWidth()-1;
                                        //if (scrollbarY) maxWidth--;
                                        
                                        while (currentPosX<maxWidth)
                                        {
                                         if (typeof(screenCharacterArray[currentPosY][currentPosX-1])=="undefined") 
                                         {
                                             console.log("Error Y: "+currentPosY+" X: "+(currentPosX-1)+" is undefined");
                                             break;
                                        } else {
                                                var asciiCode = screenCharacterArray[currentPosY][currentPosX-1][0];
                                                var fgColor = screenCharacterArray[currentPosY][currentPosX-1][1];
                                                var bgColor = screenCharacterArray[currentPosY][currentPosX-1][2];

                                                codepage.drawChar(ctx, asciiCode, fgColor, bgColor, currentPosX, currentPosY);
                                          }
                                          currentPosX++;

                                         }
                                         currentPosY++;
                                    }
                  } else {
                      interpreter = new Interpreter("ans/test.ans", display);
                  }
            } else {
                interpreter = new Interpreter("ans/test.ans", display);
            }
            
        });
        
        
        /*
          $.ajax({
                url: 'music/get_urls.php',
                type: 'GET',
                success: function(result) {
                    
                    $('#panel').append(result);
                   
                    player = new MediaElementPlayer('#mp3', {audioWidth:280, success: function(mediaElement) {
                           
                           
                            mediaElement.addEventListener('ended', function() {
           
                                   var src = $('#allsongs ').find("li").eq(currentSong).attr('src');
                                 

                                    $('#mp3').attr('src', src);
                                    player.play();
                                    currentSong++;
                                    if (currentSong>=$('#allsongs').find("li").length) currentSong=1;

                            });
                    } });
                
                    currentSong++;
                    player.play();
                    
                    
                        $('.mejs-time-total').unbind('mouseenter');
                }
                });*/
        
       
            $('#foreground_color').simpleColor({
              boxHeight: 40,
              cellWidth: 40,
              cellHeight: 20,
              chooserCSS: { 'border': '1px solid #660033' },
              displayCSS: { 'border': '1px solid red' },
              displayColorCode: true,
              colors : ansicolors,
              livePreview: true,
              // element is a html element
              onSelect: function(hex, element) {
             
                for (var i = 0; i < ansicolors.length; i++) {
                    if (ansicolors[i]==hex) {
                        currentForeground=i;
                        break;
                    }
                }
              },
              onOpen : function(element) {
                $('.columns').hide();  
              },
              onCellEnter: function(hex, element) {
              },
              onClose: function(element) {
                  $('.columns').show();
              }
            });
            $('#background_color').simpleColor({
              boxHeight: 40,
              cellWidth: 40,
              cellHeight: 20,
              chooserCSS: { 'border': '1px solid #660033' },
              displayCSS: { 'border': '1px solid red' },
              displayColorCode: true,
              colors : ansicolors,
              livePreview: true,
              // element is a html element
              onSelect: function(hex, element) {
             
                for (var i = 0; i < ansicolors.length; i++) {
                    if (ansicolors[i]==hex) {
                        currentBackground=i;
                       
                        break;
                    }
                }
              },
              onOpen : function(element) {

                  $('.columns').hide();
              },
              onCellEnter: function(hex, element) {
              },
              onClose: function(element) {
   
                   $('.columns').show();
              }
            });
           registerKeyEventListener();initansicanvas();
           var uploader = new qq.FileUploader({
                // pass the dom node (ex. $(selector)[0] for jQuery users)
                element: document.getElementById('file-uploader'),
                // path to server-side upload script
                action: 'upload.php',
                allowedExtensions: ["ans"],
                acceptFiles: null,		// comma separated string of mime-types for browser to display in browse dialog
                            
                abortOnFailure: true, // Fail all files if one doesn't meet the criteria
                // events
                // return false to cancel submit
                onSubmit: function(id, fileName){},
                onProgress: function(id, fileName, loaded, total){},
                onComplete: function(id, fileName, responseJSON){ // The json looks like this: {"success":true,"filename":282806397}
                    $('.qq-upload-list').html('');
                    
                    var filename=responseJSON.filename;
            
                    globalContext = document.getElementById("ansi").getContext("2d");
                    display = new Display();
                    charactersatonce = 999999; //Math.floor((baud || 115200) / 8 / 100);
                    doClearScreen(true);
                    interpreter = new Interpreter("uploads/"+filename+".ans", display);
                    
                },
                onCancel: function(id, fileName){
                    $('.qq-upload-list').html('');
                },
                onUpload: function(id, fileName, xhr){},
                        onError: function(id, fileName, xhr) {
                            $('.qq-upload-list').html('');
                        },
                // messages                
                messages: {
                    typeError: JAVASCRIPT_TEXT_UPLOAD_SIZE1+" {extensions} "+JAVASCRIPT_TEXT_UPLOAD_SIZE2,
                    sizeError: "{file} "+JAVASCRIPT_TEXT_MAX_SIZE_ERROR+" {sizeLimit}.",
                    minSizeError: "{file} "+JAVASCRIPT_TEXT_MIN_SIZE_ERROR+" {minSizeLimit}.",
                    emptyError: "{file} "+JAVASCRIPT_TEXT_EMPTY_ERROR,
                    onLeave: JAVASCRIPT_TEXT_ON_LEAVE            
                },
                showMessage: function(message){
                    alert(message);
                },
                sizeLimit: 200000,   
                minSizeLimit: 0         
                   });
           
    });
    
   
    </script>
</head>
<body>
    <div class="panel" id="panel">
            <h3>Ansi editor</h3>
            <p>This is an ansi editor made of HTML5 and canvas</p>
            <p>The sourcecode is available on <a href="http://www.github.com/fanside/ansieditor" target="_blank">GitHub</a>. You can choose different charsets and show them by pressing 1-9, or you can paint a certain character with the mouse. You can also export the file to xterm ANSI.</p>
            <p>Hold the SHIFT button to mark ANSI code, and press CTRL-C to copy, and CTRL-V to overwrite ansi code with code from clipboard</p>
            <div style="clear:both;"></div>
            <h3>Foreground color</h3>
  <input id='foreground_color' value='#993300'/>
  <h3>Background color</h3>
  <input id='background_color' value='#993300'/>
  
  <div class="columns">
                    <div class="colleft">
                    <h3>Editing</h3>
                            <ul>
                                    <li><a href="#" onclick="insert=!insert; return false;" title="toggle cursor">toggle cursor</a></li>
                                    <li><a href="#" onclick="drawingMode=!drawingMode; return false;" title="toggle drawing mode">toggle drawing mode</a></li>
                                    <li><a href="#" onclick="clearWholeScreen(); return false;" title="clear screen">clear screen</a></li>
                            </ul>
                    </div>

                    <div class="colright">
                            <h3>Other</h3>
                            <ul>
                                    <!--<li><a href="#" onclick="myexport(); return false;" title="export to xterm ANSI">export to xterm ANSI</a></li>-->
                                    <!--<li><a href="#" onclick="$('#popup').bPopup();" title="change width and height">change width and heght</a></li>-->
                                    
                            </ul>
                           <!-- <div id="file-uploader">       
                                    <noscript>          
                                    <p>Please enable JavaScript to use file uploader.</p>
                                    </noscript>
                            </div>-->
                    </div>
            </div>
            <div style="clear:both;"></div>
  
  
  <img src="images/map.png" border="0" usemap="#ansimap">
  <map id="ansimap" name="ansimap">
      <area shape="rect" alt="a1" title="" coords="0,0,22,12" onclick="setD(49,1);"/>
      <area shape="rect" alt="a2" title="" coords="22,0,48,12" onclick="setD(50,1);"  />
      <area shape="rect" alt="a3" title="" coords="48,0,72,12" onclick="setD(51,1);"/>
      <area shape="rect" alt="a4" title="" coords="72,0,96,12" onclick="setD(52,1);"/>
      <area shape="rect" alt="a5" title="" coords="96,0,120,12" onclick="setD(53,1);"/>
      <area shape="rect" alt="a6" title="" coords="120,0,144,12" onclick="setD(54,1);"/>
      <area shape="rect" alt="a7" title="" coords="144,0,168,12" onclick="setD(55,1);" />
      <area shape="rect" alt="a8" title="" coords="168,0,190,10" onclick="setD(56,1);"  />
      <area shape="rect" alt="a9" title="" coords="192,0,216,10" onclick="setD(57,1);" />
      <area shape="rect" alt="a0" title="" coords="214,0,238,10" onclick="setD(48,1);" />
      <area shape="rect" alt="b1" title="" coords="0,14,22,24" onclick="setD(218,2);" />
      <area shape="rect" alt="b2" title="" coords="24,12,48,22" onclick="setD(191,2);" />
      <area shape="rect" alt="b3" title="" coords="48,12,72,22" onclick="setD(192,2);" />
      <area shape="rect" alt="b4" title="" coords="72,12,96,22" onclick="setD(217,2);" />
      <area shape="rect" alt="b5" title="" coords="96,12,120,22" onclick="setD(196,2);" />
      <area shape="rect" alt="b6" title="" coords="122,12,144,22" onclick="setD(179,2);" />
      <area shape="rect" alt="b7" title="" coords="142,12,166,24" onclick="setD(195,2);" />
      <area shape="rect" alt="b8" title="" coords="166,12,190,24" onclick="setD(180,2);" />
      <area shape="rect" alt="b9" title="" coords="192,12,216,22" onclick="setD(193,2);" />
      <area shape="rect" alt="b0" title="" coords="216,10,240,22" onclick="setD(194,2);" />
      <area shape="rect" alt="c1" title="" coords="0,24,22,32" onclick="setD(201,3);"/>
      <area shape="rect" alt="c2" title="" coords="24,24,48,34" onclick="setD(187,3);" />
      <area shape="rect" alt="c3" title="" coords="50,24,72,34" onclick="setD(200,3);" />
      <area shape="rect" alt="c4" title="" coords="74,24,96,32" onclick="setD(188,3);" />
      <area shape="rect" alt="c5" title="" coords="96,24,122,34" onclick="setD(205,3);" />
      <area shape="rect" alt="c6" title="" coords="120,24,142,32" onclick="setD(186,3);" />
      <area shape="rect" alt="c7" title="" coords="142,24,168,34" onclick="setD(204,3);" />
      <area shape="rect" alt="c8" title="" coords="168,24,192,34" onclick="setD(185,3);" />
      <area shape="rect" alt="c9" title="" coords="190,24,214,34" onclick="setD(202,3);" />
      <area shape="rect" alt="c0" title="" coords="216,24,238,34" onclick="setD(203,3);" />
      <area shape="rect" alt="d1" title="" coords="0,34,22,46" onclick="setD(251,4);" />
      <area shape="rect" alt="d2" title="" coords="24,36,48,48" onclick="setD(184,4);" />
      <area shape="rect" alt="d3" title="" coords="46,36,72,48" onclick="setD(212,4);" />
      <area shape="rect" alt="d4" title="" coords="70,34,96,48" onclick="setD(190,4);" />
      <area shape="rect" alt="d5" title="" coords="94,36,120,48" onclick="setD(205,4);" />
      <area shape="rect" alt="d6" title="" coords="118,36,144,48" onclick="setD(179,4);" />
      <area shape="rect" alt="d7" title="" coords="144,36,168,46" onclick="setD(198,4);" />
      <area shape="rect" alt="d8" title="" coords="166,36,192,46" onclick="setD(181,4);" />
      <area shape="rect" alt="d9" title="" coords="190,36,214,46" onclick="setD(207,4);" />
      <area shape="rect" alt="d0" title="" coords="214,34,238,44" onclick="setD(209,4);" />
      <area shape="rect" alt="e1" title="" coords="0,48,24,60" onclick="setD(161,5);" />
      <area shape="rect" alt="e2" title="" coords="24,48,48,60" onclick="setD(183,5);" />
      <area shape="rect" alt="e3" title="" coords="48,50,74,60" onclick="setD(211,5);" />
      <area shape="rect" alt="e4" title="" coords="72,50,98,58" onclick="setD(135,5);" />
      <area shape="rect" alt="e5" title="" coords="96,48,118,56" onclick="setD(179,5);" />
      <area shape="rect" alt="e6" title="" coords="118,48,144,58" onclick="setD(186,5);" />
      <area shape="rect" alt="e7" title="" coords="142,48,166,56" onclick="setD(199,5);" />
      <area shape="rect" alt="e8" title="" coords="166,48,192,56" onclick="setD(182,5);" />
      <area shape="rect" alt="e9" title="" coords="188,48,214,58" onclick="setD(208,5);" />
      <area shape="rect" alt="e0" title="" coords="218,48,236,58" onclick="setD(144,5);" />
      <area shape="rect" alt="f1" title="" coords="0,60,22,72" onclick="setD(197,6);" />
      <area shape="rect" alt="f2" title="" coords="24,60,48,70" onclick="setD(206,6);" />
      <area shape="rect" alt="f3" title="" coords="48,60,72,70" onclick="setD(139,6);" />
      <area shape="rect" alt="f4" title="" coords="72,60,96,70" onclick="setD(140,6);" />
      <area shape="rect" alt="f5" title="" coords="96,60,118,70" onclick="setD(232,6);" />
      <area shape="rect" alt="f6" title="" coords="118,60,144,70" onclick="setD(163,6);" />
      <area shape="rect" alt="f7" title="" coords="140,60,168,70" onclick="setD(155,6);" />
      <area shape="rect" alt="f8" title="" coords="166,60,192,68" onclick="setD(156,6);" />
      <area shape="rect" alt="f9" title="" coords="194,60,216,68" onclick="setD(153,6);" />
      <area shape="rect" alt="f0" title="" coords="218,60,240,70" onclick="setD(239,6);" />
      <area shape="rect" alt="g1" title="" coords="0,74,24,84" onclick="setD(176,7);" />
      <area shape="rect" alt="g2" title="" coords="24,74,46,84" onclick="setD(177,7);" />
      <area shape="rect" alt="g3" title="" coords="48,72,74,82" onclick="setD(178,7);" />
      <area shape="rect" alt="g4" title="" coords="72,72,96,82" onclick="setD(219,7);" />
      <area shape="rect" alt="g5" title="" coords="96,72,120,80" onclick="setD(223,7);" />
      <area shape="rect" alt="g6" title="" coords="120,72,142,80" onclick="setD(219,7);" />
      <area shape="rect" alt="g7" title="" coords="142,72,168,82" onclick="setD(124,7);" />
      <area shape="rect" alt="g8" title="" coords="168,72,192,80" onclick="setD(141,7);" />
      <area shape="rect" alt="g9" title="" coords="192,72,216,82" onclick="setD(254,7);" />
      <area shape="rect" alt="g0" title="" coords="218,72,238,82" onclick="setD(250,7);" />
      <area shape="rect" alt="h1" title="" coords="0,84,22,94" onclick="setD(001,8;" />
      <area shape="rect" alt="h2" title="" coords="24,84,48,94" onclick="setD(002,8);" />
      <area shape="rect" alt="h3" title="" coords="50,84,74,92" onclick="setD(003,8);" />
      <area shape="rect" alt="h4" title="" coords="70,84,96,94" onclick="setD(004,8);" />
      <area shape="rect" alt="h5" title="" coords="94,84,118,94" onclick="setD(005,8);" />
      <area shape="rect" alt="h6" title="" coords="118,84,142,94" onclick="setD(006,8);" />
      <area shape="rect" alt="h7" title="" coords="142,84,168,94" onclick="setD(196,8);" />
      <area shape="rect" alt="h8" title="" coords="168,84,194,94" onclick="setD(127,8);" />
      <area shape="rect" alt="h9" title="" coords="192,84,216,94" onclick="setD(14,8);" />
      <area shape="rect" alt="h0" title="" coords="216,84,240,94" onclick="setD(207,8);" />
      <area shape="rect" alt="i1" title="" coords="0,96,22,106" onclick="setD(24,9);" />
      <area shape="rect" alt="i2" title="" coords="22,96,48,108" onclick="setD(25,9);" />
      <area shape="rect" alt="i3" title="" coords="48,96,72,106" onclick="setD(24,9);" />
      <area shape="rect" alt="i4" title="" coords="74,96,96,106" onclick="setD(25,9);" />
      <area shape="rect" alt="i5" title="" coords="96,96,120,104" onclick="setD(16,9);" />
      <area shape="rect" alt="i6" title="" coords="120,96,142,106" onclick="setD(17,9);" />
      <area shape="rect" alt="i7" title="" coords="142,94,164,104" onclick="setD(23,9);" />
      <area shape="rect" alt="i8" title="" coords="166,96,190,106" onclick="setD(23,9);" />
      <area shape="rect" alt="i9" title="" coords="192,96,214,104" onclick="setD(20,9);" />
      <area shape="rect" alt="i0" title="" coords="216,96,238,106" onclick="setD(21,9);" />
      <area shape="rect" alt="j1" title="" coords="0,108,24,118" onclick="setD(174,10);" />
      <area shape="rect" alt="j2" title="" coords="24,108,48,120" onclick="setD(175,10);" />
      <area shape="rect" alt="j3" title="" coords="50,108,72,118" onclick="setD(61,10);" />
      <area shape="rect" alt="j4" title="" coords="72,108,96,118" onclick="setD(243,10);" />
      <area shape="rect" alt="j5" title="" coords="96,108,118,118" onclick="setD(169,10);" />
      <area shape="rect" alt="j6" title="" coords="118,106,144,116" onclick="setD(170,10);" />
      <area shape="rect" alt="j7" title="" coords="144,106,168,116" onclick="setD(253,10);" />
      <area shape="rect" alt="j8" title="" coords="168,106,190,116" onclick="setD(246,10);" />
      <area shape="rect" alt="j9" title="" coords="190,106,216,116" onclick="setD(171,10);" />
      <area shape="rect" alt="j0" title="" coords="218,108,238,118" onclick="setD(172,10);" />
      <area shape="rect" alt="k1" title="" coords="0,120,22,130" onclick="setD(149,11);" />
      <area shape="rect" alt="k2" title="" coords="24,118,48,130" onclick="setD(241,11);" />
      <area shape="rect" alt="k3" title="" coords="48,118,70,128" onclick="setD(20,11);" />
      <area shape="rect" alt="k4" title="" coords="70,120,96,130" onclick="setD(21,11);" />
      <area shape="rect" alt="k5" title="" coords="94,120,122,130" onclick="setD(234,11);" />
      <area shape="rect" alt="k6" title="" coords="120,118,144,128" onclick="setD(157,11);" />
      <area shape="rect" alt="k7" title="" coords="144,118,166,128" onclick="setD(228,11);" />
      <area shape="rect" alt="k8" title="" coords="166,118,190,128" onclick="setD(167,11);" />
      <area shape="rect" alt="k9" title="" coords="190,118,214,130" onclick="setD(251,11);" />
      <area shape="rect" alt="k0" title="" coords="218,120,238,128" onclick="setD(252,11);" />
      <area shape="rect" alt="l1" title="" coords="2,132,26,142" onclick="setD(162,12);" />
      <area shape="rect" alt="l2" title="" coords="26,132,48,142" onclick="setD(225,12);" />
      <area shape="rect" alt="l3" title="" coords="50,130,70,140" onclick="setD(147,12);" />
      <area shape="rect" alt="l4" title="" coords="72,130,96,140" onclick="setD(228,12);" />
      <area shape="rect" alt="l5" title="" coords="96,130,120,140" onclick="setD(230,12);" />
      <area shape="rect" alt="l6" title="" coords="120,132,144,140" onclick="setD(232,12);" />
      <area shape="rect" alt="l7" title="" coords="144,130,168,140" onclick="setD(235,12);" />
      <area shape="rect" alt="l8" title="" coords="166,132,192,140" onclick="setD(236,12);" />
      <area shape="rect" alt="l9" title="" coords="190,130,214,140" onclick="setD(237,12);" />
      <area shape="rect" alt="l0" title="" coords="216,130,238,140" onclick="setD(237,12);" />
      <area shape="rect" alt="m1" title="" coords="2,140,26,150" onclick="setD(128,13);" />
      <area shape="rect" alt="m2" title="" coords="26,140,48,150" onclick="setD(135,13);" />
      <area shape="rect" alt="m3" title="" coords="46,140,70,150" onclick="setD(165,13);" />
      <area shape="rect" alt="m4" title="" coords="72,140,94,150" onclick="setD(164,13);" />
      <area shape="rect" alt="m5" title="" coords="94,140,118,150" onclick="setD(152,13);" />
      <area shape="rect" alt="m6" title="" coords="120,140,142,150" onclick="setD(159,13);" />
      <area shape="rect" alt="m7" title="" coords="144,140,166,150" onclick="setD(44,13);" />
      <area shape="rect" alt="m8" title="" coords="166,140,188,150" onclick="setD(249,13);" />
      <area shape="rect" alt="m9" title="" coords="190,140,214,150" onclick="setD(173,13);" />
      <area shape="rect" alt="m0" title="" coords="216,140,238,150" onclick="setD(168,13);" />
      <area shape="rect" alt="n1" title="" coords="2,150,26,163" onclick="setD(131,14);" />
      <area shape="rect" alt="n2" title="" coords="26,150,48,163" onclick="setD(132,14);" />
      <area shape="rect" alt="n3" title="" coords="46,150,70,163" onclick="setD(133,14);" />
      <area shape="rect" alt="n4" title="" coords="72,150,94,163" onclick="setD(160,14);" />
      <area shape="rect" alt="n5" title="" coords="94,150,118,163" onclick="setD(248,14);" />
      <area shape="rect" alt="n6" title="" coords="120,150,142,163" onclick="setD(134,14);" />
      <area shape="rect" alt="n7" title="" coords="144,150,166,163" onclick="setD(142,14);" />
      <area shape="rect" alt="n8" title="" coords="166,150,188,163" onclick="setD(143,14);" />
      <area shape="rect" alt="n9" title="" coords="190,150,214,163" onclick="setD(145,14);" />
      <area shape="rect" alt="n0" title="" coords="216,150,238,163" onclick="setD(146,14);" />
      <area shape="rect" alt="o1" title="" coords="2,163,26,174" onclick="setD(147,15);" />
      <area shape="rect" alt="o2" title="" coords="26,163,48,174" onclick="setD(148,15);" />
      <area shape="rect" alt="o3" title="" coords="46,163,70,174" onclick="setD(149,15);" />
      <area shape="rect" alt="o4" title="" coords="72,163,94,174" onclick="setD(224,15);" />
      <area shape="rect" alt="o5" title="" coords="94,163,118,174" onclick="setD(167,15);" />
      <area shape="rect" alt="o6" title="" coords="120,163,142,174" onclick="setD(150,15);" />
      <area shape="rect" alt="o7" title="" coords="144,163,166,174" onclick="setD(129,15);" />
      <area shape="rect" alt="o8" title="" coords="166,163,188,174" onclick="setD(151,15);" />
      <area shape="rect" alt="o9" title="" coords="190,163,214,174" onclick="setD(163,15);" />
      <area shape="rect" alt="o0" title="" coords="216,163,238,174" onclick="setD(154,15);" />
      <area shape="rect" alt="o1" title="" coords="2,175,26,196" onclick="setD(226,16);" />
      <area shape="rect" alt="o2" title="" coords="26,175,48,196" onclick="setD(153,16);" />
      <area shape="rect" alt="o3" title="" coords="46,175,70,196" onclick="setD(227,16);" />
      <area shape="rect" alt="o4" title="" coords="72,175,94,196" onclick="setD(224,16);" />
      <area shape="rect" alt="o5" title="" coords="94,175,118,196" onclick="setD(167,16);" />
      <area shape="rect" alt="o6" title="" coords="120,175,142,196" onclick="setD(129,16);" />
      <area shape="rect" alt="o7" title="" coords="144,175,166,196" onclick="setD(234,16);" />
      <area shape="rect" alt="o8" title="" coords="166,175,188,196" onclick="setD(151,16);" />
      <area shape="rect" alt="o9" title="" coords="190,175,214,196" onclick="setD(163,16);" />
      <area shape="rect" alt="o0" title="" coords="216,175,238,196" onclick="setD(154,16);" />
  </map>
            

    </div>

    <!--
    Image width: <input autocomplete="off" type="text" id="imagewidth" value="800">
    Image height: <input autocomplete="off" type="text" id="imageheight" value="500">
    Display width: <input autocomplete="off" type="text" id="displaywidth" value="80">
    Display height: <input autocomplete="off" type="text" id="displayheight" value="50">
    <br />
	<canvas id="boxcanvas" width="800" height="500" style="border: 1px solid black;">
        Your browser does not support canvas
        </canvas>
    --><div style="width: 640px" class="centered">
        <canvas id="ansi" width=640 height=480></canvas>
    </div>
  <div id="popup" class="popup">
        <span id="part1">
        <span class="button b-close"><span>X</span></span>
        <a href="" target="_blank" id="file"></a>&nbsp;(right click - save as)
        </span>
        <span id="part2">
        <span class="button b-close"><span>X</span></span>
        <ul>
            <li class="left">Width:</li>
            <li class="right"><input type="text" value="80" /></li>
            <li class="left">Height:</li>
            <li class="right"><input type="text" value="45" /></li>
            <li><input type="button" value="OK"></li>
        </ul>
        </span>
  </div>
      
</body>
</html>