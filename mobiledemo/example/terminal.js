var terminal = {

		modemTimeout: 4000,
		totalLines: 2,
	    cursorShown: false,	    
	    startY : 6,
	    endY : 9,
	    currentY : 6,
	    callback : null,
	    textShown : false,
	    connectInterval : null,
	    keypressDisabled : false,
	    	write : function(color, x, y, text) {
	    	
	    	currentString = '';
	    	for (var i = 0; i < text.length;  i++) {
	    		blockZone.updateCharacter(text.charCodeAt(i), color, 4, x+i, y);
	    	}
	    },	 
		isLetter : function(str) {
			return str.length === 1 && str.match(/[a-z]/i);
		},
	    init : function(callback) {
	    		this.callback = callback;
	    		let spans = document.getElementsByTagName('span');
				for (var i = 0; i < spans.length; i++)
				{
					var span = spans[i].innerHTML;
					let newString = '';
					
					for (var z = 0; z < span.length; z++)
					{
						var ch = span.substring(z, z+1);
						if (this.isLetter(ch))
						{
							newString = newString + '<div style=\'display:inline;\' onclick="alert(\''+ch+'\');">'+ch+'</div>';
						} else {
							newString = newString+ch;
						}
						
						
					}
					spans[i].innerHTML = newString;
					
				}
	    },
	    
	  
	    registerKeyEventListener : function() {    
		    document.addEventListener("keyup", (e) => {
		      this.handleKeyPress(e.keyCode, e);
		    }, false);
		  	
	  	},
	  	removeKeyEventListener : function() {    
		    this.keypressDisabled = true;
	  	},
	  	
	    handleKeyPress : function(keyCode, e) {
	    	if (this.keypressDisabled) {
	    		return;
	    	}
	    	switch (keyCode) {
	    		case 13 :
	    			break;
	    		case 38:
	    			break;
	    		case 40:
	    			break;
	    		default :
	    	}
	    	
	    }
}