    var mouseDown=false;
    var doubleClickStarted = false;
    var isCropping = false;
    var croppedRegionX = 160; //crop image size (global?) these variables are for knowing the size when drawing the box in edit mode
    var croppedRegionY = 80;  // please check this
    var boxColor = new Array (0, 120, 255);
    var pathChanged=new Array();
    var croppedImageData;
	
	//Box dragging variable controllers
    var lastX = 0;
    var lastY = 0;
    var lastCx = 0;
    var lastCy = 0;
    var initialDragging = true;
    var pixels;

    function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
    }

    
         
         function getPixel(croppedImageData, index) {
             
             var i = index*4;
             d = croppedImageData.data;
             return [d[i],d[i+1],d[i+2],d[i+3]]; // returns array [R,G,B,A]
         }

        // AND/OR

         function getPixelXY(croppedImageData, x, y) {
             
            return getPixel(croppedImageData, y*croppedImageData.width+x);
        }
         
    var mousedown = function(e) {
        /*	for (var i = 0; i <10 ; i++ )
		{
			drawOnGrid(new Array(129, 129, 129), 20, i, true);
		}*/
         /*   if (doubleClickStarted==false) {
                doubleClickStarted = true;
                setTimeout(function() {
                    doubleClickStarted=false;
                }, 500);
            } else {
                started=false;
                clearScreen();
                if(isEditing == false) loginRegister(register);
                }*/

                var ansicanvas = document.getElementById('ansi');
                var globalContext = ansicanvas.getContext("2d");
                var mouse = getMousePos(ansicanvas, e);
                var mx = mouse.x;
                var my = mouse.y;
                myCursorPosX = Math.floor(mx / canvasCharacterWidth);
                var posY = my / canvasCharacterHeight;
                myCursorPosY = Math.floor(posY)*2;
                if ((posY % 1)>0.5) myCursorPosY++;
            mouseDown=true;
			var g = grid[myCursorPosY][myCursorPosX];

			var info="";
			if ( (g[0]==255) && (g[1]==255) && (g[2]==0))
			{
				info="stone: "+stones[0].x+"/"+stones[0].y;
			}
			for (var i = 0; i < numberOfPlayers;  i++ )
			{
				var playerColor=players[i].playerColor;
					if ( (g[0]==playerColor[0]) && (g[1]==playerColor[1]) && (g[2]==playerColor[2]) )
					{
						info="player: "+i+ "x: "+players[i].nibbleX+" y: "+players[i].nibbleY;
						break;
					}
			}
			document.getElementById('coords').innerHTML=myCursorPosX+"/"+myCursorPosY+" grid color: "+g[0]+"/"+g[1]+"/"+g[2]+" "+info;


            //If we are in cropping mode and we push mousedown, we should draw a blue box (or the cropped image)  where the mouse was placed
            if ( (isCropping == true) && (isEditing == true) ){
                console.log("croppedRegionX:"+croppedRegionX);
                console.log("croppedRegionY:"+croppedRegionY);

                //Get the cursor position

				
                //Calculate the real canvas coordinates for strokeRect
                var x = (myCursorPosX) * parseInt(canvasCharacterWidth);
                var y = ((myCursorPosY) * parseInt(canvasCharacterHeight)) / 2;
                var cx = (croppedRegionX) * parseInt(canvasCharacterWidth);
                var cy = (croppedRegionY) * parseInt(canvasCharacterHeight);
                var tryX = 20 * parseInt(canvasCharacterWidth);
                var tryY = 20 * parseInt(canvasCharacterHeight);

                if(typeof(croppedImageData) != "undefined"){

                    //var reachedMax = false; 
                    var imagePrintWidth = croppedImageData.width-1;
                    var imagePrintHeight = croppedImageData.height-1;
                   
                    for(var y=0; y<imagePrintHeight; y++){
                        for(var x=0; x<imagePrintWidth; x++){
            
                            var i = (y*croppedImageData.width+x)*4;             
                            var pixelColor = new Array(croppedImageData.data[i],croppedImageData.data[i+1],croppedImageData.data[i+2]);
                                
                            //drawOnGrid(pixelColor, myCursorPosX+x,myCursorPosY+y);

                            var finalCursorPosX = myCursorPosX+x;
                            var finalCursorPosY = myCursorPosY+y;
                            console.log(myCursorPosX);

                            //If the next pixel doesnt exceed the canvas width 
                            if(finalCursorPosX <= 159){

                                if (finalCursorPosY >= grid.length-1)
                                return;

                                if (finalCursorPosX > grid[finalCursorPosY].length)
                                    return;

                                grid[finalCursorPosY][finalCursorPosX] = pixelColor;

                                screenPosX = finalCursorPosX;
                                screenPosY = finalCursorPosY / 2;

                                if ((screenPosY % 1) >= 0.5) {
                                    lowerColor = pixelColor;
                                    upperColor = grid[finalCursorPosY - 1][finalCursorPosX];
                                } else {
                                    upperColor = pixelColor;
                                    if (typeof (grid[finalCursorPosY + 1]) != "undefined") {
                                        lowerColor = grid[finalCursorPosY + 1][finalCursorPosX];
                                    } else {
                                        console.log("grid y out of range");
                                        lowerColor = upperColor;
                                    }
                                }

                                //if (typeof(upperColor)=="undefined") console.log("ERROR - UPPERCOLOR NOT DEFINED - NOT DRAWING"); else {
                                if (upperColor == lowerColor) {
                                    var charCode =  219;
                                } else {
                                    var charCode = 223;
                                }

                                var fg_rgb=upperColor;
                                var bg_rgb=lowerColor;
                                var mygoto = cursor.goto(screenPosX, screenPosY);

                                var fg = cursor.rgb(fg_rgb[0], fg_rgb[1], fg_rgb[2]).foreground.current;
                                var bg = "48" + cursor.rgb(bg_rgb[0], bg_rgb[1], bg_rgb[2]).foreground.current.substring(2);
                                fg = String.fromCharCode(27) + "[" + fg + "m";
                                bg = String.fromCharCode(27) + "[" + bg + "m";

                                parseANSI(mygoto + fg + bg + String.fromCharCode(charCode));    

                            }else{
                                imagePrintWidth = x;
                            }
                        }
                    }
                    
                }


                //when the image is placed crop mode turns off
                isCropping = false;
                
            

            } else if ( (isColorpicker==true) || (isEditing==true) ) {
                
                    var ansicanvas = document.getElementById('ansi');
                    var mouse = getMousePos(ansicanvas, e);
                    var mx = mouse.x;
                    var my = mouse.y;                    
                    
                    myCursorPosX = Math.floor(mx / canvasCharacterWidth);
                    
                   
                    
                    if (isColorpicker) {
                        myCursorPosY = Math.floor(my / canvasCharacterHeight);
                        colorPick(myCursorPosX, myCursorPosY);
                    }
                    else {
                        var posY = my / canvasCharacterHeight;
                        myCursorPosY = Math.floor(posY)*2;
                        if ((posY % 1)>0.5) myCursorPosY++;
                        drawOnGrid(currentColor, myCursorPosX, myCursorPosY);
                        
                        
                    }
                    
            }
            // do something

        };
