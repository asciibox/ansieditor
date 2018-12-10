var grid = new Array();
var nonsavedGrid = new Array(); // this is for storing the current colors in an alternative coordinate system when not saving the color on the current x,y coordinate
var originalGrid = new Array(); // this is for restoring the original current when restoring (not being done)
var stones = new Array();

(function(global) {

function restart(myNumberOfPlayers) {
 
     numberOfPlayers=myNumberOfPlayers;
     started=false;
     clearScreen(); // Use the local function which also clears global
     initGrid();
     redrawLevel();
     drawStones();
     drawLevelZero();
            
     initPlayers();
     
     started=true;
     
 }


var buttonInfo = new Array();
var inputInfo = new Array();
var currentInput = 0;
var parserInsert = true;

function clearScreen() {
    ctx = document.getElementById("ansi").getContext("2d");
    ctx.fillStyle = 0;
    ctx.fillRect(0, 0, document.getElementById('ansi').width, document.getElementById('ansi').height);
}

global.clearScreen = clearScreen;


 }(this));
 
 
 // This gets called from window.onload.
 // It creates the initial coordinates of a player, sets the direction, and pushes all that information to the variable players. The variable players is an array, and you can
 // retrieve player information by making a call to player[0] (for the first player), or player[1] (for the second player) etc.
function initPlayers() {

	function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var usedColors = new Array();
    keyBuffers = new Array();
    players = new Array();
    wallCrashed = new Array();
    
    for (var player = 0; player < numberOfPlayers; player++) {
        pathChanged[player]=true; // calculate path anew
        wallCrashed[player]=false;
        keyBuffers[player] = new Array(); // In here the fields get set. This gets used to save any key presses when the user presses a key, so there is a buffer-like behaviour which doesn't immediately change direction but then when it's the player's time
        var done = false;
        var startPosOk = false;
        // Check against coordinates outside the level and multiple same start positions. For this we regularly need to create new coordinates if the previous ones were wrong.
        while (done == false) {
            var nibbleX = Math.floor(Math.random() * (width-2));
            var nibbleY = Math.floor(Math.random() * (height-2) * 2) + 1;
            if ((nibbleX < width) && (nibbleY < height * 2 - 2)) {

                if (player > 0) {
                    for (var j = 0; j < players.length; j++) {
                        if (nibbleX == players[j].nibbleX && nibbleY == players[j].nibbleY)
                            startPosOk = false;
                        else
                            startPosOk = true;
                    }
                    if (startPosOk)
                        done = true;
                } else
                    done = true;

            }
        }


		// This sets the direction according to what direction is the farthes to the wall.
		// If there is more space horizontally, navigate to the left or right, if there is more space verytically, navigate to the bottom or upwards
        // alternative would be random: 
		var direction = Math.random();
        if (direction>0.75) direction="right"; else if (direction>0.5) direction="left"; else if (direction>0.25) direction="down"; else direction="up";
		//direction="right";
        /*var difftop = nibbleY * 2/(height*2);
        var diffbottom = ((height * 2) - nibbleY/(height*2));
        var diffleft = nibbleX/width;
        var diffright = ((width - nibbleX)/width);

        var maxDistance = Math.max(difftop, diffbottom, diffleft, diffright);

        if (maxDistance == difftop)
            direction = "up";
        else if (maxDistance == diffbottom)
            direction = "down";
        else if (maxDistance == diffleft)
            direction = "left";
        else
            direction = "right";*/

		// Set the colors of the player. For example player 1 is red, player 2 is blue.
        var color1 = new Array(128, 0, 0);
        var color2 = new Array(0, 0, 128);
        var color3 = new Array(0, 128, 0);
        var color4 = new Array(128, 0, 128);
        var color5 = new Array(0, 128, 128);
        var color6 = new Array(128, 128, 128);
        var colors = new Array();
        colors.push(color1);
        colors.push(color2);
        colors.push(color3);
        colors.push(color4);
        colors.push(color5);
        colors.push(color6);

	    // 
        var done = false;
        while (done == false) {
            done = true;
            var usedColor = colors[getRandomInt(0, colors.length - 1)];

            for (var i = 0; i < usedColors.length; i++) {
                                
                if ( ((usedColor[0] == usedColors[i][0]) && (usedColor[1] == usedColors[i][1]) && (usedColor[2] == usedColors[i][2])) && (numberOfPlayers<colors.length) ) {

                    done = false;

                }
            }
        }
        usedColors.push(usedColor);
		// nibbleX = current position head, nibbleY = head y position, direction = "up", "down", "right", "left", playerCoordinates = contains past positions for removing the nibble at its end
		// playerLength = how many blocks the line has, totalStones = number of stones
        players.push({"nibbleX": nibbleX, "nibbleY": nibbleY, "direction": direction, "playerColor": usedColor, "playerCoordinates": new Array(), "playerLength": 10, "totalStones": 0});
        previousKeyBufferCharArray[player] = direction;
    }
    
}

function initGrid() {    
    grid = new Array();
    for (var y = 0; y < gridHeight; y++)
    {
        grid.push(new Array());
        for (var x = 0; x < width; x++)
        {
            grid[grid.length - 1].push(new Array(0, 0, 0));
        }
    }   

	nonsavedGrid = new Array();
    for (var y = 0; y < gridHeight; y++)
    {
        nonsavedGrid.push(new Array());
        for (var x = 0; x < width; x++)
        {
            nonsavedGrid[nonsavedGrid.length - 1].push(new Array(0, 0, 0));
        }
    }
}

// This creates a new stone. Here, it creates one stone. This gets called when a stone got eaten.
function drawStones() {
    
            var yellow = new Array(255, 255, 0);
            var red = new Array(255, 0, 0);
            stones = new Array();

            for (var i = 0; i < 1; i++) {
                var done = false;
                while (done == false) {
                    var x = Math.floor(Math.random() * (width - 2))+1;
                    var defaultY = Math.random() * height + 1;
                    var y = Math.floor(defaultY * 2);
                   
                    if ((x < width) && (y < height * 2 - 2))
                        done = true;
                }
                stones.push({"x" : x, "y" : y});

                drawOnGrid(yellow, x, y);
            }
    
}

function drawLevelZero() {
    
            var yellow = new Array(255, 255, 0);
            var red = new Array(255, 0, 0);
    
            //Hole position range values
            var range = 10;
            var maxHalfHeight = gridHeight/2+range;
            var minHalfHeight = gridHeight/2-range;
            var maxHalfWidth = width/2+range;
            var minHalfWidth = width/2-range;

            for(var d = 0; d < width-1; d++){
                
                if(d < minHalfWidth || d > maxHalfWidth){

                    drawOnGrid(red, d, 0);
                    drawOnGrid(red, d, gridHeight-3);  
                }   
            }

            // outer walls on the right and left side
            for(var h = 0; h < gridHeight-2; h++){
                
                if(h < minHalfHeight-1 || h >maxHalfHeight){

                    drawOnGrid(red, 0, h);
                    drawOnGrid(red, width-2, h);
                }  
            }
    
}