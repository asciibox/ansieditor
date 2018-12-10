var isColorpicker = false;
var isEditing = false;
var currentColor = new Array(128, 128, 128);
var currentLevel = 1;
var levelGrids = new Array();
var standardColor = new Array(128, 128, 128);
var previousX = 1;
var previousY = 1;
var previousColor = new Array(0,0,0);


/*
 * 
 * 
 * function d2h(d) {return d.toString(16);}
 * 
 *
function h2d(h) {
    return parseInt(h, 16);
}*/


// Converts hex color to rgb value
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return new Array(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
}

function storeLocally() {
    var levelJSON =  JSON.stringify(levelGrids);
    localStorage.setItem("levelGrids", levelJSON);
} 


// Gets called when pressing 1 - 9
function editor(level) {

    if (started==false) { // Only when the current state is not a live level
        levelGrids[currentLevel]=JSON.parse(JSON.stringify(grid)); // Store the changes of the current level
    }
    
    started=false;
    console.log("editor("+level+")");
    
    // If there is already a grid for the current level
    if (levelGrids[level]!=null) {
        
        // use that one
        grid=levelGrids[level];
        if (grid==null) alert("1 level "+level+" is not set!");
        currentLevel=level;
        doClearScreen(true, true);
        redrawLevel();
    } else {
        // Store the current grid
        currentLevel=level;
        // otherwise leave the grid
        clearGrid();
        
        doClearScreen(true, true);
   
       
    }

    isEditing = true;
    isColorpicker=false;
    
    // redraw the level based on the variable "grid" (array)
  

}


// Iterates over the y and x coordinates of the variable grid and redraw what is in there
function redrawLevel() {

    doClearScreen(true, true);
     for (var y = 0; y < height*2; y++) {
          for (var x = 0; x < width; x++) {
                
                if ( (grid[y][x][0]!=0) || (grid[y][x][1]!=0) || (grid[y][x][0]!=0) ) {
                   
                    drawOnGrid(grid[y][x], x, y);
                }
          }
     }
    
    
}

// This shows a range of colors composed of several empty space characters with the specific background color
function colorpicker() {
    
    if (started==true) {
       
          started=false;
          clearGrid();
       
       
    }
    
    isColorpicker = true;
    doClearScreen(true, true);
   
    console.log("cleared");
    globalBuffer = new Uint8Array();
    globalPos = 0;
    for (var i = 0; i < ansicolors.length; i++) {

        var y = Math.floor(i / 10) + 1;
        var x = i;
        while (x >= 10)
            x = x - 10;


        var color = hexToRgb(ansicolors[i]);

       
        for (var z = 0; z < 3; z++) {
            printthat("   ", x * 3 + 1, y * 3 + z, color, color);
        }
        
        
        
      
        

    }
    var white = hexToRgb("FFFFFF");
      for (var z = 0; z < 2; z++) {
        printthat("11", 50, 30+z, hexToRgb("000000"), hexToRgb("FFFFFF"));
        printthat("22", 50, 32+z, white, hexToRgb("FF00FF"));
        printthat("33", 50, 34+z, white, hexToRgb("00FF00"));
        printthat("44", 50, 36+z, white, hexToRgb("FF00FF"));
        printthat("55", 50, 38+z, hexToRgb("000000"), hexToRgb("FFFFFF"));
        printthat("66", 50, 40+z, white, hexToRgb("FF00FF"));
        printthat("77", 50, 42+z, white, hexToRgb("00FF00"));
        printthat("88", 50, 44+z, white, hexToRgb("FF00FF"));
        }


}
// This gets called when pressing cursor down and the color picker is being shown, x and y are the cursor x and cursor y coordinates
function colorPick(x, y) {
    x = Math.floor(x / 3);
    y = Math.floor(y / 3);

    var i = (y - 1) * 10 + x;
    if (typeof (ansicolors[i]) != "undefined") {

        var color = hexToRgb(ansicolors[i]);
        currentColor=color;
        printthat("                              ", 50, 25, color, color);
    }

}

// this gets called when a new level gets created and shown
function clearGrid() {
     var color = new Array(0,0,0);
     for (var y = 0; y < height*2; y++) {
          for (var x = 0; x < width; x++) {
              grid[y][x]=color;
          }
      }
}

function loginRegister(callback) {
    
    // Delete event listeners
    
    document.body.removeEventListener('keydown', keydown, false);
    document.getElementById('ansi').removeEventListener('mousemove', mousemove, false);
    document.getElementById('ansi').removeEventListener('mousedown', mousedown, false);
    document.getElementById('ansi').removeEventListener('mouseup', mouseup, false);
    document.body.removeEventListener('keypress', keypress, false);
    enableCursor=true;
    redrawCursor();
    // Add new event listeners for asciiss parsejs
    
    document.getElementById('ansi').addEventListener('mousedown', parsed_mousedown, false);
    
    registerParsedKeyEventListener();
    clearScreen();
    
    callback();
    
}

function login() {
    $('#ascii_content').html("<div>" + $('#ascii_login').html() + "</div>");
    calculateContent();
}

function submit() {
    
    
    
}

function register() {
    
    $('#ascii_content').html("<div>" + $('#ascii_register').html() + "</div>");
    calculateContent();
     
}

