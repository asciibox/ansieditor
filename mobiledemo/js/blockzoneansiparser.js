var blockZone = {
    
	    colors: ['#000', '#800000', '#008000', '#808000', '#000080', '#800080', '#008080', '#c0c0c0', '#808080', '#ff0000', '#00ff00', '#ffff00', '#8888ff', '#ff00ff', '#00ffff', '#ffffff'], 
	    canvas : [],
	    defaultRows : 25,
	    rowsCount : 50,
	    colorInfoFg : [],
	    colorInfoBg : [],
	    currentColor : 15,
	    canvasCopy : [],
	    colorInfoFgCopy : [],
	    colorInfoBgCopy : [],
	    useNBSP : false,
	    activateNBSP : function() {
	    	this.useNBSP = true;
		},
	    nbsp : function() {
	    	if (this.useNBSP) {
	    		console.log('YES');
	    		return '&nbsp';
	    	} else
	    	{
	    		console.log('NO');
	    		return '';
	    	}
	    },
	    init : function() {
	
	    	for (var y = 0; y < this.defaultRows; y++) {
	    		document.getElementById('main').innerHTML+='<p id="line'+y+'">'+this.nbsp()+'</p>';

	        	var bgColors = [];
	            var fgColors = [];
	       		for (var x = 0; x < 80; x++) {
	       			fgColors.push(15);
	       			bgColors.push(0);
	       		}
		   		this.colorInfoFg.push(fgColors);
	    		this.colorInfoBg.push(bgColors);
	    	}
	    },
		getWidth : function() {
			var spans = document.getElementById('line1').getElementsByTagName('span');
			var len = 0;
			for (var i = 0; i < spans.length; i++) {
				var px = spans[i].offsetWidth;
				len = len + px;
			}
			return len;
		},
		resize : function() {
			
			for (pct = 120; pct < 300; pct=pct+20 )
			{
				document.getElementById('main').style.fontSize = pct+'%';
				var len = this.getWidth();

				console.log('document.getElementById(main).offsetHeight:'+document.getElementById('main').offsetHeight);
				console.log('window.innerHeight:'+window.innerHeight);
				if ( (len>window.innerWidth) || (document.getElementById('main').offsetHeight>window.innerHeight) )
				{
					document.getElementById('main').style.fontSize = (pct-20)+'%';
					break;
				}
			}
		}, 
	    clearScreen : function() {
	    	document.getElementById('main').innerHTML='';
	    	this.rowsCount = 50;
	    	this.colorInfoFg = [];
	    	this.colorInfoBg = [];
	    	this.canvas = [];
	    	this.init();
	    },
	    addLine : function(y) {
	    	while (y>=this.canvas.length) {
	    	var bgColors = [];
            var fgColors = [];
	    	var line = '';
			for (var x = 0; x < 38; x++) {
    			line=line+' ';
    			fgColors.push(15);
       			bgColors.push(0);		    			
    		}
			this.canvas.push(line);
			this.colorInfoFg.push(fgColors);
    		this.colorInfoBg.push(bgColors);
	    	}
	    },
	    createText : function(y) {
	    	if (y>=this.canvas.length) {
	    		this.rowsCount++;
	    		document.getElementById('main').innerHTML+='<p id="line'+y+'">'+this.nbsp()+'</p>';
	    		this.addLine(y);
	    		window.scrollTo(0,document.body.scrollHeight);
	    	}
	    	var writeColorFg = -1;
	    	var writeColorBg = -1;
	    	var characters = this.canvas[y].length-1;
	    	var line = '';
	    	var openedSpan = false;
	    	for (var x = 0; x <= characters; x++) {
	    		
	    		if ( (writeColorFg!=this.colorInfoFg[y][x]) || (writeColorBg!=this.colorInfoBg[y][x]) ) {
	    			var color = '';
	    			if (writeColorBg!=this.colorInfoBg[y][x]) {
	    				writeColorBg = this.colorInfoBg[y][x];
	    				color = 'background-color: '+this.colors[writeColorBg];
	    				
	    			}
	    			//if (writeColorFg!=this.colorInfoFg[y][x]) {
	    				writeColorFg = this.colorInfoFg[y][x];
	    				if (color!='') {
	    					color+=';';
	    				}
	    				color += 'color: '+this.colors[writeColorFg]+';';
	    			//}    			
	    			if (openedSpan == true) {
	    				line = line+'</span>';
	    			}
	 				line = line + '<span style="'+color+'">';
	 				openedSpan = true;
	    		}
	    		line = line + this.canvas[y][x];
	    	}
	    	if (openedSpan == true) {
	    		line = line + '</span>';
	    	}
	    	return line;
	    }, updateCanvas : function() {
	    	for (var y = 0; y < this.canvas.length-1; y++) {
	    		document.getElementById('line'+y).innerHTML = this.createText(y);;
	    	}
	    },
	    setColor : function(color) {
	    	this.currentColor = color;	
	    },
	    mappedChar : function(code) {
	    	
	    	let chars = [];
	    	chars.push('\u0000');
	    	chars.push('\u263A');
	    	chars.push('\u263B');
	    	chars.push('\u2665');
	    	chars.push('\u2666');
	    	chars.push('\u2663');
	    	chars.push('\u2660');
	    	chars.push('\u2022');
	    	chars.push('\u25D8');
	    	chars.push('\u25CB');
	    	chars.push('\u25D9');
	    	chars.push('\u2642');
	    	chars.push('\u2640');
	    	chars.push('\u266A');
	    	chars.push('\u266B');
	    	chars.push('\u263C');
	    	chars.push('\u25BA');
	    	chars.push('\u25C4');
	    	chars.push('\u2195');
	    	chars.push('\u203C');
	    	chars.push('\u00B6');
	    	chars.push('\u00A7');
	    	chars.push('\u25AC');
	    	chars.push('\u21A8');
	    	chars.push('\u2191');
	    	chars.push('\u2193');
	    	chars.push('\u2192');
	    	chars.push('\u2190');
	    	chars.push('\u221F');
	    	chars.push('\u2194');
	    	chars.push('\u25B2');
	    	chars.push('\u25BC');
	    	chars.push('\u0020');
	    	chars.push('\u0021');
	    	chars.push('\u0022');
	    	chars.push('\u0023');
	    	chars.push('\u0024');
	    	chars.push('\u0025');
	    	chars.push('\u0026');
	    	chars.push('\u0027');
	    	chars.push('\u0028');
	    	chars.push('\u0029');
	    	chars.push('\u002A');
	    	chars.push('\u002B');
	    	chars.push('\u002C');
	    	chars.push('\u002D');
	    	chars.push('\u002E');
	    	chars.push('\u002F');
	    	chars.push('\u0030');
	    	chars.push('\u0031');
	    	chars.push('\u0032');
	    	chars.push('\u0033');
	    	chars.push('\u0034');
	    	chars.push('\u0035');
	    	chars.push('\u0036');
	    	chars.push('\u0037');
	    	chars.push('\u0038');
	    	chars.push('\u0039');
	    	chars.push('\u003A');
	    	chars.push('\u003B');
	    	chars.push('\u003C');
	    	chars.push('\u003D');
	    	chars.push('\u003E');
	    	chars.push('\u003F');
	    	chars.push('\u0040');
	    	chars.push('\u0041');
	    	chars.push('\u0042');
	    	chars.push('\u0043');
	    	chars.push('\u0044');
	    	chars.push('\u0045');
	    	chars.push('\u0046');
	    	chars.push('\u0047');
	    	chars.push('\u0048');
	    	chars.push('\u0049');
	    	chars.push('\u004A');
	    	chars.push('\u004B');
	    	chars.push('\u004C');
	    	chars.push('\u004D');
	    	chars.push('\u004E');
	    	chars.push('\u004F');
	    	chars.push('\u0050');
	    	chars.push('\u0051');
	    	chars.push('\u0052');
	    	chars.push('\u0053');
	    	chars.push('\u0054');
	    	chars.push('\u0055');
	    	chars.push('\u0056');
	    	chars.push('\u0057');
	    	chars.push('\u0058');
	    	chars.push('\u0059');
	    	chars.push('\u005A');
	    	chars.push('\u005B');
	    	chars.push('\u005C');
	    	chars.push('\u005D');
	    	chars.push('\u005E');
	    	chars.push('\u005F');
	    	chars.push('\u0060');
	    	chars.push('\u0061');
	    	chars.push('\u0062');
	    	chars.push('\u0063');
	    	chars.push('\u0064');
	    	chars.push('\u0065');
	    	chars.push('\u0066');
	    	chars.push('\u0067');
	    	chars.push('\u0068');
	    	chars.push('\u0069');
	    	chars.push('\u006A');
	    	chars.push('\u006B');
	    	chars.push('\u006C');
	    	chars.push('\u006D');
	    	chars.push('\u006E');
	    	chars.push('\u006F');
	    	chars.push('\u0070');
	    	chars.push('\u0071');
	    	chars.push('\u0072');
	    	chars.push('\u0073');
	    	chars.push('\u0074');
	    	chars.push('\u0075');
	    	chars.push('\u0076');
	    	chars.push('\u0077');
	    	chars.push('\u0078');
	    	chars.push('\u0079');
	    	chars.push('\u007A');
	    	chars.push('\u007B');
	    	chars.push('\u007C');
	    	chars.push('\u007D');
	    	chars.push('\u007E');
	    	chars.push('\u2302');
	    	chars.push('\u00C7');
	    	chars.push('\u00FC');
	    	chars.push('\u00E9');
	    	chars.push('\u00E2');
	    	chars.push('\u00E4');
	    	chars.push('\u00E0');
	    	chars.push('\u00E5');
	    	chars.push('\u00E7');
	    	chars.push('\u00EA');
	    	chars.push('\u00EB');
	    	chars.push('\u00E8');
	    	chars.push('\u00EF');
	    	chars.push('\u00EE');
	    	chars.push('\u00EC');
	    	chars.push('\u00C4');
	    	chars.push('\u00C5');
	    	chars.push('\u00C9');
	    	chars.push('\u00E6');
	    	chars.push('\u00C6');
	    	chars.push('\u00F4');
	    	chars.push('\u00F6');
	    	chars.push('\u00F2');
	    	chars.push('\u00FB');
	    	chars.push('\u00F9');
	    	chars.push('\u00FF');
	    	chars.push('\u00D6');
	    	chars.push('\u00DC');
	    	chars.push('\u00A2');
	    	chars.push('\u00A3');
	    	chars.push('\u00A5');
	    	chars.push('\u20A7');
	    	chars.push('\u0192');
	    	chars.push('\u00E1');
	    	chars.push('\u00ED');
	    	chars.push('\u00F3');
	    	chars.push('\u00FA');
	    	chars.push('\u00F1');
	    	chars.push('\u00D1');
	    	chars.push('\u00AA');
	    	chars.push('\u00BA');
	    	chars.push('\u00BF');
	    	chars.push('\u2310');
	    	chars.push('\u00AC');
	    	chars.push('\u00BD');
	    	chars.push('\u00BC');
	    	chars.push('\u00A1');
	    	chars.push('\u00AB');
	    	chars.push('\u00BB');
	    	chars.push('\u2591');
	    	chars.push('\u2592');
	    	chars.push('\u2593');
	    	chars.push('\u2502');
	    	chars.push('\u2524');
	    	chars.push('\u2561');
	    	chars.push('\u2562');
	    	chars.push('\u2556');
	    	chars.push('\u2555');
	    	chars.push('\u2563');
	    	chars.push('\u2551');
	    	chars.push('\u2557');
	    	chars.push('\u255D');
	    	chars.push('\u255C');
	    	chars.push('\u255B');
	    	chars.push('\u2510');
	    	chars.push('\u2514');
	    	chars.push('\u2534');
	    	chars.push('\u252C');
	    	chars.push('\u251C');
	    	chars.push('\u2500');
	    	chars.push('\u253C');
	    	chars.push('\u255E');
	    	chars.push('\u255F');
	    	chars.push('\u255A');
	    	chars.push('\u2554');
	    	chars.push('\u2569');
	    	chars.push('\u2566');
	    	chars.push('\u2560');
	    	chars.push('\u2550');
	    	chars.push('\u256C');
	    	chars.push('\u2567');
	    	chars.push('\u2568');
	    	chars.push('\u2564');
	    	chars.push('\u2565');
	    	chars.push('\u2559');
	    	chars.push('\u2558');
	    	chars.push('\u2552');
	    	chars.push('\u2553');
	    	chars.push('\u256B');
	    	chars.push('\u256A');
	    	chars.push('\u2518');
	    	chars.push('\u250C');
	    	chars.push('\u2588');
	    	chars.push('\u2584');
	    	chars.push('\u258C');
	    	chars.push('\u2590');
	    	chars.push('\u2580');
	    	chars.push('\u03B1');
	    	chars.push('\u00DF');
	    	chars.push('\u0393');
	    	chars.push('\u03C0');
	    	chars.push('\u03A3');
	    	chars.push('\u03C3');
	    	chars.push('\u03C0');
	    	chars.push('\u00B5');
	    	chars.push('\u03C4');
	    	chars.push('\u03A6');
	    	chars.push('\u03C4');
	    	chars.push('\u0398');
	    	chars.push('\u03A9');
	    	chars.push('\u0398');
	    	chars.push('\u03B4');
	    	chars.push('\u221E');
	    	chars.push('\u03C6');
	    	chars.push('\u03B5');
	    	chars.push('\u2229');
	    	chars.push('\u2261');
	    	chars.push('\u00B1');
	    	chars.push('\u03B5');
	    	chars.push('\u2265');
	    	chars.push('\u2264');
	    	chars.push('\u2320');
	    	chars.push('\u2321');
	    	chars.push('\u00F7');
	    	chars.push('\u2248');
	    	chars.push('\u00B0');
	    	chars.push('\u2219');
	    	chars.push('\u00B7');
	    	chars.push('\u221A');
	    	chars.push('\u207F');
	    	chars.push('\u00B2');
	    	chars.push('\u25A0');
	    	chars.push('\u00A0');
	    	
	    	return chars[code];
	    },
	    writeCanvas : function() {
	    		for (var y = 0; y < this.defaultRows; y++) {
	        		var line = '';
	    			for (var x = 0; x < 38; x++) {
	    				/*var counter;
	    				counter = x;
	    				if (String(counter).length>1) {
	    					counter = String(x).substring(1);
	    				}*/
		    			line=line+' ';
		    			
		    			/*if ( ((x % 10)==0) && (x>1) ) {
		    				this.setColor(String(x).substring(0,1));			
	    				}
	    				
	    				var counter = String(x).substring(1);*/
	    				
	    				
	    				this.colorInfoFg[y][x] = this.currentColor;	    				    			
		    		}
	    			this.canvas.push(line);
	        	}
	    		
	    		this.updateCanvas();
	    },
	    updateCharacter : function(character, fgColor, bgColor, x, y) {
	    	if (y>=this.canvas.length) {
	    		this.rowsCount++;
	    		document.getElementById('main').innerHTML+='<p id="line'+y+'">'+this.nbsp()+'</p>';
	    		window.scrollTo(0,document.body.scrollHeight);
	    		this.addLine(y);
	    	}
			character = this.mappedChar(character);
	    	this.canvas[y]=this.canvas[y].substring(0, x)+character+this.canvas[y].substring(x+1);
	    	this.colorInfoFg[y][x]=fgColor;
	    	this.colorInfoBg[y][x]=bgColor;
	    	document.getElementById('line'+y).innerHTML = this.createText(y);
	    
	    },
	    getCharCodeAt: function(x, y) {
	    	return this.canvas[y].substring(x, x+1).charCodeAt(0);
	    }, 
	    lineLength : function(y) {
	    	return this.canvas[y].length;
	    },
	    saveCanvas : function() {
	    	this.canvasCopy = JSON.stringify(this.canvas.slice());
	    	this.colorInfoFgCopy = JSON.stringify(this.colorInfoFg.slice());
	    	this.colorInfoBgCopy = JSON.stringify(this.colorInfoBg.slice());
	    },
	    restoreCanvas: function() {
	    	console.log('RESTORED');
	    	this.canvas = JSON.parse(this.canvasCopy);
	    	this.colorInfoFg = JSON.parse(this.colorInfoFgCopy);
	    	this.colorInfoBg = JSON.parse(this.colorInfoBgCopy);
	    }, 
	    redrawLine : function(y) {
	    	document.getElementById('line'+y).innerHTML = this.createText(y);;
	    }
    }

    