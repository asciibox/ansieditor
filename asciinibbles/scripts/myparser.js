// Gets called from calculateContent and shows the parameter text at the given x and y position on the canvas
    function printthat(text, x, y, fg_rgb, bg_rgb) {
        var mygoto = cursor.goto(x, y);
        var fg = cursor.rgb(fg_rgb[0], fg_rgb[1], fg_rgb[2]).foreground.current;
        var bg = "48" + cursor.rgb(bg_rgb[0], bg_rgb[1], bg_rgb[2]).foreground.current.substring(2);
        fg = String.fromCharCode(27) + "[" + fg + "m";
        bg = String.fromCharCode(27) + "[" + bg + "m";
        parseANSI(mygoto + fg + bg + text);
    }

    function parseANSI(text) {

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


    /** JS FUNCTIONS CALLED IN PARSE.JS **/

    function parsed_drawChar(ctx, charcode, fg_rgb, bg_rgb, x, y) {

        var mygoto = cursor.goto(x, y);

        var fg = cursor.rgb(fg_rgb[0], fg_rgb[1], fg_rgb[2]).foreground.current;
        var bg = "48" + cursor.rgb(bg_rgb[0], bg_rgb[1], bg_rgb[2]).foreground.current.substring(2);
        fg = String.fromCharCode(27) + "[" + fg + "m";
        bg = String.fromCharCode(27) + "[" + bg + "m";
        var mychar = String.fromCharCode(charcode);

        parseANSI(mygoto + fg + bg + mychar);

    }

    function parsed_showCharacter(bool) {
        showCharacter(bool);
    }

    function parsed_redrawCursor() {
        redrawCursor(true);
    }

    function parsed_setCursorPosX(x) {
        if (typeof (globalDisplay) != "undefined") {
            var mygoto = cursor.goto(x, globalDisplay.getPosY());
            parseANSI(mygoto);
        }
        setCursorPosX(x);
    }

    function parsed_setCursorPosY(y) {
        if (typeof (globalDisplay) != "undefined") {
            var mygoto = cursor.goto(globalDisplay.getPosX(), y);
            parseANSI(mygoto);
        }
        setCursorPosY(y);
    }
    function parsed_getCursorPosX(x) {
        return cursorPosX;
    }
    function parsed_getCursorPosY(y) {
        return cursorPosY;
    }