/**
 * Created by Alexandr on 02.07.2015.
 */
"use strict";
(function(global) {

    global.cursor = new Cursor();

    // This defines the screen width in characters
    global.width = 160;

    // Here the height
    global.height = 45;

    // Different modes of showing the characters: Either resized so it fits on the screen, or taking the width of characters for the height
    global.resizeToScreen = true;

    // Initializes the canvas object using the image that is available inside the images directory for. The image consists of 8x16px blocks in different colors.
    global.codepage = new Codepage("asciirocks/images/CO_437_8x16.png", function () {

        var canvas = document.getElementById('ansi');

        setCanvasSize(canvas);
        setANSICanvasSize();

        global.globalContext = canvas.getContext("2d");

        doClearScreen(false);
        global.globalDisplay = new Display();

        // Set default color
        global.tagParser.setConfig({
            buttonBg: "black",
            inputFg: "white",
            inputBg: "black"
        });

        // Parsing
        global.tagParser.parse($("#html"));

        // Drawing parsed
        global.userActions.init(global.tagParser.getAll());

        // Events
        global.eventsHandler.init();

        $(global).triggerHandler("parsed");

    });

    global.parseANSI = function(text) {

        var data = [];
        for (var i = 0; i < text.length; i++) {
            var asciiCode = text.charCodeAt(i);
            data.push(asciiCode);
        }

        var myBuffer = new Uint8Array(data);


        var tmp = new Uint8Array(globalBuffer.byteLength + myBuffer.byteLength);
        tmp.set(new Uint8Array(globalBuffer), 0);
        tmp.set(new Uint8Array(myBuffer), globalBuffer.byteLength);
        globalBuffer = tmp;
    }

})(this);