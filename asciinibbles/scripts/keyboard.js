/** This converts to keycodes to real characters. Language dependency included. Calls executeKey to show the keys in effect **/
function action_handleKeyCode(keyCode,e) {
           console.log("KC2:"+keyCode);
           console.log(keyCode);
           return false;
}


 /** This gets called due when a different event gets called **/
   function action_handleKeyCode2(keyCode,e,possible_socket) {         
             if (dolog)
             {
             console.log("kc:"+keyCode);
			 }            
             
             if (keyCode==38) { // UP
                 
                 if ( (previousKeyBufferCharArray[0]!="up") && (players[0].direction!="down") ) {
                     if (dolog)
                     {
                     console.log("Pushing up");
					 }
                     keyBuffers[0].push({"direction" : "up"});
                     previousKeyBufferCharArray[0]="up";
                 }
                 
                 
             } else if (keyCode==40) { // DOWN
                 if ( (previousKeyBufferCharArray[0]!="down") && (players[0].direction!="up") )
                 {
					 if (dolog)
                     {
                     console.log("Pushing down");
					 }
                 keyBuffers[0].push({"direction" : "down"});
                 previousKeyBufferCharArray[0]="down";
                
                 }
             }
              else if (keyCode==39) { // RIGHT
                 if ( (previousKeyBufferCharArray[0]!="right") && (players[0].direction!="left") ) {
					 if (dolog)
                     {
                     console.log("Pushing right");
					 }
                 keyBuffers[0].push({"direction" : "right"});
                 previousKeyBufferCharArray[0]="right";
                }
                 
             } else if (keyCode==37) { // LEFT
                 if (dolog)
                     {
						console.log("Pushing left");
					 }
                  if ( (previousKeyBufferCharArray[0]!="left") && (players[0].direction!="right") ) {
                   keyBuffers[0].push({"direction" : "left"});
                   previousKeyBufferCharArray[0]="left";
                 }
             } else if (keyCode==69) {
                    // Start the editor
                   
                      
                        editor(1);
           
             }
       else if (keyCode==67) { // Color picker
				 if (dolog)
                 {
                 console.log("Color picker");
				 }
                 if (isEditing==true) {
                 colorpicker();
                 }
                 
             }
             //2nd player W A S D
             else if (keyCode==87) { //W
                 
                 if ( (previousKeyBufferCharArray[1]!="up") && (players[1].direction!="down") ) {
                     keyBuffers[1].push({"direction" : "up"});
                     previousKeyBufferCharArray[1]="up";
                   
                 }
                 
                 
             } else if (keyCode==83) { //S
                 if (isEditing==true) {
                     saveEditor();
                 } else
                 if ( (previousKeyBufferCharArray[1]!="down") && (players[1].direction!="up") ) 
                 {
                        keyBuffers[1].push({"direction" : "down"});
                        previousKeyBufferCharArray[1]="down";
                 }
             }
              else if (keyCode==68) { //D
                 if ( (previousKeyBufferCharArray[1]!="right") && (players[1].direction!="left") ) {
                 keyBuffers[1].push({"direction" : "right"});
                 previousKeyBufferCharArray[1]="right";
                 

                 }
             } else if (keyCode==65) { //A
                 if ( (previousKeyBufferCharArray[1]!="left") && (players[1].direction!="right") ) {
                 keyBuffers[1].push({"direction" : "left"});
                 previousKeyBufferCharArray[1]="left";
                
                 }
             } else if ( (keyCode>=48) && (keyCode<=57) ) { //If we press 1-9
                
                console.log("Editing : "+isEditing+" ; Cropping: "+isCropping);
                // This is placed right at the start because isEditing and isCropping might be true at the same time, so isCropping will get reached even if isEditing==true
                if (isCropping==true){ // Crop mode
                        // Levels 1 - 9
                        document.getElementById('panel').style.display='none';
                        document.getElementById('ansi').style.display='inline';
                        var level = keyCode-48;
                        editor(level);
                 } else           
                 if (isEditing==true) { // Edit mode
                        // Levels 1 - 9
                        var level = keyCode-48;
                        editor(level);
                 
                } else if ( (keyCode>=49) && (keyCode<=53) ) { // Player select mode
                            console.log("number of players: "+numberOfPlayers);
                            restart(keyCode-48);                                                    
                }                 
             } else if (keyCode==82) {
                 if (confirm('Do you want to reset the levels?')) {
                     
                     localStorage.clear();
                     window.location.href=window.location.href;
                     
                 }
                 
            } else if ( (keyCode==107) || (keyCode==171) ) { //Pressing + 
				$('#canvastable').show();
                console.log('Cropping!');
                document.getElementById('panel').style.display='inline';
                document.getElementById('ansi').style.display='none';
                isCropping =  true;
            }
             
   }



function executeParsedKey(keyCode, character,  possible_socket) {
        console.log("1:"+keyCode);
                                
}


    keypress = function(e)
                { 
                   var keyCode = e.which;

                    if (keyCode != 0) {
                        e.preventDefault();

                        action_handleKeyCode(keyCode, e);
                    }

                };

    var keydown = function(e)
                {
                    var keyCode = e.which;
                    e.preventDefault();
                    action_handleKeyCode2(keyCode, e);
                };
    
    var mouseup = function(e) {
             mouseDown=false;
             if (isEditing==true) storeLocally();
           
         };