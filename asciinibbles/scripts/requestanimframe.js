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
var cursor = new Cursor();
var playerPaths = new Array();
var direction = "right";
previousNibbleY = 0;
previousNibbleY = 0;
previousDirection = "right";
startBlocks = new Array();

var yellow = new Array(255, 255, 0);
var cyan = new Array(0, 255, 255);
var black = new Array(0, 0, 0);
var red = new Array(255, 0, 0);
var started = false;

var drawStart = Date.now();

var charsAtOnce = 99999;

var wallCrashed = new Array(0, 0, 0, 0);


var globalBuffer = new Uint8Array();
var escapeCode = "";
var globalEscaped = false;
var globalPos = 0;
slowmotion = false;
var pathChanged=new Array();

var player;
// shim layer with setTimeout fallback
window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


(function animloop() {
    requestAnimFrame(animloop);
    render();
})();

function getValues() {
    return escapeCode.substr(1, escapeCode.length - 2).split(";").map(function(value) {
        var parsedValue;
        parsedValue = parseInt(value, 10);
        return isNaN(parsedValue) ? 1 : parsedValue;
    });
}

function drawOnGrid(color, x, y, save) {

	if (typeof(grid[y])=="undefined")
	{
		return;
	}

    if (x > grid[y].length)
        return;

    if ( (typeof(save)=="undefined") || (save==true) )
    {
		var thegrid=grid;
		thegrid[y][x] = color;
    } else {
		var thegrid=nonsavedGrid;
		thegrid[y][x] = color;
	}

    screenPosX = x;
    screenPosY = y / 2;

    if ((screenPosY % 1) >= 0.5) {
        lowerColor = color;
        upperColor = thegrid[y - 1][x];
    } else {
        upperColor = color;
        if (typeof (thegrid[y + 1]) != "undefined") {
            lowerColor = thegrid[y + 1][x];
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
        
    //}

}

/* OLD drawOnGrid. not optimized.

function drawOnGrid(color, x, y, save) {

    if (y >= grid.length-1)
        return;

    if (x > grid[y].length)
        return;

    grid[y][x] = color;

    screenPosX = x;
    screenPosY = y / 2;

    if ((screenPosY % 1) >= 0.5) {
        lowerColor = color;
        upperColor = grid[y - 1][x];
    } else {
        upperColor = color;
        if (typeof (grid[y + 1]) != "undefined") {
            lowerColor = grid[y + 1][x];
        } else {
            console.log("grid y out of range");
            lowerColor = upperColor;
        }
    }

    if (typeof(upperColor)=="undefined") console.log("ERROR - UPPERCOLOR NOT DEFINED - NOT DRAWING"); else {
            if (upperColor == lowerColor) {
                printthat(String.fromCharCode(219), x, Math.floor(screenPosY), upperColor, upperColor); // Print a full char 
            } else {
                printthat(String.fromCharCode(223), x, Math.floor(screenPosY), upperColor, lowerColor); // Print the top char, where only the top block is the foreground color
            }
    }

}*/



function colorEquals(gridColor, color) {

    if ((color[0] != gridColor[0]) || (color[1] != gridColor[1]) || (color[2] != gridColor[2]))
        return false;
    return true;

}

function usedColorCheck(color) {

    var found = false;

    for (var i = 0; i < usedColors.length; i++) {
        if (colorEquals(color, players[i].playerColor) == true)
            found = true;
    }
    
    

    return found;
}

function isEmptyGrid(y, x) {

    var item = grid[y][x];

    var b1 = item[0] == 0;
    var b2 = item[1] == 0;
    var b3 = item[2] == 0;
    if (b1 && b2 && b3) {
        return true;
    }
    return false;
}

function updatePlayer(player) {

    var nibbleX = players[player].nibbleX;
    var nibbleY = players[player].nibbleY;

    //alert(grid[162][1]);
    players[player].playerCoordinates.push({"x": nibbleX, "y": nibbleY});
    
    // A nibble got eaten
    if (colorEquals(grid[nibbleY][nibbleX], yellow)) {
		var effectID=Math.floor(Math.random()*4)+1;
		console.log(effectID);	
		soundManager.play('effect'+effectID);
        players[player].totalStones++;
        players[player].playerLength = players[player].playerLength + players[player].totalStones * 2;
        drawStones(); // -> action.js
        if (dolog)
        {
			console.log("NIBBLE EATEN");
        }
        for (var i = 1; i < numberOfPlayers; i++) {
        pathChanged[i]=true;
		if (dolog)
		{
			console.log("pathChanged["+i+"]=true");
		}
        }
		
        // If a player crashes against the outher wall (red color)
    } else if (colorEquals(grid[nibbleY][nibbleX], red)) {
        //alert("A player crashed with outher wall"+grid[nibbleY][nibbleX]+" "+nibbleX+"-"+nibbleY);
        //alert('CRASH');
        wallCrashed[player] = true;
    }

    // Computer opponent

	// Check if current path gets interrupted by a block inside the path
    if (player >= 1) {
        var pathStart = new Array(nibbleX, nibbleY);
        var pathEnd = new Array(stones[0].x, stones[0].y);
	

		if (typeof(playerPaths[player])!="undefined")
		{		
			if (playerMoved[player]==true) {
					for (var i = 0; i < playerPaths[player].length; i++ )
					{
						var pathX = playerPaths[player][i].x;
						var pathY = playerPaths[player][i].y;
						if ( (!isEmptyColor(pathX, pathY)) )
						{
							playerMoved[player]=false;
							pathChanged[player]=true;
							break;
						}

					}
			}
		}

		startBlocks=new Array();

        if (pathChanged[player]==true) {
			//console.log("pathChanged["+player+"]==true");
			if (dolog)
			{ 
				console.log("yes");
			}
			
			setStartBlocks(player, currentPath);
			calculateBlocksAhead(player);
            var currentPath = findPath(pathStart, pathEnd);
			pathChanged[player]=false;
            if (dolog) 
			{
					// Just show the path in the player's color, just highlighted
					var highlightedPlayerColor = players[player].playerColor.slice(0);
					highlightedPlayerColor[0]=Math.min(highlightedPlayerColor[0]+32, 255);
					highlightedPlayerColor[1]=Math.min(highlightedPlayerColor[1]+32, 255);
					highlightedPlayerColor[2]=Math.min(highlightedPlayerColor[2]+32, 255);
					for (var i = currentPath.length-1; i >= 1; i--) {
					// drawOnGrid(highlightedPlayerColor, currentPath[i].x, currentPath[i].y, false);
					}
			}
           
			//console.log("Created path for "+player);
            playerPaths[player] = currentPath;

        } else if (dolog)
        {
			console.log("no");
		}

    }

    if (!wallCrashed[player]) {
		
		
        // draw the player's color
        drawOnGrid(players[player].playerColor, nibbleX, nibbleY);

        if (players[player].playerCoordinates.length > players[player].playerLength) {

            // Remove the player's last stone
            drawOnGrid(black, players[player].playerCoordinates[0].x, players[player].playerCoordinates[0].y);
            // Also remove it from the array
            players[player].playerCoordinates.shift();
        }

		if (playerPaths[player]) 
		{
			var prevNibbleX = players[player].nibbleX;
			var prevNibbleY = players[player].nibbleY;
			playerPaths[player].pop();

			/*while ( (prevNibbleX==playerPaths[player][playerPaths[player].length-1].x) && (prevNibbleY==playerPaths[player][playerPaths[player].length-1].y) )
			{
				playerPaths[player].pop();
			}*/

			if (playerPaths[player].length>0)
			{			
			players[player].nibbleX=playerPaths[player][playerPaths[player].length-1].x;
			players[player].nibbleY=playerPaths[player][playerPaths[player].length-1].y;
			playerMoved[player]=true;
			
			if (players[player].nibbleX>prevNibbleX)
			{
				players[player].direction="right";
			} else
			if (players[player].nibbleX<prevNibbleX)
			{
				players[player].direction="left";
			} else
			if (players[player].nibbleY>prevNibbleY)
			{
				players[player].direction="down";
			} else
			if (players[player].nibbleY<prevNibbleY)
			{
				players[player].direction="up";
			}	
			
			if ( (prevNibbleX==players[player].nibbleX) && (prevNibbleY==players[player].nibbleY) )
			{
				alert("L:"+playerPaths[player].length);
			}

			
			} else {
				console.log("no path found");
				wallCrashed[player]=true;
			}
			
		} else
		if (player>=1)
		{
			alert("ERRRO");
		} else
        // -- MOVING CHECKING --
        // --- Going RIGHT ---
        if (players[player].direction == "right") {
            //Moving (Checks if the nibble isnt at the nibbleX = maximum width value position)
            if (nibbleX < width - 2) {
                
                //Check crashing against himself or another nibble
                if (usedColorCheck(grid[nibbleY][nibbleX + 1]))
                    wallCrashed[player] = true;
                //If no crashing then we move right
                else
                    players[player].nibbleX++;
            }
            //If nibbleX is in the limit position we BEAM RIGHT-TO-LEFT
            else
                players[player].nibbleX = 0;


            // --- Going LEFT ---
        } else if (players[player].direction == "left") {
            //Moving (Checks if the nibble isnt at the nibbleX = 0 width value position)
            if (nibbleX > 0) {
                //Check crashing against himself or another nibble
                if (usedColorCheck(grid[nibbleY][nibbleX - 1]))
                    wallCrashed[player] = true;
                //If no crashing then we move left
                else
                    players[player].nibbleX--;
            }
            //If nibbleX is in the 0 position we BEAM LEFT-TO-RIGHT
            else
                players[player].nibbleX = width - 2;

            // --- Going UP ---
        } else if (players[player].direction == "up") {
            //Moving (Checks if the nibble isnt at the nibbleY = 0 position)
            if (nibbleY > 0) {
                //Check crashing against himself or another nibble
                if (usedColorCheck(grid[nibbleY - 1][nibbleX]))
                    wallCrashed[player] = true;
                //If no crashing then we move up
                else
                    players[player].nibbleY--;
            }
            //If nibbleY is in the 0 position we BEAM TOP-TO-DOWN
            else
                players[player].nibbleY = height * 2 - 3;

            // --- Going DOWN ---
        } else if (players[player].direction == "down") {
            //Moving (Checks if the nibble isnt at the nibbleY = maximum height value position)
            if (nibbleY < height * 2 - 3) {
                //Check crashing against himself or another nibble
                if (usedColorCheck(grid[nibbleY + 1][nibbleX]))
                    wallCrashed[player] = true;
                //If no crashing then we move downsides
                else
                    players[player].nibbleY++;
            }
            //If nibbleY is in the limit we BEAM DOWN-TO-TOP
            else
                players[player].nibbleY = 0
        }

    }


}

function render() {

    if ((typeof (started) != "undefined") && (started == true)) {

        //calculate difference since last repaint
        var diff = Date.now() - drawStart;
        //use diff to determine correct next step
        //reset startTime to this repaint
        if (diff > pauseDelay) {

            drawStart = Date.now();
            for (var player = 0; player < keyBuffers.length; player++)
            {
                var keyBuffer = keyBuffers[player];
                if (keyBuffer.length > 0) {
                    players[player].direction = keyBuffer[0].direction; // Just for the first player (whoever that is)
                    keyBuffers[player].shift(); // Remove keyBuffer[0]
                }
            }
            // For al players
			for (var player = 0; player < players.length; player++) {
                updatePlayer(player);
            }

        }


    }

    var counter = 0;

    if (globalPos < globalBuffer.length)
    {
        //console.log("globalPos: "+globalPos+" length: "+globalBuffer.length);
        while ((globalPos < globalBuffer.length) && (counter < charsAtOnce)) {
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
                            case "H": // cursor position
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
                                while (j < values.length) {
                                    if (values[j] >= 30 && values[j] <= 37) {
                                        globalDisplay.setForeground(values[j] - 30);
                                    } else if (values[j] >= 40 && values[j] <= 47) {
                                        globalDisplay.setBackground(values[j] - 40);
                                    } else if (values[j] == 48) { // background, 256colors
                                        // alert("bg:"+values);
                                        myvalues = String(values);
                                        //alert(myvalues.substring(5));
                                        var color = myvalues.substring(5);
                                        j = j + 2;

                                        globalDisplay.setBackground(color);
                                    } else if (values[j] == 38) { // foreground, 256colors
                                        //alert("fg:"+values);
                                        myvalues = String(values);
                                        var color = myvalues.substring(5);
                                        j = j + 2;
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
        globalBuffer = new Uint8Array();
        globalPos = 0;
    }

}

		