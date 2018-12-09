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

        var $ansi = $("#ansi");

        $ansi.bind("mousedown", this._parsedMouseDownEvent);

        $ansi.bind("mousemove", this._mouseMoveEvent);

        this._registerKeyEventListener();

        this.hideCursor();

    };

    /**
     * Set cursor on coords
     * @param coords
     */
    events.setCursor = function (coords) {
        if (coords && coords.x !== 0 && coords.y !== 0) {
            if (!cursorShown) {
                setTimeout(events._showCursor, 500);
            }

            var mygoto = cursor.goto(coords.x, coords.y);
            parseANSI(mygoto);
            setCursorPosX(coords.x);
            setCursorPosY(coords.y);

        } else {
            setTimeout(events.hideCursor, 500);
        }
    };

    /**
     * Hide cursor
     * @private
     */
    events.hideCursor = function () {
        clearTimeout(cursorInterval);
        if (cursorShown) {
            toggleCursor();
        }
    };

    /**
     * Show cursor
     * @private
     */
    events._showCursor = function () {
        redrawCursor();
    };

    /**
     * handling mouse events
     * @param e
     */
    events._parsedMouseDownEvent = function (e) {

        // Doubleclick handler
        if (events.doubleClickStarted) {
            events.doubleClickStarted = false;
            $(global).triggerHandler("double-click", e);

        } else {
            events.doubleClickStarted = true;
            setTimeout(function () {
                events.doubleClickStarted = false;
            }, 300);
        }

        var coords = events._getCoords(e);

        showCharacter();

        var myCursorPosX = coords.x;
        var myCursorPosY = coords.y;

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
     * Mouse move event
     * @param e
     * @private
     */
    events._mouseMoveEvent = function(e) {
        userActions.mouseMove(events._getCoords(e));
    };

    /**
     * click on input or button
     * @param x
     * @param y
     */
    events._checkSelectionOnParsed = function (x, y) {
        events.setCursor(userActions.clickOnElement(x, y));
    };

    /**
     * print symbol
     * @param keyCode
     */
    events._executeParsedKey = function (keyCode) {
        var char = String.fromCharCode(keyCode);
        events.setCursor(userActions.addText(char));
    };

    /**
     * move in input with arrow
     * @param side
     */
    events._moveWithArrow = function (side) {
        userActions.move(side);
    };

    /**
     * Delete symbol in input
     */
    events._backspace = function () {
        events.setCursor(userActions.backspace());
    };

    /**
     * Press enter event
     * @private
     */
    events._pressEnter = function () {
        events.setCursor(userActions.pressEnter());
    };

    /**
     * This registers a key event listener, so entering something in the browser has functionality
     */
    events._registerKeyEventListener = function () {

        document.body.addEventListener('keypress', function (e) {

            var keyCode = e.which;

            if (keyCode != 0 && !events.ctrlKey) {
                e.preventDefault();
                events._handleKeyCode(e);
            }

        });

        document.body.addEventListener('keydown', function (e) {

            userActions.callKeyDown();

            // Keys to control - CTRL + (A, C, V, Z, X)
            var controlingKeys = [65, 67, 86];

            var keyCode = e.which;

            // Control
            if (keyCode == 17) {
                events.ctrlKey = true;
            }

            // ESC
            else if (keyCode == 27) {  // ESCAPE
                events.hideCursor();
                userActions.pressESC();
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

            // CTRL + (A, C, X, Z, V)
            else if (events.ctrlKey && controlingKeys.indexOf(keyCode) !== -1) {
                e.preventDefault();
                events._handleKeyCode3(e);
            }

            // Numbers
            else if (48 <= keyCode && keyCode <= 57 && e.shiftKey) {
                e.preventDefault();

                var symbol;

                switch (keyCode) {
                    case 48:
                        symbol = 41;
                        break;
                    case 49:
                        symbol = 33;
                        break;
                    case 50:
                        symbol = 64;
                        break;
                    case 51:
                        symbol = 35;
                        break;
                    case 52:
                        symbol = 36;
                        break;
                    case 53:
                        symbol = 37;
                        break;
                    case 54:
                        symbol = 94;
                        break;
                    case 55:
                        symbol = 38;
                        break;
                    case 56:
                        symbol = 42;
                        break;
                    case 57:
                        symbol = 40;
                        break;

                }
                events._specialCommand(keyCode, symbol);
            }

            // End key
            else if (keyCode === 35) {
                events.setCursor(userActions.pressEnd());
            }

            // Home key
            else if (keyCode === 36) {
                events.setCursor(userActions.pressHome());
            }
        });

        document.body.addEventListener("keyup", function (e) {

            userActions.callKeyUp();

            if (e.which === 17) {
                events.ctrlKey = false;
            }
        })
    };

    /**
     * This converts to keycodes to real characters.
     * Language dependency included.
     * Calls events._executeParsedKey to show the keys in effect
     */
    events._handleKeyCode = function (e) {

        var keyCode = e.which;

        if (!e.shiftKey && keyCode !== 99 && keyCode !== 116 && keyCode !== 120) {
            // 99 - c, 116 - t, 120 - x
            userActions.deselect();
        }

        // Digits
        if (48 <= keyCode && keyCode <= 57) {
            events._executeParsedKey(keyCode);
            return true;
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
                events._pressEnter();
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

        if (!e.shiftKey) {
            userActions.deselect();
        }

        switch (keyCode) {

            case 39 : // cursor right
                if (!e.shiftKey) {
                    events._moveWithArrow("right");
                } else {
                    events.copyMode = true;
                    events.setCursor(userActions.addSelection("right", e.ctrlKey));
                }
                break;
            case 40 : // cursor down
                if (!e.shiftKey) {
                    events._moveWithArrow("down");
                } else {
                    events.copyMode = true;
                    events.setCursor(userActions.addSelection("down", e.ctrlKey));
                }
                break;
            case 37: // cursor left, %
                if (!e.shiftKey) {
                    events._moveWithArrow("left");
                } else {
                    events.copyMode = true;
                    events.setCursor(userActions.addSelection("left", e.ctrlKey));
                }
                break;
            case 38: // cursor up
                if (!e.shiftKey) {
                    events._moveWithArrow("up");
                } else {
                    events.copyMode = true;
                    events.setCursor(userActions.addSelection("up", e.ctrlKey));
                }
                break;
        }
    };

    /**
     * Handle CTRL + (A, C, X, Z, V) events
     * @param e
     * @private
     */
    events._handleKeyCode3 = function (e) {

        switch (e.which) {

            // CTRL + A
            case 65:
                events.setCursor(userActions.selectAll());
                break;

            // CTRL + C
            case 67:
                userActions.copySelection();
                break;

            // CTRL + V
            case 86:
                events.setCursor(userActions.pasteFromClipboard());
                break;
        }
    };

    /**
     * Execute special command (shift + 1...)
     * @param keyCode
     * @private
     * @param symbolKeyCode
     */
    events._specialCommand = function (keyCode, symbolKeyCode) {
        events.setCursor(userActions.specialCommand(keyCode, symbolKeyCode));
    };

    /**
     * Translate event coords to ansi coords
     * @param e
     * @returns {{x: number, y: number}}
     * @private
     */
    events._getCoords = function (e) {

        var ansicanvas = document.getElementById('ansi');
        var mouse = getMousePos(ansicanvas, e);

        return {
            x: Math.floor(mouse.x / canvasCharacterWidth),
            y: Math.floor(mouse.y / canvasCharacterHeight)
        };
    };

    // Publish in global
    if (typeof exports !== 'undefined') {
        exports.eventsHandler = events;
    } else {
        global.eventsHandler = events;
    }

})(this);