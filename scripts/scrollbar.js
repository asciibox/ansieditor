var scrollPosY = 0;
var scrollPosX = 0;

function drawLine(fromRealY, toCursorY) {
       for (var x = 0; x < screenCharacterArray[fromRealY].length; x++) {
           var charArray = screenCharacterArray[fromRealY][x];
           asciiCode=charArray[0];
           foreground=charArray[1];
           background=charArray[2];
           codepage.drawChar(ctx, asciiCode, foreground, background, x, toCursorY, false, false); // do not store
       }
   }
   
   function drawVerticalLine(fromRealX, toCursorX) {
       for (var y = 0; y < screenCharacterArray.length; y++) {
           var charArray = screenCharacterArray[y][fromRealX];
           asciiCode=charArray[0];
           foreground=charArray[1];
           background=charArray[2];
           codepage.drawChar(ctx, asciiCode, foreground, background, toCursorX, y, false, false); // do not store
       }
   };
  
  function updateScrollbarY(drawTopBlackside, offsetY) {
       
       if (typeof(offsetY)=="undefined") offsetY=0;
       
       var myScrollPosX = (visibleWidth-1  ) * parseInt(canvasCharacterWidth)-4;
       var window_innerHeight = (visibleHeight*(canvasCharacterHeight));
       var scrollBarHeight = (visibleHeight/totalVisibleHeight)*window_innerHeight;
       console.log("scrollBarHeight:"+scrollBarHeight);
       
     

        myScrollPosY = (firstLine / totalVisibleHeight)*window_innerHeight;
       if (myScrollPosY+offsetY<0) {
           myScrollPosY = -offsetY; 
       } else
       if (scrollBarHeight+myScrollPosY+offsetY>window_innerHeight) {
           myScrollPosY = window_innerHeight-scrollBarHeight-offsetY; // Since we offsetY again
       } 
       console.log("!!!!!myScrollPosY:"+myScrollPosY);
                
       var context = document.getElementById("ansi").getContext("2d");
       
       if ( (drawTopBlackside==1) || (drawTopBlackside==2) ) {
            context.beginPath();
            context.rect(myScrollPosX+1, 0, 2*canvasCharacterWidth, myScrollPosY+offsetY);
            context.fillStyle = 'black';
            context.fill();
            context.lineWidth = 7;
            context.strokeStyle = 'black';
            context.stroke();
       }
       
       context.beginPath();
       context.rect(myScrollPosX+1, myScrollPosY+offsetY, 2*canvasCharacterWidth, scrollBarHeight);
       context.fillStyle = 'yellow';
       context.fill();
       context.lineWidth = 7;
       context.strokeStyle = 'black';
       context.stroke();
       
        if ( (drawTopBlackside==0) || (drawTopBlackside==2) ) {
            context.beginPath();
            context.rect(myScrollPosX+1, myScrollPosY+scrollBarHeight+offsetY, 2*canvasCharacterWidth, window_innerHeight-(myScrollPosY+scrollBarHeight));
            context.fillStyle = 'black';
            context.fill();
            context.lineWidth = 7;
            context.strokeStyle = 'black';
            context.stroke();
       }
       scrollPosY = myScrollPosY+offsetY;
       
   }
   
   function updateScrollbarX(drawLeftBlackside, offsetX) {
       
       if (typeof(offsetX)=="undefined") offsetX=0;
       
       var window_innerWidth = ((visibleWidth)*(canvasCharacterWidth));
       
       var myScrollPosX = (leftLine / totalVisibleWidth)*window_innerWidth;
       var scrollBarWidth = (visibleWidth/totalVisibleWidth)*window_innerWidth;
       if (myScrollPosX+offsetX+scrollBarWidth>window_innerWidth) {
           myScrollPosX=window_innerWidth-offsetX-scrollBarWidth;
       } else
       if (myScrollPosX+offsetX<0) {
           myScrollPosX = -offsetX;
       }
   
       console.log("!!!!myScrollPosX:"+myScrollPosX);
       
       var myScrollPosY = (visibleHeight-1  ) * parseInt(canvasCharacterHeight)-3;
       
       var context = document.getElementById("ansi").getContext("2d");
       
       if ( (drawLeftBlackside==1) || (drawLeftBlackside==2) ) {
       // Black part to the left
       context.beginPath();
       context.rect(0, myScrollPosY, myScrollPosX+offsetX, canvasCharacterHeight*2);
       context.fillStyle = 'black';
       context.fill();
       context.lineWidth = 7;
       context.strokeStyle = 'black';
       context.stroke();
       }
       
       // Yellow part
       context.beginPath();
       context.rect(myScrollPosX+1+offsetX, myScrollPosY+1, scrollBarWidth, canvasCharacterHeight*2);
       context.fillStyle = 'yellow';
       context.fill();
       context.lineWidth = 7;
       context.strokeStyle = 'black';
       context.stroke();
       
       if ( (drawLeftBlackside==0) || (drawLeftBlackside==2) ) {
       // Black part to the right
       context.beginPath();
       context.rect(myScrollPosX+scrollBarWidth+offsetX, myScrollPosY, window_innerWidth-myScrollPosX, canvasCharacterHeight*2);
       context.fillStyle = 'black';
       context.fill();
       context.lineWidth = 7;
       context.strokeStyle = 'black';
       context.stroke();
       }
       scrollPosX = myScrollPosX + offsetX;
   }
   
  
  function scrollDown() {
       
                                                firstLine++;
                                                var startX = 0;
                                                var startY = canvasCharacterHeight;
                                                var window_innerWidth = ((visibleWidth)*(canvasCharacterWidth));
						var window_innerHeight = ((visibleHeight-scrollBarYShown)*(canvasCharacterHeight));

                                                var screenWidth = canvasCharacterHeight;
                                                
                                                var imgData=ctx.getImageData(startX,startY,window_innerWidth-canvasCharacterWidth,window_innerHeight-canvasCharacterHeight-1);
                                                ctx.putImageData(imgData,0,0);
                                                
                                                drawLine(visibleHeight-scrollBarYShown+firstLine-1,(visibleHeight-scrollBarYShown)-1);
                                                
                                                updateScrollbarY(1);
       
   }
   
   function scrollUp() {
       
                                              firstLine--;
                                              var startX = 0;
                                              var startY = 0;
                                              var window_innerWidth = ((visibleWidth)*(canvasCharacterWidth));
                                              var window_innerHeight = (visibleHeight-scrollBarYShown)*(canvasCharacterHeight);
                                              var imgData=ctx.getImageData(startX,startY,window_innerWidth-canvasCharacterWidth,window_innerHeight-canvasCharacterHeight);
                                              ctx.putImageData(imgData,0,canvasCharacterHeight);  
                                              drawLine(firstLine, 0);
                                              updateScrollbarY(0);
   }
   
   function scrollRight() {
       
                                             leftLine++;
                                             var startX = canvasCharacterWidth;
                                             
                                             var window_innerWidth = ((visibleWidth)*(canvasCharacterWidth));
                                             var window_innerHeight = (visibleHeight*(canvasCharacterHeight));
                                             console.log("startX:"+startX+" window_innerWidth:"+window_innerWidth);
                                             var imgData=ctx.getImageData(startX,0,window_innerWidth-startX-startX,window_innerHeight);
                                             ctx.putImageData(imgData,0,0);  
                                             
                                             console.log("visibleWidth+leftLine:"+(visibleWidth+leftLine));
                                             console.log("visibleWidth:"+visibleWidth);
                                             drawVerticalLine(visibleWidth+leftLine-2,visibleWidth-2);
                                             
                                             updateScrollbarX(1);
       
   }
   
   function scrollLeft() {
       
                                             leftLine--;
                                             var startX = 0;
                                             
                                             var window_innerWidth = ((visibleWidth)*(canvasCharacterWidth));
                                             var window_innerHeight = (visibleHeight*(canvasCharacterHeight));
                                             console.log("startX:"+startX+" window_innerWidth:"+window_innerWidth);
                                             var imgData=ctx.getImageData(0,0,window_innerWidth-canvasCharacterWidth-canvasCharacterWidth,window_innerHeight);
                                             ctx.putImageData(imgData,canvasCharacterWidth,0);  
                                             drawVerticalLine(leftLine,0);
                                             
                                             updateScrollbarX(0);
       
   }