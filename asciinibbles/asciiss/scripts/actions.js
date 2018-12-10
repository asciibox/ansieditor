/**
 * Created by curtov.com on 14.06.2015.
 * @namespace parseANSI
 */
"use strict";
(function (global) {

    /**
     * Actions
     * Calling in index.html after parsing tags
     * @constructor
     */
    var Actions = function () {

        // index of this.inputs
        this.selected = null;

        // cursor position in inputs
        this._cursorX = 0;
        this._cursorY = 0;

        // selection
        this.selection = null;

        this.clipboard = "";

        this.idByCommnad = {};

        // element of popup window
        this.popup = null;

        this.hovered = null;
    };

    /**
     * Take all parsed data and draw first time
     * @param $data
     */
    Actions.prototype.init = function ($data) {
        var self = this;

        this.deselect();

        this.deselectElement();

        this.idByCommnad = {};

        this.$data = $data;

        setTimeout(function() {
            self.redrawElement("all");

            // Focus on first editable input
            self.$data.find("input, textarea").each(function() {
                if (this.asciiData.editable) {
                    self.selected = this;
                    self.callOnFocus();
                    self._selectInput();
                    global.eventsHandler.setCursor(self._getCursor());
                    return false;
                }
            });

            if (self.selected === null) {
                global.eventsHandler.setCursor(false);
            }

            $(global).triggerHandler("drawn");
        }, 5);

        // Bind moving cursor event
        this.$data.on("up down left right", function (e) {
            if (e.isDefaultPrevented()) {
                return;
            }

            eventsHandler.setCursor(self._move(e.type));
        });

        // Change input trigger
        this.$data.on("next prev", function (e, data) {
            if (e.isDefaultPrevented()) {
                return;
            }

            self._changeInput(e.type, data.filter);
        })
    };

    /**
     * Selecting current element
     * @returns {{x: number, y: number} || boolean}
     */
    Actions.prototype.selectId = function (id) {

        this.deselect();

        this.deselectElement();

        this._selectElements("#" + id);

        return this._getCursor();
    };

    /**
     * Check element on coords and make it selected
     * @param x
     * @param y
     * @returns {*}
     */
    Actions.prototype.clickOnElement = function (x, y) {
        var self = this;

        this.deselect();

        this.deselectElement();

        // if need to update cursor
        var updateCursor = false;

        // if popup is visible
        if (this.popup) {

            // popup can have borders (nned to check if click inside popup)
            var data = this.popup.asciiData.border || this.popup.asciiData;

            // if click inside popup window
            if (this._contains(data, x, y)) {
                var $data = $(this.popup);
            } else {
                // click outside
                $(this.popup).hideHidden();
                $data = this.$data;
            }
        } else {
            // no popup
            $data = this.$data;
        }

        // seek element under x and y
        $data.find("*").each(function () {
            var $this = $(this);

            // not editable
            if (typeof this.asciiData === "undefined") {
                return;
            }

            if (!this.asciiData.editable) {
                return;
            }

            if (!this.asciiData.visible) {
                return;
            }

            if ($this.closest("div")[0].asciiData && !$this.closest("div")[0].asciiData.visible) {
                return;
            }

            // if element contains x and y
            if (self._contains(this.asciiData, x, y)) {

                // trigger click
                $this.click();

                // set selection
                if (this.asciiData.type !== "button") {

                    // setting current selected
                    self.selected = this;

                    self.callOnFocus();

                    self._selectInput(x, y);

                    // checkbox change state by click
                } else if (this.asciiData.type === "checkbox") {
                    self.addText(" ");

                    // Change state of radio button
                } else if (this.asciiData.type === "radio") {
                    self._selectRadio();

                    // Change state of flags
                } else if (this.asciiData.type === "flags") {
                    self._selectFlags(x);

                    // Change state of select element
                } else if (this.asciiData.type === "select") {
                    self._selectSelect(x);
                    return false;
                }

                updateCursor = true;

                return false
            }

        });

        // id of parent block
        var id = $(this.selected).closest("[id]").attr('id');

        // Make parent block selected id
        if (id) {
            for (var num in this.idByCommnad) if (this.idByCommnad.hasOwnProperty(num)) {
                if (this.idByCommnad[num] == id) {
                    this.idByCommnad.selected = num;
                    break;
                }
            }
        }

        if (updateCursor) {
            return this._getCursor();
        } else {
            return false;
        }
    };

    /**
     * Add text to element
     * @param text
     * @returns {*}
     */
    Actions.prototype.addText = function (text) {

        if (this.selected === null) {
            return;
        }

        var data = this.selected.asciiData;

        this.callOnChange();

        // checkbox can be changed by click or space
        if (data.type === "checkbox") {

            if (text === " ") {
                if (data.text.charCodeAt(0) === 254) {
                    data.text = String.fromCharCode(250)
                } else {
                    data.text = String.fromCharCode(254);
                }

                this._render(data);
            }

            return this._getCursor();
        }

        // change 'radio' button value
        if (data.type === "radio") {
            if (text === " ") {
                this._selectRadio();
            }
            return this._getCursor();
        }

        // change 'flags' value
        if (data.type === "flags") {
            if (text === " ") {
                this._selectFlags(this._cursorX);
            }
            return this._getCursor();
        }

        // change 'select' element value
        if (data.type === "select") {
            if (text === " ") {
                this._selectSelect();
            }
            return false;
        }

        // with button nothing to do
        if (data.type === "button") {
            return false;
        }

        // Editing input with one symbol
        if (data.type === "input" && data.width === 1) {

            var symbol = text[0];

            if (data.range) {
                var num = parseInt(symbol);

                if (!(data.range.min <= num && num <= data.range.max)) {
                    num = 0;
                }

                symbol = "" + num;
            }

            // Set text to value of element
            this.selected.value = symbol;

            // set to redraw
            data.text = symbol;

            // redraw
            this._render(data);

            // return cursor
            return this._getCursor();
        }

        // Position in text relative to cursor
        var textPos = this._getTextPos(data);

        // Inserting text on position
        data.text = [data.text.slice(0, textPos), text, data.text.slice(textPos)].join('');

        // Set text to value of element
        this.selected.value = data.text;

        // if the text is bigger than input
        var offset = textPos + text.length - data.length;

        // text starts from offset - all string move left
        if (offset >= 0) {
            data.textStart = offset + 1;
        }

        // position of cursor
        var x = this._cursorX + text.length;
        var y = this._cursorY;

        // if added text bigger than input
        if (x - data.x >= data.width) {
            var lines = Math.ceil((x + 1 - data.x) / data.width);
            if (lines > data.height) {
                x = data.x + data.width - 1;
                y = data.y + data.height - 1;
            } else {
                y++;
                x = data.x + text.length % data.width - 1;
            }
        }

        // cursor position on screen
        this._cursorX = x;
        this._cursorY = y;

        this._render(data);

        return this._getCursor();
    };

    /**
     * Set text to element
     * @param $el
     * @param text
     */
    Actions.prototype.setText = function ($el, text) {

        var data = $el[0].asciiData;

        // Set value to the element
        data.text = text;

        $el.val(text);

        if (data.type === "input" || data.type === "textarea") {
            data.textStart = 0;
            data.length = data.width * data.height;
            this._render(data);
        } else if (data.type === "text") {
            data.width = data.width < text.length ? text.length : data.width;
            this._render(data);
            data.width = text.length;
        }

        $el.trigger("change");
    };

    /**
     * Moving cursor event
     * @param side
     * @returns {boolean}
     */
    Actions.prototype.move = function (side) {
        if (this.selected === null) {
            return false;
        }

        $(this.selected).trigger(side);
    };

    /**
     * Moving cursor inside element
     * @param side
     * @returns {{x: number, y: number} || boolean}
     */
    Actions.prototype._move = function (side) {

        var data = this.selected.asciiData;

        var $selected = $(this.selected);

        // Change inputs if pressed up || down
        if (data.type !== "textarea" && (side === "up" || side === "down")) {
            var param = (side === "down") ? "next" : "prev";

            // triggering changing focus
            $selected.trigger(param, {filter: true, side: side});
            return this._getCursor();
        }

        // Change inputs if pressed up || down
        if ((data.width === 1 || data.type === "button" || data.type === "select") && (side === "left" || side === "right")) {
            param = (side === "right") ? "next" : "prev";

            // triggering changing focus
            $selected.trigger(param, {filter: false, side: side});
            return this._getCursor();
        }

        // current position
        var x = this._cursorX;
        var y = this._cursorY;

        // current text offset
        var textStart = data.textStart || 0;

        switch (side) {
            case "up":

                // first line
                if (y === data.y) {

                    // text visuble from beginning - change input
                    if (textStart === 0) {
                        $selected.trigger("prev", {filter: true, side: side});
                        return this._getCursor();
                    }

                    // cursor on the first letter - move text up one line
                    if (x === data.x) {
                        textStart = Math.max(0, textStart - data.width);
                    }
                    break;
                }

                // simple moving up
                y--;
                break;

            case "down":

                // last line
                if (y === data.y + data.height - 1) {

                    // end of text - change input
                    if (data.text.length - textStart <= data.length) {
                        $selected.trigger("next", {filter: true, side: side});
                        return this._getCursor();
                    }

                    // cursor in the right down corner, trying to move text
                    if (x === data.x + data.width - 1) {
                        textStart = Math.min(data.text.length - data.length, textStart + data.width);
                    }
                    break;
                }

                // simple moving cursor
                y++;
                break;

            case "right":

                // simple moving cursor right
                if (x < data.x + data.width - 1) {

                    // cursor in the end of text (middle of input)
                    if (data.text.length - data.textStart === x - data.x) {
                        $selected.trigger("next", {filter: false, side: side});
                        return this._getCursor();
                    }
                    x++;
                    break;
                }

                // end of line
                var EOL = (x === data.x + data.width - 1);

                // last line
                var lastLine = (y === data.y + data.height - 1);

                // moving to the begining of next line
                if (EOL && !lastLine) {
                    x = data.x;
                    y++;
                    break;
                }

                // moving text
                if (data.type !== "flags" && EOL && lastLine && data.text.length - textStart >= data.length) {
                    textStart++;
                    break;
                }

                // cursor at the last position of input
                $selected.trigger("next", {filter: false, side: side});
                return this._getCursor();

            case "left":

                // simple moving left
                if (x > data.x) {
                    x--;
                    break;
                }

                // up one line
                if (x === data.x && y > data.y) {
                    x = data.x + data.width - 1;
                    y--;
                    break;
                }

                // moving text
                if (x === data.x && textStart > 0) {
                    textStart--;
                    break;
                }

                // cursor at the first position of input
                $selected.trigger("prev", {filter: false, side: side});
                return this._getCursor();
        }

        if (textStart !== data.textStart) {
            data.textStart = textStart;
            this._render(data);
        }

        this._selectInput(x, y);

        // calculate position
        return this._getCursor();

    };

    /**
     * Delete one symbol before cursor
     * @returns {{x: number, y: number} || boolean}
     */
    Actions.prototype.backspace = function () {

        var data = this.selected.asciiData;

        // Position in text relative to cursor
        var textPos = this._getTextPos(data);

        // nothing to delete
        if (textPos === 0) {
            return false;
        }

        // remove one symbol
        data.text = [data.text.slice(0, textPos - 1), data.text.slice(textPos)].join('');

        // Set value to the element
        this.selected.value = data.text;

        var moveCursorX = true;

        // if text was bigger than element
        if (data.textStart > 0) {
            data.textStart--;
            moveCursorX = false;
        }

        // cursor position
        if (this._cursorX - 1 < data.x) {
            this._cursorX = data.x + data.width - 1;
            this._cursorY--;
        } else if (moveCursorX) {
            this._cursorX--;
        }

        this._render(data);

        this.callOnChange();

        return this._getCursor();
    };

    /**
     * Selecting text with Shift + arrows
     * @param side {"left" || "right" || "up" || "down"}
     * @param [ctrl] {boolean} Is CTRL pressed
     * @returns {{x: number, y: number}} Coords of cursor
     */
    Actions.prototype.addSelection = function (side, ctrl) {

        ctrl = ctrl || false;

        var data = this.selected.asciiData;

        // position in text after moving
        var currentPos = this._getTextPos(data);

        // First time
        if (this.selection === null) {

            // position before moving cursor
            this.selection = {
                first: currentPos, // never changing
                start: currentPos
            }
        }

        // If CTRL was pressed
        if (ctrl) {
            if (side === "up" || side === "down") {

                // moving cursor (simple selecting)
                this.move(side);

                // Selecting word by word
            } else if (side === "left") {

                // moving left to space or beginning of text and making one step back - cursor in the beginning of word
                for (i = currentPos; i >= 0; i--) {
                    if (data.text[i] === " " && i !== currentPos - 1) {
                        this.move("right");
                        break;
                    }
                    this.move("left");
                }

                // Selecting word by word
            } else if (side === "right") {

                // moving right to space or end
                for (var i = currentPos, length = data.text.length; i < length; i++) {
                    if (data.text[i] === " ") {
                        this.move("right");
                        break;
                    }
                    this.move("right");
                }
            }
        } else {
            // moving cursor
            this.move(side);
        }

        // position in text after moving
        currentPos = this._getTextPos(data);

        // start always < end
        if (this.selection.first < currentPos) {
            this.selection.start = this.selection.first;
            this.selection.end = currentPos;
        } else {
            this.selection.start = currentPos;
            this.selection.end = this.selection.first;
        }

        // selecting text
        this.selection.text = data.text.slice(this.selection.start, this.selection.end);

        // render element with selection
        this._render(data);

        // return cursor position
        return this._getCursor();
    };

    /**
     * Deselect element.
     * Click anywhere or type somthing without shift
     */
    Actions.prototype.deselect = function () {

        // if nothing to deselect
        if (this.selection === null) {
            return;
        }

        // clear selection
        this.selection = null;

        // render element to clear highlighted selection
        this._render(this.selected.asciiData);


    };

    /**
     * Selecting all text inside input
     * @returns {{x: number, y: number}}
     */
    Actions.prototype.selectAll = function () {
        var data = this.selected.asciiData;

        this.selection = {
            first: 0,
            start: 0,
            end: data.text.length,
            text: data.text
        };

        // Highlight text
        this._render(data);

        // Set selection on last symbol
        this._selectInput();

        // Get cursor
        return this._getCursor();

    };

    /**
     * Copy selected text to clipboard (not browser)
     */
    Actions.prototype.copySelection = function () {
        this.clipboard = this.selection.text;
        console.log("copied", this.clipboard);
    };

    /**
     * Paste text
     */
    Actions.prototype.pasteFromClipboard = function () {

        // If selection present (clearing selection first)
        if (this.selection !== null) {
            var data = this.selected.asciiData;

            // extracting text
            data.text = data.text.slice(0, this.selection.start) + data.text.slice(this.selection.end);

            // If cursor at the end of selection - moving to the begining
            if (this._getTextPos(data) === this.selection.end) {
                for (var i = 0, length = this.selection.end - this.selection.start; i < length; i++) {
                    this.move("left");
                }
            }

            // clear selection
            this.selection = null;
        }

        // Paste text and return cursor coordinates
        return this.addText(this.clipboard);
    };

    /**
     * Set Shift + num command for elements with id
     * @param id
     * @param num
     */
    Actions.prototype.setSpecialCommand = function (id, num) {
        this.idByCommnad[num] = id;
    };

    /**
     * Execute special commad
     * @param keyCode
     * @returns {{x: number, y: number}|boolean}
     * @param symbolKeyCode
     */
    Actions.prototype.specialCommand = function (keyCode, symbolKeyCode) {
        var num = String.fromCharCode(keyCode);
        var symbol = String.fromCharCode(symbolKeyCode);

        // if command wasn`t set before - addtext to selected element
        if (typeof this.idByCommnad[num] === "undefined") {
            if (this.selected !== null) {
                return this.addText(symbol);
            }

            return false;
        }

        // trying to select the same block - adding text
        if (this.idByCommnad.selected === num) {
            return this.addText(symbol);
        }

        // set selected block
        this.idByCommnad.selected = num;

        // select block
        return this.selectId(this.idByCommnad[num]);
    };

    /**
     * Press Enter event
     */
    Actions.prototype.pressEnter = function () {
        if (this.selected === null) {
            this.$data.trigger("pressed-enter");
            return;
        }

        var el = this.selected;
        if (el.asciiData.type === "button") {
            $(el).trigger("click");
            $(el).trigger("pressed-enter");
            return;
        }

        this._changeInput("next");
        return this._getCursor();
    };

    /**
     * Press ESC event
     */
    Actions.prototype.pressESC = function () {
        this.deselect();

        if (this.selected === null) {
            this.$data.trigger("pressed-esc");
            return;
        }

        $(this.selected).trigger("pressed-esc");

        this.deselectElement();
    };

    /**
     * Press Home event
     */
    Actions.prototype.pressHome = function () {
        if (this.selected === null) {
            return false;
        }

        var data = this.selected.asciiData;

        this._selectInput(data.x, this._cursorY);

        return this._getCursor();
    };

    /**
     * Press End event
     */
    Actions.prototype.pressEnd = function () {
        if (this.selected === null) {
            return false;
        }

        var data = this.selected.asciiData;

        this._selectInput(data.x + data.width - 1, this._cursorY);

        return this._getCursor();
    };

    /**
     * Set selection to the element
     * @param el
     * @returns {*}
     */
    Actions.prototype.selectElement = function (el) {
        this.deselectElement();

        if (!el.asciiData.editable) {
            return false;
        }

        this.selected = el;
        this.callOnFocus();
        this._selectInput();
        return this._getCursor();
    };

    /**
     * Deselect element with focus
     */
    Actions.prototype.deselectElement = function () {
        if (this.selected === null) {
            return;
        }

        this.callOnDeselect();

        $(this.selected).restoreColor();

        this.selected = null;

    };

    /**
     * Get all parsed jQuery object
     * @returns {*}
     */
    Actions.prototype.getObj = function () {
        return this.$data;
    };

    /**
     * Draw eleemnt
     * @param el
     */
    Actions.prototype.redrawElement = function (el) {
        var self = this;

        if (el === "all") {
            self.$data.children().each(function () {
                self._initElement(this);
            });
        } else {
            this._initElement(el);
        }


    };

    /**
     * Set popup object
     * @param el {jQuery || null}
     */
    Actions.prototype.setPopup = function (el) {
        this.popup = el;
    };

    /**
     * Mouse move event
     * @param coords
     */
    Actions.prototype.mouseMove = function (coords) {
        var self = this;

        var hovered = this.hovered;

        this.hovered = null;

        this.$data.find("[onmouseover]").each(function() {
            if (self._contains(this.asciiData, coords.x, coords.y)) {
                $(this).trigger("mouseover");
                self.hovered = this;
                return false;
            }
        });

        if (this.hovered === null && hovered !== null) {
            $(hovered).restoreColor();
            return;
        }

        if (hovered !== null && hovered !== this.hovered) {
            $(hovered).restoreColor();
        }
    };


    /**
     * Trigger keydown event on selected element
     */
    Actions.prototype.callKeyDown = function () {
        $(this.selected).trigger("keydown");
    };

    /**
     * Trigger keyup event on delected element
     */
    Actions.prototype.callKeyUp = function () {
        $(this.selected).trigger("keyup");
    };

    /**
     * Trigger onchange on selected element
     */
    Actions.prototype.callOnChange = function () {
        $(this.selected).trigger("change");
    };

    /**
     * Trigger focus event on selected element
     */
    Actions.prototype.callOnFocus = function () {
        $(this.selected).trigger("select");
    };

    /**
     * Trigger focus event on selected element
     */
    Actions.prototype.callOnDeselect = function () {
        $(global).triggerHandler("deselect");
    };


    /**
     * Click or change by space value in input with special type flags
     * @private
     */
    Actions.prototype._selectSelect = function () {

        // Element
        var $el = $(this.selected);

        // Current option selected
        var index = $el.find("option[selected]").removeAttr("selected").index();

        // If nothing was selected than taking first option
        index = (index === -1) ? 0 : index;

        // Next option
        index++;

        // All options
        var $options = $el.find("option");

        // If was last option, continue from begining
        if (index >= $options.length) {
            index = 0;
        }

        // Set option selected and taking it text
        this.selected.asciiData.text = $options.eq(index).attr("selected", "selected").text();

        // Redraw element
        this._render(this.selected.asciiData);
    };

    /**
     * Click or change by space value in input with special type flags
     * @private
     */
    Actions.prototype._selectFlags = function (x) {

        // Element
        var el = this.selected;

        // Position of selected
        var num = x - el.asciiData.x;

        // string of symbols
        var text = el.asciiData.text;

        // Changing char
        if (text[num] === "-") {
            var char = "X";
        } else {
            char = "-"
        }

        // New string with changes
        text = text.substr(0, num) + char + text.substr(num + 1);

        // setting vale to element (ca be needed in ajax)
        var value = "";
        for (var i = 0, length = text.length; i < length; i++) {
            if (text[i] === "-") {
                value += "0";
            } else {
                value += "1";
            }
        }
        $(el).val(value);

        // Changing text
        el.asciiData.text = text;

        // Redraw element
        this._render(el.asciiData);
    };

    /**
     * Making radio button on and all siblings button off
     * @private
     */
    Actions.prototype._selectRadio = function () {

        // Selected is ON
        if (this.selected.asciiData.text === "X") {
            return;
        }

        var $el = $(this.selected);
        var self = this;

        // Disable each sibling radio button
        $el.siblings('[type="radio"]').each(function () {

            // Set value of element (can be needed in ajax) [pure js ver - this.value = "0";]
            $(this).val("0");

            if (this.asciiData.text !== "-") {
                this.asciiData.text = "-";
                self._render(this.asciiData);
            }
        });

        // Set value and redraw element
        $el.val("1");
        this.selected.asciiData.text = "X";
        this._render(this.selected.asciiData);
    };

    /**
     * Set selection to any input or textarea (including child) of element by selector
     * @param selector
     * @private
     */
    Actions.prototype._selectElements = function (selector) {
        var self = this;

        var parentBlock = this.$data.find(selector).first();

        parentBlock.find("input, textarea, select").each(function () {
            if (this.asciiData.editable) {
                self.selected = this;
                return false;
            }
        });

        if (this.selected !== null) {
            this.callOnFocus();
            this._selectInput();
        }
    };

    /**
     * Initialization of element
     * @param el
     * @private
     */
    Actions.prototype._initElement = function (el) {
        var self = this;

        if (typeof el.asciiData === "undefined") {
            return;
        }

        if (!el.asciiData.visible) {
            return;
        }

        this._render(el.asciiData);

        $(el).children().each(function () {
            self._initElement(this);
        });
    };

    /**
     * Position in text relative to cursor
     * @param data
     * @returns {number}
     * @private
     */
    Actions.prototype._getTextPos = function (data) {

        // Position in text by cursor position
        return data.textStart + (this._cursorY - data.y) * data.width + (this._cursorX - data.x);
    };

    /**
     * Check if the element contains x and y
     * @param data
     * @param x
     * @param y
     * @returns {boolean}
     */
    Actions.prototype._contains = function (data, x, y) {

        if (y < data.y) {
            return false;
        }

        if (y >= data.y + data.height) {
            return false;
        }

        if (x < data.x) {
            return false;
        }

        return x < data.x + data.width;


    };

    /**
     * Select element
     * @param {number} [x]
     * @param {number} [y]
     */
    Actions.prototype._selectInput = function (x, y) {

        var data = this.selected.asciiData;

        if (data.type === "button") {
            this._selectButton();
            return;
        }

        if (data.text.length === 0) {
            this._cursorY = data.y;
            this._cursorX = data.x;
            return;
        }

        // default at the end of input
        x = x || data.x + data.width - 1;
        y = y || data.y + data.height - 1;

        // If text is bigger than input
        if (data.text.length >= data.length) {
            this._cursorY = y;
            this._cursorX = x;
            return;
        }

        // y coord of last line of text
        var maxY = Math.ceil(data.text.length / data.width) + data.y - 1;

        // last position of char in last line
        var maxX = data.x + data.text.length % data.width;

        // all text is visible -> text starts from beginning
        data.textStart = 0;

        if (y > maxY) {
            this._cursorY = maxY;
            this._cursorX = maxX;
        } else if (y === maxY) {
            this._cursorY = y;
            if (x >= maxX) {
                this._cursorX = maxX;
            } else {
                this._cursorX = x;
            }
        } else {
            this._cursorY = y;
            this._cursorX = x;
        }
    };

    /**
     * Select buttob
     * @private
     */
    Actions.prototype._selectButton = function() {
        $(this.selected).setFgBg("black", "yellow");
        this._cursorX = 0;
        this._cursorY = 0;
    };

    /**
     * Choose next || prev input
     * @param param
     * @private
     * @param [filter]
     */
    Actions.prototype._changeInput = function (param, filter) {
        var el = this.selected;

        filter = filter || false;

        // all editable
        var $inputs = $(el)
            .closest("[id]")
            .find("input, textarea, select");

        // Looking only elements on the same X
        if (filter) {

            // Current X
            var minX = el.asciiData.x;
            var maxX = el.asciiData.x + el.asciiData.width;

            // Inputs on the same x
            var $inputsX = $inputs .filter(function() {
                var left = this.asciiData.x;
                var right = this.asciiData.x + this.asciiData.width;
                return (
                    (minX <= left && left <= maxX) || (minX <= right && right <= maxX)
                    ||
                    (left <= minX && minX <= right) || (left <= maxX && maxX <= right)
                );
            });

            // Has inputs on the same x more than self
            if ($inputsX.length > 1) {
                $inputs = $inputsX;
            }
        }

        // No inputs
        if ($inputs.length === 0) {
            return;
        }

        // index of current element
        var index = $inputs.index(el);

        if (param === "next") {
            index++;
            if (index >= $inputs.length) {
                index = $inputs.length - 1;
            }
        }

        if (param === "prev") {
            index--;
            if (index < 0) {
                index = 0;
            }
        }

        // The same element
        if (el === $inputs.eq(index)[0]) {
            return;
        }

        this.deselectElement();

        this.selected = $inputs.eq(index)[0];

        this.callOnFocus();

        this._selectInput();
    };

    /**
     * Return cursor position
     * @returns {{x: number, y: number}}
     */
    Actions.prototype._getCursor = function () {
        return {
            x: this._cursorX,
            y: this._cursorY
        }
    };

    /**
     * Print element on screen
     * @private
     */
    Actions.prototype._render = function (data) {

        if (data.border) {
            this._renderBorder(data);
        }

        if (!data.editable) {

            // Simple printing
            if (data.width === data.text.length) {
                this._printOnCanvas(data.text, data.x, data.y, data.fg, data.bg);
                return;
            } else {
                var text = data.text;
                var length = data.width;
            }
        } else {
            text = data.text.substr(data.textStart, data.length);
            length = data.length;
        }

        if (this.selection !== null) {
            var start = this.selection.start - data.textStart;
            var end = this.selection.end - data.textStart;
        }

        // print text to width * hight from start
        var x = 0,
            y = 0;

        for (var i = 0; i < length; i++) {

            if (this.selection !== null) {

                if (start <= i && i < end) {
                    var bg = this.$data.defaultColours.selection.bg;
                } else {
                    bg = data.bg
                }

            } else {
                bg = data.bg
            }

            var char = text[i] || " ";
            this._printOnCanvas(char, data.x + x, data.y + y, data.fg, bg);
            x++;
            if (x >= data.width) {
                x = 0;
                y++;
            }
        }
    };

    /**
     * Drawing the borders
     * @param data
     * @private
     */
    Actions.prototype._renderBorder = function (data) {

        // Symbols for borders
        var border1 = {
            topLeft: String.fromCharCode(218),
            topRight: String.fromCharCode(191),
            bottomLeft: String.fromCharCode(192),
            bottomRight: String.fromCharCode(217),
            horizontal: String.fromCharCode(196),
            vertical: String.fromCharCode(179)
        };

        // 2 line border
        var border2 = {
            topLeft: String.fromCharCode(201),
            topRight: String.fromCharCode(187),
            bottomLeft: String.fromCharCode(200),
            bottomRight: String.fromCharCode(188),
            horizontal: String.fromCharCode(205),
            vertical: String.fromCharCode(186)
        };

        // Choosing the border style
        var style = (data.border.style === 2) ? border2 : border1;

        if (this.$data.defaultColours.text.bg !== data.bg) {
            var whiteSpaces = "";
            for (i = 0; i < data.border.width; i++) {
                whiteSpaces += " ";
            }

            for (i = 0; i < data.border.height; i++) {
                this._printOnCanvas(whiteSpaces, data.border.x, data.border.y + i, data.bg, data.bg);
            }
        }

        // Horizontal lines
        var length = data.border.width;
        var y = data.border.y;

        // twice for top and bottom
        for (var n = 0; n < 2; n++) {

            for (var i = 1; i < length; i++) {
                this._printOnCanvas(style.horizontal, data.border.x + i, y, data.border.fg, data.bg);
            }

            y = data.border.y + data.border.height;
        }

        // Vertical lines
        var x = data.border.x;
        length = data.border.height;

        for (n = 0; n < 2; n++) {

            for (i = 1; i < length; i++) {
                this._printOnCanvas(style.vertical, x, data.border.y + i, data.border.fg, data.bg);
            }

            x = data.border.x + data.border.width;
        }

        // Corners
        this._printOnCanvas(style.topLeft, data.border.x, data.border.y, data.border.fg, data.bg);
        this._printOnCanvas(style.topRight, data.border.x + data.border.width, data.border.y, data.border.fg, data.bg);
        this._printOnCanvas(style.bottomLeft, data.border.x, data.border.y + data.border.height, data.border.fg, data.bg);
        this._printOnCanvas(style.bottomRight, data.border.x + data.border.width, data.border.y + data.border.height, data.border.fg, data.bg);

    };

    /**
     * Print symbols on canvas
     * if printing 1 symbol it`s check current symbol and colors and if the same nothing to do
     * @param text
     * @param x
     * @param y
     * @param fg
     * @param bg
     * @private
     */
    Actions.prototype._printOnCanvas = function (text, x, y, fg, bg) {

        // More than 1 symbol in string
        if (text.length !== 1) {
            var parse = global.cursor.goto(x, y) + fg[0] + bg[0] + text;
            this._parseANSI(parse);
            return;
        }

        console.log('Y:'+y+' x: '+x);
        if (x<screenCharacterArray[y].length) {
            if (String.fromCharCode(screenCharacterArray[y][x][0]) !== text) {
                parse = global.cursor.goto(x, y) + fg[0] + bg[0] + text;
                this._parseANSI(parse);
                return;
            }

            // Diffrent background color - print
            if (screenCharacterArray[y][x][2] != bg[1]) {
                parse = global.cursor.goto(x, y) + fg[0] + bg[0] + text;
                this._parseANSI(parse);
                return;
            }

            // Diffrent foreground color - print
            if (screenCharacterArray[y][x][1] != fg[1]) {
                parse = global.cursor.goto(x, y) + fg[0] + bg[0] + text;
                this._parseANSI(parse);
            }
        }
    };

    /**
     * Crazy blinking cursor at the 0:0
     * @param parse
     * @private
     */
    Actions.prototype._parseANSI = function(parse) {
        var cursor = cursorShown;
        global.parseANSI(parse);
        if (!cursor) {
            global.eventsHandler.setCursor(false);
        }
    };

    /**
     * Clearing rect area
     * @param x
     * @param y
     * @param w
     * @param h
     */
    Actions.prototype.clearRect = function(x, y, w, h) {

        var blank = "";

        var charArray = [32,currentForeground,currentForeground];

        // Printing line wisth space
        for (var i = 0; i <= w; i++) {
            blank += " ";
        }

        // Printing white-spaces and clear global array
        for (i = 0; i <= h; i++) {
            this._printOnCanvas(blank, x, y + i, this.$data.defaultColours.text.fg, this.$data.defaultColours.text.bg);
            for (var j = 0; j <= w; j++) {
                screenCharacterArray[y + i][x + j] = charArray;
            }
        }
    };

    //Actions.prototype.constructor = Actions;

    // Publish in global
    if (typeof global.exports !== 'undefined') {
        global.exports.userActions = new Actions();
    } else {
        global.userActions = new Actions();
    }

})(this);