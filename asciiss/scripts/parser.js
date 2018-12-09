/**
 * Created by curtov.com on 30.05.2015.
 * @namespace printthat
 * @namespace exports
 * @namespace cursor
 */
"use strict";
(function(global) {

    var INPUT_WIDTH = 20;

    var hexcolours = {
        "aliceblue": "#f0f8ff",
        "antiquewhite": "#faebd7",
        "aqua": "#00ffff",
        "aquamarine": "#7fffd4",
        "azure": "#f0ffff",
        "beige": "#f5f5dc",
        "bisque": "#ffe4c4",
        "black": "#000000",
        "blanchedalmond": "#ffebcd",
        "blue": "#0000ff",
        "blueviolet": "#8a2be2",
        "brown": "#a52a2a",
        "burlywood": "#deb887",
        "cadetblue": "#5f9ea0",
        "chartreuse": "#7fff00",
        "chocolate": "#d2691e",
        "coral": "#ff7f50",
        "cornflowerblue": "#6495ed",
        "cornsilk": "#fff8dc",
        "crimson": "#dc143c",
        "cyan": "#00ffff",
        "darkblue": "#00008b",
        "darkcyan": "#008b8b",
        "darkgoldenrod": "#b8860b",
        "darkgray": "#a9a9a9",
        "darkgreen": "#006400",
        "darkkhaki": "#bdb76b",
        "darkmagenta": "#8b008b",
        "darkolivegreen": "#556b2f",
        "darkorange": "#ff8c00",
        "darkorchid": "#9932cc",
        "darkred": "#8b0000",
        "darksalmon": "#e9967a",
        "darkseagreen": "#8fbc8f",
        "darkslateblue": "#483d8b",
        "darkslategray": "#2f4f4f",
        "darkturquoise": "#00ced1",
        "darkviolet": "#9400d3",
        "deeppink": "#ff1493",
        "deepskyblue": "#00bfff",
        "dimgray": "#696969",
        "dodgerblue": "#1e90ff",
        "firebrick": "#b22222",
        "floralwhite": "#fffaf0",
        "forestgreen": "#228b22",
        "fuchsia": "#ff00ff",
        "gainsboro": "#dcdcdc",
        "ghostwhite": "#f8f8ff",
        "gold": "#ffd700",
        "goldenrod": "#daa520",
        "gray": "#808080",
        "green": "#008000",
        "greenyellow": "#adff2f",
        "honeydew": "#f0fff0",
        "hotpink": "#ff69b4",
        "indianred ": "#cd5c5c",
        "indigo": "#4b0082",
        "ivory": "#fffff0",
        "khaki": "#f0e68c",
        "lavender": "#e6e6fa",
        "lavenderblush": "#fff0f5",
        "lawngreen": "#7cfc00",
        "lemonchiffon": "#fffacd",
        "lightblue": "#add8e6",
        "lightcoral": "#f08080",
        "lightcyan": "#e0ffff",
        "lightgoldenrodyellow": "#fafad2",
        "lightgrey": "#d3d3d3",
        "lightgreen": "#90ee90",
        "lightpink": "#ffb6c1",
        "lightsalmon": "#ffa07a",
        "lightseagreen": "#20b2aa",
        "lightskyblue": "#87cefa",
        "lightslategray": "#778899",
        "lightsteelblue": "#b0c4de",
        "lightyellow": "#ffffe0",
        "lime": "#00ff00",
        "limegreen": "#32cd32",
        "linen": "#faf0e6",
        "magenta": "#ff00ff",
        "maroon": "#800000",
        "mediumaquamarine": "#66cdaa",
        "mediumblue": "#0000cd",
        "mediumorchid": "#ba55d3",
        "mediumpurple": "#9370d8",
        "mediumseagreen": "#3cb371",
        "mediumslateblue": "#7b68ee",
        "mediumspringgreen": "#00fa9a",
        "mediumturquoise": "#48d1cc",
        "mediumvioletred": "#c71585",
        "midnightblue": "#191970",
        "mintcream": "#f5fffa",
        "mistyrose": "#ffe4e1",
        "moccasin": "#ffe4b5",
        "navajowhite": "#ffdead",
        "navy": "#000080",
        "oldlace": "#fdf5e6",
        "olive": "#808000",
        "olivedrab": "#6b8e23",
        "orange": "#ffa500",
        "orangered": "#ff4500",
        "orchid": "#da70d6",
        "palegoldenrod": "#eee8aa",
        "palegreen": "#98fb98",
        "paleturquoise": "#afeeee",
        "palevioletred": "#d87093",
        "papayawhip": "#ffefd5",
        "peachpuff": "#ffdab9",
        "peru": "#cd853f",
        "pink": "#ffc0cb",
        "plum": "#dda0dd",
        "powderblue": "#b0e0e6",
        "purple": "#800080",
        "red": "#ff0000",
        "rosybrown": "#bc8f8f",
        "royalblue": "#4169e1",
        "saddlebrown": "#8b4513",
        "salmon": "#fa8072",
        "sandybrown": "#f4a460",
        "seagreen": "#2e8b57",
        "seashell": "#fff5ee",
        "sienna": "#a0522d",
        "silver": "#c0c0c0",
        "skyblue": "#87ceeb",
        "slateblue": "#6a5acd",
        "slategray": "#708090",
        "snow": "#fffafa",
        "springgreen": "#00ff7f",
        "steelblue": "#4682b4",
        "tan": "#d2b48c",
        "teal": "#008080",
        "thistle": "#d8bfd8",
        "tomato": "#ff6347",
        "turquoise": "#40e0d0",
        "violet": "#ee82ee",
        "wheat": "#f5deb3",
        "white": "#ffffff",
        "whitesmoke": "#f5f5f5",
        "yellow": "#ffff00",
        "yellowgreen": "#9acd32"
    };

    if (typeof global.jQuery === "undefined") {
        throw "need jQuery";
    }

    /**
     * Constructor
     * @constructor
     */
    var Parser = function() {
        this._init();
    };

    /**
     * Return parsed data
     * @returns {Array}
     */
    Parser.prototype.getAll = function() {
        return this.elements;
    };

    /**
     * Parser
     * @param container
     */
    Parser.prototype.parse = function(container) {
        var self = this;

        if (typeof this.defaultColours === "undefined") {
            this.setConfig({});
        }

        // Reset all data
        if (this.elements.length > 0) {
            this._init();
        }

        // Object or string
        if (container instanceof jQuery) {
            var $data = container;
        } else {

            // Create container
            $data = $("<div id=\"parsed-data\"></div>");

            // Add data in container
            $data.append($(container).text());
        }

        // default parent
        var el = {
            text: "",
            x: 0,
            y: 0,
            fg: self.defaultColours.text.fg,
            bg: self.defaultColours.text.bg,
            form: false,
            width: 0,
            offsetX: {},
            offsetY: 0,
            id: "body"
        };

        // Setting default parent to root element
        $data.get(0).asciiData = el;


        // parsing from parent to child
        $data.children().each(function() {

            // parsing childs
            self._parseElement(this, el);

        });

        // parsed data
        this.elements = $data;

        // adding color info
        this.elements.defaultColours = this.defaultColours;

        console.log(this.elements);
    };

    /**
     * Default settings
     * @param cfg
     */
    Parser.prototype.setConfig = function (cfg) {

        cfg.textFg = this.getRGBColor(cfg.textFg) || [255, 255, 255];
        cfg.textBg = this.getRGBColor(cfg.textBg) || [0, 0, 0];

        cfg.inputFg = this.getRGBColor(cfg.inputFg) || [255, 255, 0];
        cfg.inputBg = this.getRGBColor(cfg.inputBg) || [0, 0, 255];

        cfg.buttonFg = this.getRGBColor(cfg.buttonFg) || [255, 255, 255];
        cfg.buttonBg = this.getRGBColor(cfg.buttonBg) || [68, 68, 68];

        cfg.selectionBg = this.getRGBColor(cfg.selectionBg) || [32, 32, 32];

        cfg.hoveredBtnFg = this.getRGBColor(cfg.hoveredBtnFg) || [0, 0, 0];
        cfg.hoveredBtnBg = this.getRGBColor(cfg.hoveredBtnBg) || [255, 255, 0];

        this.defaultColours = {
            text: {
                fg: [this.getFgForANSI(cfg.textFg), this.getANSIColor(cfg.textFg)],
                bg: [this.getBgForANSI(cfg.textBg), this.getANSIColor(cfg.textBg)]
            },
            input: {
                fg: [this.getFgForANSI(cfg.inputFg), this.getANSIColor(cfg.inputFg)],
                bg: [this.getBgForANSI(cfg.inputBg), this.getANSIColor(cfg.inputBg)]
            },
            button: {
                fg: [this.getFgForANSI(cfg.buttonFg), this.getANSIColor(cfg.buttonFg)],
                bg: [this.getBgForANSI(cfg.buttonBg), this.getANSIColor(cfg.buttonBg)]
            },
            selection: {
                bg: [this.getBgForANSI(cfg.selectionBg), this.getANSIColor(cfg.selectionBg)]
            },
            hoveredBtn: {
                fg: [this.getFgForANSI(cfg.hoveredBtnFg), this.getANSIColor(cfg.hoveredBtnFg)],
                bg: [this.getBgForANSI(cfg.hoveredBtnBg), this.getANSIColor(cfg.hoveredBtnBg)]
            }
        };
    };

    /**
     * Reparsing element and all it children
     * @param $el
     * @param parent
     * @returns {*}
     */
    Parser.prototype.parseElement = function ($el, parent) {
        var self = this;

        // parsing from parent to child
        $el.each(function() {

            // parsing childs
            self._parseElement(this, parent);

        });

        return $el;
    };



    /**
     * Getting color for printing on canvas
     * @param colorArray
     * @returns {string}
     * @private
     */
    Parser.prototype.getBgForANSI = function(colorArray) {
        var bg = "48" + cursor.rgb(colorArray[0], colorArray[1], colorArray[2]).foreground.current.substring(2);
        return String.fromCharCode(27) + "[" + bg + "m";
    };

    /**
     * Getting color for printing on canvas
     * @param colorArray
     * @returns {string}
     * @private
     */
    Parser.prototype.getFgForANSI = function(colorArray) {
        var fg = global.cursor.rgb(colorArray[0], colorArray[1], colorArray[2]).foreground.current;
        return String.fromCharCode(27) + "[" + fg + "m";
    };

    /**
     * Parsing hex color into RGB array [255,255,255]
     * http://stackoverflow.com/questions/5623838
     */
    Parser.prototype.getRGBColor = function (hex) {

        if (!hex) {
            return false;
        }

        hex = hexcolours[hex] || hex;

        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : false;
    };

    /**
     * Getting ANSI color
     * @private
     */
    Parser.prototype.getANSIColor = function(colorArray) {

        var red     = Math.round(colorArray[0] / 255 * 5),
            green   = Math.round(colorArray[1] / 255 * 5),
            blue    = Math.round(colorArray[2] / 255 * 5);

        return 16 + (red * 36) + (green * 6) + blue;
    };

    /**
     * Return hexcolours object
     * @returns {{}}
     */
    Parser.prototype.getHexColors = function () {
        return hexcolours;
    };



    /**
     * Init Parse
     * @private
     */
    Parser.prototype._init = function() {
        this.elements = [];
        this.formId = 0;
    };

    /**
     * Recursively parsing childrens
     * @param el
     * @param parent
     */
    Parser.prototype._parseElement = function(el, parent) {
        var self = this;

        // jquery object
        var $el = $(el);

        // tag name
        var tag = $el.prop("tagName").toLowerCase();

        if (tag === "option") {
            return;
        }

        // Get style from attr
        this._getStyle($el);

        var element = {};

        // (helpers) offsets to calculate children position
        element.offsetX = {};
        element.offsetY = 0;

        // Text of element
        element.text = this._getText($el, tag);

        // Type of element
        element.type = this._getType($el, tag);

        // Position in canvas coordinates
        element.y = this._getY($el, parent, tag);

        // Calculating X offset and store it
        // For example <span>te</span><span>st</span>
        // For the first element we store width = 2px
        // and for second span we add 2px to x
        // And do it for every line of parent (element.y)
        if (typeof parent.offsetX[element.y] === "undefined") {
            parent.offsetX[element.y] = 0; // first element on line Y (setting offset = 0)
        }

        element.x = this._getX($el, parent, element.y);

        // Colours
        element.fg = this._getColor($el, tag, parent, "fg", element.type);
        element.bg = this._getColor($el, tag, parent, "bg", element.type);

        // Dimension
        element.width = this._getWidth($el, tag, element.text.length, element.type);
        element.height = this._getHeight($el, tag);

        parent.offsetX[element.y] += element.width; // current element moves next elements by own width

        // Form to submit
        element.form = (tag === "form") ? "form_" + this.formId++ : parent.form;
        element.name = $el.attr("name") || null;

        // Inline js code
        element.onsubmit = $el.attr("onsubmit") || false;
        element.action = $el.attr("action") || false;
        element.onclick = $el.attr("onclick") || false;

        // Check if has border
        element.border = this._getBorder($el, tag, element);

        // Visibility
        element.visible = this._getVisibility($el);

        // Can be clicked, changed value or else
        element.editable = this._getEditable(element.type);

        // Props for inputs
        if (element.editable) {
            element.textStart = 0;
            element.length = element.width * element.height;
        }

        // If element has border moving children
        if (element.border) {
            element.x++;
            element.y++;
        }

        element.id = $el.attr("id") || parent.id;

        // Range attribute
        element.range = this._getRange($el);

        this._clearElement(element, tag);

        // add parsed element
        el.asciiData = element;

        // parsing deeper
        $el.children().each(function() {
            self._parseElement(this, element);
        });

    };

    // Range attr
    Parser.prototype._getRange = function ($el) {

        var range = $el.attr("range");

        if (typeof range === "undefined") {
            return null;
        }

        var value = range.split("-");

        return {
            min: parseInt(value[0]),
            max: parseInt(value[1])
        };
    };

    /**
     * Some elements have props need to remove
     * @private
     */
    Parser.prototype._clearElement = function(element, tag) {

        // Block element
        if (tag === "div") {
            element.width = 0;
        }
    };

    /**
     * Visibility of element
     * @param $el
     * @returns {boolean}
     * @private
     */
    Parser.prototype._getVisibility = function($el) {

        if (typeof $el.style.display === "undefined") {
            return true;
        }

        return $el.style.display !== "none";
    };

    /**
     * Calculating props for render borders
     * @param $el
     * @param tag
     * @param element
     * @returns {*}
     * @private
     */
    Parser.prototype._getBorder = function($el, tag, element) {

        if (tag !== "div") {
            return null;
        }

        if (!$el.style.border || !$el.style.width || !$el.style.height) {
            return null;
        }

        var style = ($el.style.border === 2) ? 2 : 1;

        var color = this.getRGBColor($el.style["border-color"]);

        if (color) {
            color = [this.getFgForANSI(color), this.getANSIColor(color)];
        } else {
            color = this.defaultColours.text.fg;
        }

        return {
            style: style,
            fg: color,
            bg: this.defaultColours.text.bg,
            x: element.x,
            y: element.y,
            width: $el.style.width,
            height: $el.style.height
        };
    };

    /**
     * Height of element
     * @param $el
     * @param tag
     * @returns {*}
     * @private
     */
    Parser.prototype._getHeight = function($el, tag) {

        if (tag === "textarea") {
            return parseInt($el.attr("rows")) || 10;
        }

        return 1;
    };

    /**
     * Width of element
     * @param $el
     * @param textLength
     * @param tag
     * @returns {*}
     * @private
     * @param type
     */
    Parser.prototype._getWidth = function($el, tag, textLength, type) {

        if (tag === "textarea") {
            return parseInt($el.attr("cols")) || 20;
        }

        // width of checkbox or radio
        if (tag === "input" && ($el.attr("type") === "checkbox" || $el.attr("type") === "radio")) {
            return 1;
        }

        // width of input
        if (tag === "input" && type !== "button") {
            return parseInt($el.attr("width")) || INPUT_WIDTH;
        }

        // width of <select> element
        if (tag === "select") {

            // Check width from  attr
            var width = $el.attr("width");
            if (typeof width !== "undefined") {
                return parseInt(width)
            }

            // No width attr, set 0
            width = 0;

            // Get the largest text of options names
            $el.find("option").each(function() {

                var length = $(this).text().length;

                if (length > width) {
                    width = length;
                }

            });

            return width;
        }

        // width from attr or text length
        return $el.style.width || textLength;
    };

    /**
     * Type of element
     * render and user iteraction depends on type
     * @param $el
     * @param type
     * @returns {*}
     * @private
     */
    Parser.prototype._getType = function ($el, type) {

        if (["span", "li", "p"].indexOf(type) !== -1) {
            return "text";
        }

        if (type === "input" && ($el.attr("type") === "button" || $el.attr("type") === "submit")) {
            return "button";
        }

        if (type === "input" && $el.attr("type") === "checkbox") {
            return "checkbox";
        }

        if (type === "input" && $el.attr("type") === "radio") {
            return "radio";
        }

        if (type === "input" && $el.attr("type") === "flags") {
            return "flags";
        }

        return type;
    };

    /**
     * Text of element
     * @param $el
     * @param tag
     * @returns {string|*|string}
     * @private
     */
    Parser.prototype._getText = function($el, tag) {

        if (["span", "li"].indexOf(tag) !== -1) {
            var text = $el
                .contents()
                .filter(function() {
                    return this.nodeType === 3;
                })
                .text();

            if (text !== text.trim()) {
                text = text.trim() + " ";
            }

        } else if (["input", "textarea"].indexOf(tag) !== -1) {
            text = $el.val();
        }

        if (tag === "input" && ($el.attr("type") === "button" || $el.attr("type") === "submit")) {
            text = text || " Submit ";
        }

        if (tag === "input" && $el.attr("type") === "checkbox") {
            text = ($el.attr("checked")) ? String.fromCharCode(254) : String.fromCharCode(250);
        }

        if (tag === "input" && $el.attr("type") === "radio") {
            text = ($el.val() === "1") ? "X" : "-";
        }

        if (tag === "input" && $el.attr("type") === "flags") {
            var value = $el.val();
            text = "";
            for (var i = 0, length = value.length; i  < length; i++) {
                if (value[i] === "0") {
                    text += "-";
                } else {
                    text += "X";
                }
            }
        }

        if (tag === "select") {
            text = $el.find("option").eq(0).text();
        }

        return text || "";
    };

    /**
     * Get style attr
     * jQuery.css cannot be use,
     * because css get computed values of elements
     * and in common element need to be in DOM
     * @param $el
     * @private
     */
    Parser.prototype._getStyle = function($el) {

        $el.style = {};

        var style = $el.attr("style");

        if (typeof style === "undefined") {
            return;
        }

        // getting rules pairs
        style = style.split(";");

        // all rules
        for (var i = 0, length = style.length; i < length; i++) {

            // getting name and value of rule
            var rules = style[i].split(":");

            // empty string
            if (rules.length <= 1) {
                continue;
            }

            var propName = rules[0].trim();
            var propValue = rules[1].trim();

            if (["top", "left", "right", "bottom", "width", "height", "border"].indexOf(propName) !== -1) {

                // removing "px"
                if (propValue.indexOf("px") !== -1) {
                    propValue = propValue.replace("px", "")

                } else if (propValue.indexOf("%") !== -1) {

                    // removing "%"
                    propValue = propValue.replace("%", "");

                    // Calculating percent
                    if (propName === "top" || propName === "bottom" || propName === "height") {
                        propValue = Math.floor(propValue * height / 100);
                    } else if (propName === "left" || propName === "right" || propName === "width") {
                        propValue = Math.floor(propValue * width / 100);
                    }
                }

                propValue = parseInt(propValue);
            }

            $el.style[propName] = propValue;
        }


    };

    /**
     * Get color from element or from parent
     * @param $el
     * @param tag
     * @param type
     * @param parent
     * @returns {*}
     * @private
     * @param elType
     */
    Parser.prototype._getColor = function($el, tag, parent, type, elType) {

        var colorArray;

        // Foreground color
        if (type === "fg") {

            // Defaults color for elements
            if (["input", "textarea", "select"].indexOf(tag) !== -1 && elType !== "button") {
                return this.defaultColours.input.fg;
            }

            // if color is in style
            if ($el.style.color) {
                colorArray = this.getRGBColor($el.style.color);

                if (!colorArray) {
                    return this.defaultColours.text.fg;
                }

                return [this.getFgForANSI(colorArray), this.getANSIColor(colorArray)];
            }

            // By default inherit from parent
            return parent.fg;

        }

        // Background color
        if (type === "bg") {

            // Button has default
            if (elType === "button") {
                return this.defaultColours.button.bg;
            }

            if (tag === "input" && ["checkbox", "radio", "flags"].indexOf($el.attr("type")) !== -1) {
                return this.defaultColours.text.bg;
            }

            if (["input", "textarea", "select"].indexOf(tag) !== -1) {
                return this.defaultColours.input.bg;
            }

            // Color from style
            if ($el.style["background-color"]) {
                colorArray = this.getRGBColor($el.style["background-color"]);
                if (!colorArray) {
                    return this.defaultColours.text.bg;
                }

                return [this.getBgForANSI(colorArray), this.getANSIColor(colorArray)];

            }
            // By default inherit from parent
            return parent.bg;
        }

    };

    /**
     * Getting X coord from element, if element doesn`t - from parent (recursively)
     * if parent "body" - default 0
     * @param $el
     * @returns {number}
     * @private
     * @param parent
     * @param y
     */
    Parser.prototype._getX = function($el, parent, y) {

        var x = parent.x + parent.width + parent.offsetX[y];

        if ($el.style.position === "relative") {
            if ($el.style.left) {
                return x + $el.style.left;
            }
        } else { //absolute
            if ($el.style.left) {
                return $el.style.left;
            }

            if ($el.style.right) {
                return global.width - $el.style.right;
            }
        }

        return x;

    };

    /**
     * Getting Y coord from element, if element doesn`t - from parent (recursively)
     * if parent "body" - default 0
     * @param $el
     * @returns {number}
     * @private
     * @param parent
     * @param tag
     */
    Parser.prototype._getY = function($el, parent, tag) {
        var height = global.height;

        if ($el.style.position === "relative") {
            if ($el.style.top) {
                parent.offsetY += $el.style.top;
            }
        } else { //absolute
            if ($el.style.top) {
                return $el.style.top;
            }

            if ($el.style.bottom) {
                return height - $el.style.bottom;
            }
        }

        if (tag === "li" || tag === "p") {
            if (typeof parent.offsetX[parent.y] !== "undefined") {
                parent.offsetY++;
            }
        }

        return parent.y + parent.offsetY;
    };

    /**
     * If Element editable (can be clicked or modify)
     * @param type
     * @returns {boolean}
     * @private
     */
    Parser.prototype._getEditable = function (type) {
        return ["input", "textarea", "checkbox", "radio", "flags", "button", "select"].indexOf(type) !== -1;
    };

    // Set constructor
    Parser.prototype.constructor = Parser;

    // Publish in global
    if (typeof global.exports !== 'undefined') {
        global.exports.tagParser = new Parser();
    }  else {
        global.tagParser = new Parser();
    }


})(this);