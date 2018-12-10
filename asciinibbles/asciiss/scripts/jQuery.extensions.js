/**
 * Created by kypto on 09.08.2015.
 */
//**** jQuery extension *****//

jQuery.fn.getVal = function () {
    return this[0].asciiData.text;
};

jQuery.fn.setVal = function (value) {
    userActions.setText(this, value);
    return this;
};

jQuery.fn.showHidden = function () {

    if (this.length === 0) {
        //console.warn("$.showHidden() - no elements");
        return this;
    }

    if (!this[0].asciiData.visible) {
        this[0].asciiData.visible = true;
        userActions.setPopup(this[0]);
        userActions.redrawElement(this[0]);
    }

    return this;
};

jQuery.fn.hideHidden = function () {

    if (this.length === 0) {
        //console.warn("$.showHidden() - no elements");
        return this;
    }

    return this.each(function () {

        var data = this.asciiData;

        if (data.visible) {
            data.visible = false;
            if (data.border) {
                data = data.border;
            }
            userActions.clearRect(data.x, data.y, data.width, data.height);
            userActions.setPopup(null);
            userActions.deselectElement();
            userActions.redrawElement("all");

        }
    });
};

jQuery.fn.focus = function() {
    if (this.length === 0) {
        return this;
    }
    eventsHandler.setCursor(userActions.selectElement(this[0]));
    return this;
};

jQuery.fn.deselect = function() {
    userActions.deselectElement();
    return this;
};

jQuery.fn.setFgBg = function (fg, bg) {
    // Element
    var data =  this.getData();

    var needToRedraw = false;

    if (fg) {

        // Store prev bg color
        data.fgBak = data.fg;

        // Get color array
        fg = tagParser.getRGBColor(fg);

        // Set ANSI colors
        data.fg = [tagParser.getFgForANSI(fg), tagParser.getANSIColor(fg)];

        needToRedraw = true;
    }

    if (bg) {

        // Store prev bg color
        data.bgBak = data.bg;

        // Get color array
        bg = tagParser.getRGBColor(bg);

        // Set ANSI colors
        data.bg = [tagParser.getBgForANSI(bg), tagParser.getANSIColor(bg)];

        needToRedraw = true;
    }

    // Redraw element
    if (needToRedraw) {
        userActions.redrawElement(this[0]);
    }

    return this;
};

jQuery.fn.setBg = function(color) {

    // Element
    var data =  this.getData();

    // Store prev bg color
    if (!data.bgBak) {
        data.bgBak = data.bg;
    }

    // Get color array
    color = tagParser.getRGBColor(color);

    // Set ANSI colors
    data.bg = [tagParser.getBgForANSI(color), tagParser.getANSIColor(color)];

    // Redraw element
    userActions.redrawElement(this[0]);

    return this;
};

jQuery.fn.setFg = function(color) {

    // Element
    var data =  this[0].asciiData;

    // Store prev bg color
    if (!data.fgBak) {
        data.fgBak = data.fg;
    }

    // Get color array
    color = tagParser.getRGBColor(color);

    // Set ANSI colors
    data.fg = [tagParser.getFgForANSI(color), tagParser.getANSIColor(color)];

    // Redraw element
    userActions.redrawElement(this[0]);

    return this;
};

jQuery.fn.restoreColor = function() {

    if (this.length === 0) {
        //console.warn("$.showHidden() - no elements");
        return this;
    }

    return this.each(function () {

        var data = this.asciiData;

        var needToRedraw = false;

        if (data.fgBak) {
            data.fg = data.fgBak;
            needToRedraw = true;
        }

        if (data.bgBak) {
            data.bg = data.bgBak;
            needToRedraw = true;
        }

        if (needToRedraw) {
            userActions.redrawElement(this);
        }
    });
};

jQuery.fn.reparse = function () {

    // reparsing first element
    var $el = this.first();

    // Parent of parent
    var parent = $el.parent().getData();

    // Reparsing parent of added element
    tagParser.parseElement($el, parent);

    return this;
};

jQuery.fn.redraw = function () {
    // redrawing each element
    return this.each(function () {
        userActions.redrawElement(this);
    });
};

jQuery.fn.getData = function () {
    return this[0].asciiData;
};