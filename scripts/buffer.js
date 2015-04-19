/** This gets called when pressing CTRL-C **/
    function copySelectedContent() {
        
        copyArray=Array();
        if (copyMode) {
            
            if (copyEndY<copyStartY) {
                var buffer = copyStartY;
                copyStartY=copyEndY;
                copyEndY=buffer;
            } 
            if (copyEndX < copyStartX) {
                var buffer = copyStartX;
                copyStartX = copyEndX;
                copyEndX = buffer;
            }
            
            copyWidth=copyEndX-copyStartX+1;
            copyHeight=copyEndY-copyStartY+1;
            copyStartXBuffer=copyStartX;
            copyStartYBuffer=copyStartY;
            for (var y = 0; y < copyEndY-copyStartY+1; y++) 
            {
                    
                    copyArray[y]=Array();
                    for (var x = 0; x < copyEndX-copyStartX+1; x++) {
                        
                        copyArray[y][x]=screenCharacterArray[y+copyStartY+firstLine][x+copyStartX];
                    }
            }
        } else {
            copyArray[0]=Array();
            copyWidth=1;
            copyHeight=1;
            copyArray[0][0]=screenCharacterArray[cursorPosY+firstLine][cursorPosX];
        }
        
    }
    
	/** This gets called when pressing CTRL-V **/
    function pasteSelectedContent() {
        
      
        for (var y = 0; y < copyHeight; y++) 
            {
                    for (var x = 0; x < copyWidth; x++) {
                       
                        var asciiCode = copyArray[y][x][0];
                        
                        var foreground = copyArray[y][x][1];
                        var background = copyArray[y][x][2];
                        codepage.drawChar(globalContext, asciiCode, foreground, background, cursorPosX+x, cursorPosY+y+firstLine, false, true);
                    }
            }
            
    }