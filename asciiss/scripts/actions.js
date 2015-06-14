/**
 * Created by curtov.com on 14.06.2015.
 */
"use strict";
(function (global) {

    /**
     * Actions
     * Calling in index.html after parsing tags
     * @constructor
     */
    var Actions = function() {
        this.inputs = [];
        this.buttons = [];
        this.selected = 0;

        this._cursorX = 0;
        this._cursorY = 0;

        this.forms = {};
    };

    /**
     * Take all parsed data and draw first time
     * @param elements
     */
    Actions.prototype.init = function(elements) {

        for (var i = 0, length = elements.length; i < length; i++) {

            this._addElement(elements[i]);

            this._render(elements[i]);
        }
    };

    /**
     * Selecting current element
     * @returns {{x: number, y: number}}
     */
    Actions.prototype.selectInput = function(param) {

        if (typeof this.inputs[this.selected] === "undefined") {
            return this.cursor();
        }

        param = param || 0;

        if (param === "next") {
            this.selected++;
            if (this.selected >= this.inputs.length) {
                this.selected = 0
            }
        }

        if (param === "prev") {
            this.selected--;
            if (this.selected <= 0) {
                this.selected = this.inputs.length - 1;
            }
        }

        this._selectInput();

        return this._getCursor();
    };

    /**
     * Check element on coords and make it selected
     * @param x
     * @param y
     * @returns {*}
     */
    Actions.prototype.clickOnElement = function(x, y) {

        // all elements
        for (var i = 0, length = this.buttons.length; i < length; i++) {
            var el = this.buttons[i];

            // if element under x,y
            if (el.type === "button" && this._contains(el, x, y)) {

                // fire onclick or empty string
                eval(el.onclick);

                // If button inside form and onclick without preventDefault - trigger form
                if (el.form && el.onclick.indexOf("preventDefault") === -1) {
                    this._submitForm(el.form);
                }
                return false;
            }
        }

        // all elements
        for (i = 0, length = this.inputs.length; i < length; i++) {

            el = this.inputs[i];

            if (this._contains(el, x, y)) {
                this.selected = i;
                this._selectInput(x, y);
                return this._getCursor();
            }
        }

        return false;

    };

    /**
     * Add text to element
     * @param text
     * @returns {*}
     */
    Actions.prototype.addText = function(text) {

        var el = this.inputs[this.selected];

        // Position in text relative to cursor
        var textPos = this._getTextPos(el);

        // Inserting text on position
        el.text = [el.text.slice(0, textPos), text, el.text.slice(textPos)].join('');

        // if the text is bigger than input
        var offset = textPos + text.length - el.length;

        // text starts from offfset - all string move left
        if (offset >= 0) {
            el.textStart = offset + 1;
        }

        // position of cursor
        var x = this._cursorX + text.length;
        var y = this._cursorY;

        // if added text bigger than input
        if (x - el.x >= el.width) {
            var lines = Math.ceil((x + 1 - el.x) / el.width);
            if (lines > el.height) {
                x = el.x + el.width - 1;
                y = el.y + el.height - 1;
            } else {
                y++;
                x = el.x + text.length % el.width - 1;
            }
        }

        // cursor position on screen
        this._cursorX = x;
        this._cursorY = y;

        this._render(el);

        return this._getCursor();
    };

    /**
     * Moving cursor inside element
     * @param side
     * @returns {{x: number, y: number}}
     */
    Actions.prototype.move = function(side) {

        var el = this.inputs[this.selected];

        // current position
        var x = this._cursorX;
        var y = this._cursorY;

        // current text offset
        var textStart = el.textStart;

        switch(side) {
            case "up":

                // first line
                if (y === el.y) {

                    // text visuble from beginning - nothing to up
                    if (textStart === 0) {
                        break;
                    }

                    // curdor on the first letter - move text up one line
                    if (x === el.x) {
                        textStart = Math.max(0, textStart - el.width);
                    }
                    break;
                }

                // simple moving up
                y--;
                break;

            case "down":

                // last line
                if (y === el.y + el.height - 1) {

                    // end of text is visible
                    if (el.text.length - textStart <= el.length) {
                        break;
                    }

                    // cursor in the right down corner, trying to move text
                    if (x === el.x + el.width - 1) {
                        textStart = Math.min(el.text.length - el.length, textStart + el.width);
                    }
                    break;
                }

                // simple moving cursor
                y++;
                break;

            case "right":

                // simple moving right
                if (x < el.x + el.width - 1) {
                    x++;
                    break;
                }

                // end of line
                var EOL = (x === el.x + el.width - 1);

                // last line
                var lastLine = (y === el.y + el.height - 1);

                // moving to the begining of next line
                if (EOL && !lastLine) {
                    x = el.x;
                    y++;
                    break;
                }

                // moving text
                if (EOL && lastLine && el.text.length - textStart > el.length) {
                    textStart++;
                    break;
                }

                break;

            case "left":

                // simple moving left
                if (x > el.x) {
                    x--;
                    break;
                }

                // up one line
                if (x === el.x && y > el.y) {
                    x = el.x + el.width - 1;
                    y--;
                    break;
                }

                // moving text
                if (x === el.x && textStart > 0) {
                    textStart--;
                    break;
                }

                break;
        }

        if (textStart !== el.textStart) {
            el.textStart = textStart;
            this._render(el);
        }

        this._selectInput(x, y);

        // calculate position
        return this._getCursor();

    };

    /**
     * Delete one symbol before cursor
     * @returns {{x: number, y: number} || boolean}
     */
    Actions.prototype.backspace = function() {

        var el = this.inputs[this.selected];

        // Position in text relative to cursor
        var textPos = this._getTextPos(el);

        // nothing to delete
        if (textPos === 0) {
            return false;
        }

        // remove one symbol
        el.text = [el.text.slice(0, textPos - 1), el.text.slice(textPos)].join('');

        // if text was bigger than element
        if (el.textStart > 0 && el.text < el.length) {
            el.textStart--;
        }

        // cursor position
        if (this._cursorX - 1 < el.x) {
            this._cursorX = el.x + el.width - 1;
            this._cursorY--;
        } else {
            this._cursorX--;
        }

        this._render(el);

        return this._getCursor();
    };

    /**
     * Selecting text with Shift + arrows
     */
    Actions.prototype.addSelection = function() {
        // Первый раз фиксируем старт - текущий _getTextPos()
        // двигаем move()
        // фиксируем конец
        //
        // При выборе инпута добавить проверку если что то выбрано и снимать выбор, перерисовывая элеменет
        //
        // Рендер
        // Если есть выбор, то с указанных позиций менять цвет фона.

        var selection = {
            start: 0,
            end: 0,
            text: ""
        };
    };


    /**
     * Position in text relative to cursor
     * @param el
     * @returns {number}
     * @private
     */
    Actions.prototype._getTextPos = function(el) {

        // Position in text by cursor position
        return el.textStart + (this._cursorY - el.y) * el.width + (this._cursorX - el.x);
    };

    /**
     * Submiting form by formId
     * @param formId
     * @private
     */
    Actions.prototype._submitForm = function(formId) {

        if (typeof this.forms[formId] === "undefined") {
            console.log("unknown form id:" + formId);
            return;
        }

        var formData = {};

        for (var i = 0, length = this.inputs.length; i < length; i++) {

            var el = this.inputs[i];

            if (el.form && el.form === formId && el.name) {
                formData[el.name] = el._text;
            }
        }

        console.log("data from inputs", formData);

        if (this.forms[formId].onsubmit) {
            console.log("form has attr 'onsubmit' with function " + this.forms[formId].onsubmit);
            eval(this.forms[formId].onsubmit);
            return;
        }

        if (this.forms[formId].action) {
            console.log("send ajax to" + this.forms[formId].action + "with data", formData);

            // AJAX request
            $.ajax({
                url: this.forms[formId].action,
                method: 'post',
                dataType: 'json',
                data: formData,
                success: function (response) {
                    if (typeof(response.js)!="undefined") eval(response.js);
                },
                fail : function(response) {
                    alert("An error occured");
                    if (typeof(response.msg)!="undefined") alert(response.msg);
                }
            });
        } else {
            console.log("form doesnt have onsubmit or action attr");
        }
    };

    /**
     * Add element into the arrays
     * @param el
     * @private
     */
    Actions.prototype._addElement = function(el) {

        if (el.type === "input" || el.type === "textarea") {
            el.editable = true;
            el.textStart = 0;
            el.length = el.width * el.height;
            this.inputs.push(el);
            return;
        }

        el.editable = false;

        if (el.type === "form") {
            this.forms[el.form] = {
                onsubmit: el.onsubmit,
                action: el.action
            }
        }

        if (el.type === "button") {
            this.buttons.push(el);
        }
    };

    /**
     * Check if the element contains x and y
     * @param el
 * @param x
     * @param y
     * @returns {boolean}
     */
    Actions.prototype._contains = function(el, x, y) {

        if (y < el.y) {
            return false;
        }

        if (y >= el.y + el.height) {
            return false;
        }

        if (x < el.x)  {
            return false;
        }

        return x < el.x + el.width;


    };

    /**
     * Select element
     * @param {number} [x]
     * @param {number} [y]
     * @returns {Actions}
     */
    Actions.prototype._selectInput = function(x, y) {

        var el = this.inputs[this.selected];

        // default at the end of input
        x = x || el.x + el.width - 1;
        y = y || el.y + el.height - 1;

        // If text is bigger than input
        if (el.text.length >= el.length) {
            this._cursorY = y;
            this._cursorX = x;
            return this;
        }

        // y coord of last line of text
        var maxY = Math.ceil(el.text.length / el.width) + el.y - 1;

        // last position of char in last line
        var maxX = el.x + el.text.length % el.width;

        // all text is visible -> text starts from beginning
        el.textStart = 0;

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
     * Return cursor position
     * @returns {{x: number, y: number}}
     */
    Actions.prototype._getCursor = function() {
        return {
            x: this._cursorX,
            y: this._cursorY
        }
    };

    /**
     * Print element on screen
     * @private
     */
    Actions.prototype._render = function(el) {

        if (!el.editable) {
            printthat(el.text, el.x, el.y, el.fg, el.bg);
            return;
        }

        var text = el.text.substr(el.textStart, el.length);

        // print text to width * hight from start
        var x = 0,
            y = 0;
        for (var i = 0; i < el.length; i++) {
            var char = text[i] || " ";
            printthat(char, el.x + x, el.y + y, el.fg, el.bg);
            x++;
            if (x >= el.width) {
                x = 0;
                y++;
            }
        }
    };

    Actions.prototype.constructor = Actions;

    // Publish in global
    if (typeof global.exports !== 'undefined') {
        global.exports.userActions = new Actions();
    }  else {
        global.userActions = new Actions();
    }

})(this);