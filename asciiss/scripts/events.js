/**
 * Created by curtov.com on 04.06.2015.
 * @namespace parsed_setCursorPosX
 * @namespace parsed_setCursorPosY
 */
"use strict";
(function (global) {

    var events = {};

    events.ctrlKey = false;

    events.copyMode = false;

    events.init = function () {

        this.doubleClickStarted = false;

        $("#ansi").bind("mousedown", this._parsedMouseDownEvent);

        this._setFocusOnInputField();

        this._registerKeyEventListener();
    };
    
    
    

    /**
     * After page loading sets cursor in first input
     */
    events._setFocusOnInputField = function () {
        events._setCursor(userActions.selectInput());

    };

    /**
     * Set cursor on coords
     * @param coords
     */
    events._setCursor = function (coords) {
        if (coords) {
            parsed_setCursorPosX(coords.x);
            parsed_setCursorPosY(coords.y);
        }
    };

    /**
     * handling mouse events
     * @param e
     */
    events._parsedMouseDownEvent = function (e) {

        // Doubleclick handler
        if (events.doubleClickStarted) {
            events.doubleClickStarted = false;
            console.log("double click");
            // do something

        } else {
            events.doubleClickStarted = true;
            setTimeout(function () {
                events.doubleClickStarted = false;
            }, 300);
        }

        var ansicanvas = document.getElementById('ansi');
        var mouse = getMousePos(ansicanvas, e);
        var mx = mouse.x;
        var my = mouse.y;

        showCharacter();

        var myCursorPosX = Math.floor(mx / canvasCharacterWidth);
        var myCursorPosY = Math.floor(my / canvasCharacterHeight);

        if (myCursorPosX >= getDisplayWidth() - 1) {
            console.log(myCursorPosX + " too far");
            setCursorPosX(getDisplayWidth() - 1);
            redrawCursor();
            return;
        }
        if (myCursorPosY >= getDisplayHeight() - 1) {
            console.log(myCursorPosY + " too high");
            setCursorPosY(getDisplayHeight() - 1);
            redrawCursor();
            return;
        }

        events._checkSelectionOnParsed(myCursorPosX, myCursorPosY);

    };

    /**
     * click on input or button
     * @param x
     * @param y
     */
    events._checkSelectionOnParsed = function (x, y) {
        events._setCursor(userActions.clickOnElement(x, y));
    };

    /**
     * print symbol
     * @param keyCode
     */
    events._executeParsedKey = function (keyCode) {
        var char = String.fromCharCode(keyCode);
        events._setCursor(userActions.addText(char));
    };

    /**
     * move in input with arrow
     * @param side
     */
    events._moveWithArrow = function (side) {
        events._setCursor(userActions.move(side));
    };

    /**
     * Delete symbol in input
     */
    events._backspace = function () {
        events._setCursor(userActions.backspace());
    };

    /**
     * This registers a key event listener, so entering something in the browser has functionality
     */
    events._registerKeyEventListener = function () {

        document.body.addEventListener('keypress', function (e) {

            var keyCode = e.which;

            if (keyCode != 0) {
                e.preventDefault();
                events._handleKeyCode(e);
            }

        });

        document.body.addEventListener('keydown', function (e) {

            var keyCode = e.which;

            // Control
            if (keyCode == 17) {
                events.ctrlKey = true;
            }

            // ESC
            else if (keyCode == 27) {  // ESCAPE
                if ($('#panel').css('display') == "block") {
                    hidePanel();
                } else {
                    showPanel();
                }
            }

            // up left down right
            else if (37 <= keyCode && keyCode <= 40) {
                e.preventDefault();
                events._handleKeyCode2(e);
            }

            // BackSpace
            else if (keyCode == 8) {
                e.preventDefault();
                events._handleKeyCode(e);
            }
        });
    };

    /**
     * This converts to keycodes to real characters.
     * Language dependency included.
     * Calls events._executeParsedKey to show the keys in effect
     */
    events._handleKeyCode = function (e) {

        var keyCode = e.which;

        if ((events.copyMode) && (!e.shiftKey)) {
            // 99 - c, 116 - t, 120 - x
            if ((keyCode != 99) && (keyCode != 116) && (keyCode != 120)) {
                global.resetHighlighted();
                events.copyMode = false;
            }
        }

        // Digits
        if (48 <= keyCode && keyCode <= 57) {

            events._executeParsedKey(keyCode);
            return true;

            // todo - is the digits have special output?

            /*if (keyCode == 48) {
             keyCode = 9;
             } else {
             keyCode = keyCode-49;
             }*/

            //events._executeParsedKey(global.keys[(global.currentCharset-1)][keyCode]);

        }

        clearTimeout(hideTimer);
        global.codepage.overlay = null;

        var asciiCode, fgColor, bgColor;

        switch (keyCode) {

            case 120 :  // CTRL-X

                if (events.ctrlKey) { // this is not e.ctrlKey

                    if (events.copyMode) {

                        for (var x = 0; x < copyWidth; x++) {
                            for (var y = 0; y < copyHeight; y++) {
                                global.codepage.drawChar(globalContext, 32, 15, 0, cursorPosX + x, cursorPosY + y + firstLine, false, true);
                            }
                        }
                    }
                } else {

                    events._executeParsedKey(120);

                }
                break;
            case 121 :
                if (events.ctrlKey) { // this is not e.ctrlKey
                    if (redo.length == 0) return;
                    var myredo = redo.pop();

                    if (myredo.action == "insert") {

                        asciiCode = myredo.asciiArray[0];
                        fgColor = myredo.asciiArray[1];
                        bgColor = myredo.asciiArray[2];

                        showCharacter(false);
                        setCursorPosX(myredo.x + 1);
                        setCursorPosY(myredo.y);

                        moveAndDrawCharacters(keyCode);
                        codepage.drawChar(ctx, asciiCode, fgColor, bgColor, myredo.x, myredo.y);

                    } else { // overwrite

                        asciiCode = myredo.asciiArray[0];
                        fgColor = myredo.asciiArray[1];
                        bgColor = myredo.asciiArray[2];
                        showCharacter(false);
                        codepage.drawChar(ctx, asciiCode, fgColor, bgColor, myredo.x, myredo.y);
                        setCursorPosX(myredo.x + 1);
                        setCursorPosY(myredo.y);
                    }


                } else {
                    events._executeParsedKey(121);
                }
                break;
            case 122 :
                // Z / CTRL-Z
                if (e.ctrlKey) {
                    if (undo.length == 0) return;
                    var myundo = undo.pop();
                    var originalCharacter = screenCharacterArray[myundo.y][myundo.x];

                    if (myundo.action == "removeCharacter") {

                        // A character was previously inserted. We now need to remove that character.
                        var currentPosX = myundo.x;
                        var currentPosY = myundo.y;

                        while (currentPosX < getDisplayWidth() - 1) {
                            asciiCode = screenCharacterArray[currentPosY][currentPosX + 1][0];
                            fgColor = screenCharacterArray[currentPosY][currentPosX + 1][1];
                            bgColor = screenCharacterArray[currentPosY][currentPosX + 1][2];

                            codepage.drawChar(ctx, asciiCode, fgColor, bgColor, currentPosX, currentPosY);
                            currentPosX++;
                        }

                        codepage.drawChar(ctx, myundo.rightsideAsciiCode, myundo.rightsideFGColor, myundo.rightsideBGColor, getDisplayWidth() - 1, currentPosY);
                        showCharacter(false);
                        setCursorPosX(myundo.x);
                        setCursorPosY(myundo.y);

                        redo.push({action: "insert", asciiArray: originalCharacter, x: myundo.x, y: myundo.y});

                    } else if (myundo.action == "overwrite") {

                        codepage.drawChar(ctx, myundo.asciiCode, myundo.fgColor, myundo.bgColor, myundo.x, myundo.y);

                        showCharacter(false);
                        setCursorPosX(myundo.x);
                        setCursorPosY(myundo.y);
                        redo.push({action: "overwrite", asciiArray: originalCharacter, x: myundo.x, y: myundo.y});
                    }
                    break;
                } else {
                    events._executeParsedKey(122);
                }
                break;
            case 249 :
                events._executeParsedKey(151); // high two becomes ( for french keyboard
                break;
            case 178:
                events._executeParsedKey(40); // high two becomes ( for french keyboard
                break;
            case 224:
                events._executeParsedKey(133); // a accent
                break;
            case 232:
                events._executeParsedKey(138); // e accent
                break;
            case 231:
                events._executeParsedKey(135); // ca
                break;
            case 233:
                events._executeParsedKey(130); // e accent
                break;
            case 176 :
                events._executeParsedKey(167);
                break;
            case 112 :
                if (e.ctrlKey) {
                    alert(cursorPosX + "/" + cursorPosY);
                    break;
                } else {
                    events._executeParsedKey(112);
                }
                break;
            case 96 : // opening single quote - convert to standard single quote due to cursor right bug on single quote
                events._executeParsedKey(39);
                break;
            case 97 : // CTRL-A
                if (events.ctrlKey) {
                    var ascii = screenCharacterArray[cursorPosY + firstLine][cursorPosX];
                    alert("Color / Foreground color / Background color: " + ascii);
                } else {
                    events._executeParsedKey(97);
                }
                break;
            case 99 :
                //CTRL-C
                if (events.ctrlKey) {
                    copySelectedContent();
                } else {
                    events._executeParsedKey(99);
                }
                break;
            case 118 :
                //CTRL-V
                if (events.ctrlKey) {
                    pasteSelectedContent();
                } else {
                    events._executeParsedKey(118);
                }
                break;
            case 219 : // bracket right
                events._executeParsedKey(93);
                break;
            case 221: // bracket left
                events._executeParsedKey(91);
                break;
            case 220 : // UE or backslash
                if (e.shiftKey) {
                    events._executeParsedKey(154);
                } else {
                    events._executeParsedKey(92);
                }
                break;
            case 214 :
                events._executeParsedKey(153);
                break;
            case 196 :
                events._executeParsedKey(142);
                break;
            case 228 :
                events._executeParsedKey(132);
                break;
            case 246 :
                events._executeParsedKey(148);
                break;
            case 252 :
                events._executeParsedKey(129);
                break;
            case 191:
                events._executeParsedKey(47);
                break;
            case 222: // single/double quote
                if (!e.shiftKey) {
                    events._executeParsedKey(39);
                } else {
                    events._executeParsedKey(34); // double quote
                }
                break;
            case 192 :
                events._executeParsedKey(39);
                break;
            case 48 :
                if (!e.shiftKey) {
                    events._executeParsedKey(48);
                } else {
                    events._executeParsedKey(61);
                }
                break;
            case 223: // sz
                events._executeParsedKey(225);
                break;
            case 13 :
                showCharacter();
                setCursorPosX(0);
                console.log("getDisplayHeight:" + getDisplayHeight());
                if (cursorPosY + firstLine < getDisplayHeight() - 1) {
                    console.log("Y:" + cursorPosY);
                    setCursorPosY(cursorPosY + 1);
                }
                var maxHeight = getDisplayHeight() - 1;
                if (cursorPosY < maxHeight) {
                    scrollDown++;
                }
                redrawCursor();
                break;
            case 180 : // single quote above sz
                events._executeParsedKey(39);
                break;
            case 39 : // right
                if (e.shiftKey) {
                    events._executeParsedKey(39);
                }
                break;
            case 40 : // down
                if (e.shiftKey) {
                    events._executeParsedKey(40);
                }
                break;
            case 37: // left, %
                if (e.shiftKey) {
                    events._executeParsedKey(37);
                }
                break;
            case 38: // up
                if (e.shiftKey) {
                    events._executeParsedKey(38);
                }
                break;
            case 8: // backspace
                events._backspace();
                break;
            default :
                events._executeParsedKey(keyCode);
                break;
        }
    };

    /**
     * This gets called due when a different event gets called
     */
    events._handleKeyCode2 = function (e) {

        var keyCode = e.which;

        /*clearTimeout(hideTimer);
         codepage.overlay=null;*/

        var doshowcharacter = true;

        // Check if we need to leave the selection mode. This happens when a key gets pressed without the shift button being pressed.
        if ((events.copyMode) && (!e.shiftKey)) {

            events.copyMode = false;
            /*clearTimeout(cursorInterval);
             resetHighlighted();
             doshowcharacter=false;
             cursorInterval = setTimeout(function() { toggleCursor(); }, 500);*/

        }

        switch (keyCode) {

            case 39 : // cursor right



                if (!e.shiftKey) {
                    events._moveWithArrow("right");
                } else {
                    events.copyMode = true;
                }
                break;

                showCharacter(false);
                var maxWidth = getDisplayWidth() - scrollBarXShown; // When the scroll is being shown, the size of the canvas is 1 character smaller

                if (!e.shiftKey) {
                    if (!e.ctrlKey) {


                        if (cursorPosX < maxWidth - scrollBarXShown) {

                            setCursorPosX(cursorPosX + 1);
                            redrawCursor();
                        } else if (cursorPosX + leftLine < getTotalDisplayWidth() - 2) {
                            scrollRight++;
                        }
                    } else {

                        if (currentBackground > 0) currentBackground--; else currentBackground = 255;
                        codepage.drawChar(ctx, 32, currentForeground, currentBackground, cursorPosX, cursorPosY, false, false); // do not store
                        codepage.overlay = [];
                        codepage.overlay[0] = 32;
                        codepage.overlay[1] = currentForeground;
                        codepage.overlay[2] = currentBackground;
                        hideTimer = setTimeout(function () {
                            codepage.overlay = null;
                        }, 1000);
                    }
                } else {
                    // This gets called when the shift key is pressed and cursor right is pressed, so selection takes place
                    if (events.copyMode == false) {
                        events.copyMode = true;
                        copyStartX = cursorPosX;
                        copyStartY = cursorPosY;
                        copyEndX = cursorPosX;
                        copyEndY = cursorPosY;
                    }
                    if (cursorPosX < maxWidth) {
                        copyEndX++;

                        if (cursorPosX < copyStartX) { // The cursor is to the left of the copyStartX ([][][][][][]copyStartX)

                            // currentPosX < copyStartX - show the original characters


                            // currentPosX > copyStartX - move selection to the right (copyStartX[][][][][][][][[])
                            for (var y = copyEndY; y >= copyStartY; y--) {
                                highlightCharacter(cursorPosX + 1, y);
                            }

                            if (copyStartY < copyEndY) {

                                for (var y = copyEndY; y >= copyStartY; y--) {
                                    showOriginalCharacter(cursorPosX, y);
                                }

                            } else {

                                for (var y = copyStartY + 1; y >= copyEndY - 1; y--) {

                                    showOriginalCharacter(cursorPosX, y);
                                }

                            }

                        } else {


                            if (copyStartY < copyEndY) {

                                // currentPosX > copyStartX - move selection to the right (copyStartX[][][][][][][][[])
                                for (var y = copyStartY; y <= copyEndY; y++) {
                                    highlightCharacter(cursorPosX, y);
                                    highlightCharacter(cursorPosX + 1, y);
                                }
                            } else {

                                for (var y = copyStartY; y >= copyEndY; y--) {
                                    highlightCharacter(cursorPosX, y);
                                    highlightCharacter(cursorPosX + 1, y);
                                }
                            }
                        }

                        setCursorPosX(cursorPosX + 1);
                        redrawCursor();

                    }
                }
                break;
            case 40 : // cursor down

                events._moveWithArrow("down");
                break;

                showCharacter(false);
                if (!e.shiftKey) {
                    if (!e.ctrlKey) {

                        var maxHeight = getDisplayHeight() - 1 - scrollBarYShown;

                        if (cursorPosY < maxHeight) {
                            cursorPosY++;
                            redrawCursor();
                        }
                        else if (cursorPosY + firstLine < totalVisibleHeight) {
                            // Scroll
                            scrollDown++;

                        }
                    } else {
                        if (currentForeground > 0) currentForeground--; else currentForeground = 255;
                        codepage.drawChar(ctx, 219, currentForeground, currentBackground, cursorPosX, cursorPosY, false, false); // do not store
                        codepage.overlay = new Array();
                        codepage.overlay[0] = 219;
                        codepage.overlay[1] = currentForeground;
                        codepage.overlay[2] = currentBackground;
                        hideTimer = setTimeout(function () {
                            codepage.overlay = null;
                        }, 1000);
                    }

                } else {
                    clearTimeout(cursorInterval);

                    if (events.copyMode == false) {
                        events.copyMode = true;
                        copyStartX = cursorPosX;
                        copyStartY = cursorPosY;
                        copyEndX = cursorPosX;
                        copyEndY = cursorPosY;
                    }
                    if (cursorPosY < getDisplayHeight() - 1) {

                        copyEndY++;

                        if (cursorPosX == copyStartX) {

                            if (cursorPosY < copyStartY) {

                                showOriginalCharacter(cursorPosX - 1, cursorPosY);
                                showOriginalCharacter(cursorPosX, cursorPosY);
                            } else {
                                highlightCharacter(cursorPosX, cursorPosY);
                                highlightCharacter(cursorPosX, cursorPosY + 1);
                            }


                        } else if (cursorPosX <= copyStartX) { // (cursorPosX is to the left of copyEndX) [][][][][][][]copyEndX

                            if (cursorPosY < copyStartY) {

                                for (var x = cursorPosX; x <= copyStartX; x++) {
                                    showOriginalCharacter(x, cursorPosY);

                                }

                            } else {
                                for (var x = cursorPosX; x <= copyStartX; x++) {
                                    highlightCharacter(x, cursorPosY);
                                    highlightCharacter(x, cursorPosY + 1);
                                }
                            }
                        } else { // cursorPosX > copyEndX (cursorPosX is to the right of copyEndX) copyEndX[][][][][][][][][][]
                            if (cursorPosY < copyStartY) {
                                for (var x = copyStartX; x <= cursorPosX; x++) {
                                    showOriginalCharacter(x, cursorPosY);
                                }
                            } else {
                                for (var x = copyStartX; x <= cursorPosX; x++) {

                                    highlightCharacter(x, cursorPosY);
                                    highlightCharacter(x, cursorPosY + 1);
                                }
                            }
                        }
                        setCursorPosY(cursorPosY + 1);
                        highlightCharacter(cursorPosX, cursorPosY);
                        redrawCursor();
                        cursorInterval = setTimeout(function () {
                            toggleCursor();
                        }, 500);
                    }
                }
                break;
            case 37: // cursor left, %

                events._moveWithArrow("left");
                break;

                showCharacter(false);
                if (!e.shiftKey) {
                    if (!e.ctrlKey) {

                        if (cursorPosX > 0) {
                            setCursorPosX(cursorPosX - 1);
                            redrawCursor();
                        } else if (cursorPosX + leftLine > 0) {
                            scrollLeft++;
                        }
                    } else {
                        // Change color
                        if (currentBackground < 255) currentBackground++; else currentBackground = 0;
                        codepage.drawChar(ctx, 32, currentForeground, currentBackground, cursorPosX, cursorPosY, false, false); // do not store
                        codepage.overlay = new Array();
                        codepage.overlay[0] = 32;
                        codepage.overlay[1] = currentForeground;
                        codepage.overlay[2] = currentBackground;
                        hideTimer = setTimeout(function () {
                            codepage.overlay = null;
                        }, 1000);
                    }
                } else {

                    clearTimeout(cursorInterval);
                    if (events.copyMode == false) {
                        events.copyMode = true;
                        copyStartX = cursorPosX;
                        copyStartY = cursorPosY;
                        copyEndX = cursorPosX;
                        copyEndY = cursorPosY;
                    }
                    if (cursorPosX > 0) { // Only if we are not on the very left

                        copyEndX--;

                        if (cursorPosX > copyStartX) {

                            if (copyEndY > copyStartY) {

                                for (var y = copyEndY + 1; y >= copyStartY - 1; y--) {
                                    showOriginalCharacter(cursorPosX, y);
                                }
                            } else {

                                for (var y = copyStartY + 1; y >= copyEndY; y--) {
                                    showOriginalCharacter(cursorPosX, y);
                                }
                            }

                        } else {
                            if (copyEndY > copyStartY) {

                                for (var y = copyStartY; y < copyEndY; y++) {
                                    showOriginalCharacter(cursorPosX, y);
                                }

                                for (var y = copyStartY; y < copyEndY; y++) {
                                    highlightCharacter(cursorPosX, y);
                                    highlightCharacter(cursorPosX - 1, y);
                                }

                            } else {
                                /* for (var y = copyStartY; y > copyEndY; y--)
                                 {

                                 showOriginalCharacter(cursorPosX, y);
                                 }*/

                                for (var y = copyStartY; y >= copyEndY; y--) {
                                    highlightCharacter(cursorPosX, y);
                                    highlightCharacter(cursorPosX - 1, y);
                                }


                            }
                        }

                        setCursorPosX(cursorPosX - 1);
                        highlightCharacter(cursorPosX, cursorPosY);
                        cursorInterval = setTimeout(function () {
                            toggleCursor();
                        }, 500);

                    }
                }
                break;
            case 38: // cursor up
                events._moveWithArrow("up");
                break;

                showCharacter(false);
                if (!e.shiftKey) {
                    if (!e.ctrlKey) {
                        if (cursorPosY > 0) {
                            // If the cursor is not at the very top, moves the cursor one up
                            cursorPosY--;
                            redrawCursor();
                        } else if (firstLine > 0) {
                            // Scrolls if the cursor is at the very top
                            scrollUp++;
                        }
                    } else {
                        // Changes the foreground color
                        if (currentForeground < 255) currentForeground++; else currentForeground = 0;
                        codepage.drawChar(ctx, 219, currentForeground, currentBackground, cursorPosX, cursorPosY, false, false); // do not store
                        codepage.overlay = new Array();
                        codepage.overlay[0] = 219;
                        codepage.overlay[1] = currentForeground;
                        codepage.overlay[2] = currentBackground;
                        hideTimer = setTimeout(function () {
                            codepage.overlay = null;
                        }, 1000);
                    }
                } else {
                    if (events.copyMode == false) {
                        events.copyMode = true;
                        copyStartX = cursorPosX;
                        copyStartY = cursorPosY;
                        copyEndX = cursorPosX;
                        copyEndY = cursorPosY;
                    }
                    if (cursorPosY > 0) {
                        if (cursorPosX == copyStartX) {

                            if (cursorPosY <= copyStartY) {
                                highlightCharacter(cursorPosX, cursorPosY);
                                highlightCharacter(cursorPosX, cursorPosY - 1);
                            } else {
                                showOriginalCharacter(cursorPosX, cursorPosY);
                            }


                        } else if (cursorPosX <= copyStartX) { // (cursorPosX is to the left of copyEndX) [][][][][][][]copyEndX

                            if (cursorPosY <= copyStartY) {

                                for (var x = cursorPosX; x <= copyStartX; x++) {

                                    highlightCharacter(x, cursorPosY);
                                    highlightCharacter(x, cursorPosY - 1);
                                }
                            } else {

                                for (var x = cursorPosX; x <= copyStartX; x++) {
                                    showOriginalCharacter(x, cursorPosY);
                                }
                            }
                        } else { // cursorPosX > copyEndX (cursorPosX is to the right of copyEndX) copyEndX[][][][][][][][][][]

                            if (cursorPosY <= copyStartY) {

                                for (var x = copyStartX; x < cursorPosX; x++) {

                                    highlightCharacter(x, cursorPosY);
                                    highlightCharacter(x, cursorPosY - 1);
                                }
                            } else {

                                for (var x = copyStartX; x <= cursorPosX; x++) {
                                    showOriginalCharacter(x, cursorPosY);
                                }
                            }
                        }
                        copyEndY--;
                        setCursorPosY(cursorPosY - 1);
                        highlightCharacter(cursorPosX, cursorPosY);
                        redrawCursor();
                    }
                }

                break;
        }
    };


    // Publish in global
    if (typeof exports !== 'undefined') {
        exports.eventsHandler = events;
    } else {
        global.eventsHandler = events;
    }

})(this);