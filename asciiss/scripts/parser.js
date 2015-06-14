/**
 * Created by curtov.com on 30.05.2015.
 * @namespace printthat
 * @namespace exports
 */
"use strict";
(function(global) {

    var INPUT_WIDTH = 20;

    var defaultColors = {
        text: {
            fg : [255,255,255],
            bg : [0,0,0]
        },
        input: {
            fg : [255,255,0],
            bg : [0,0,255]
        },
        button: {
            fg : [255,255,255],
            bg : [68,68,68]
        }
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

        // Reset all data
        if (this.elements.length > 0) {
            this._init();
        }

        // Create container
        var $data = $("<div></div>");

        // Add data in container
        $data.append($($(container).text()));

        // parsing from parent to child
        $data.children().each(function() {

            // default parent
            var el = {
                text: "",
                x: 0,
                y: 0,
                fg: defaultColors.text.fg,
                bg: defaultColors.text.bg,
                form: false
            };

            // parsing childs
            self._parseElement(this, el);

        });

        console.log(this.elements);
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
        var type = $el.prop("tagName").toLowerCase();

        // extracting text
        if (type === "span") {
            type = "text";
            var text = $el
                .contents()
                .filter(function() {
                    return this.nodeType === 3;
                })
                .text()
                .trim();
        } else if (type === "input" || type === "textarea") {
            text = $el.val();
            if ($el.attr("type") === "button") {
                type = "button";
            }
        }

        // <form> doesn`t have text
        text = text || "";

        // creating element
        var element = {
            type: type,
            text: text,
            x: self._getCoord($el, "x", parent),
            y: self._getCoord($el, "y", parent),
            fg: self._getColor($el, "fg", parent),
            bg: self._getColor($el, "bg", parent)
        };

        // form data
        if (type === "form") {
            element.form = "form_" + this.formId++;
            element.onsubmit = $el.attr("onsubmit");
            element.action = $el.attr("action");
        } else {
            element.form = parent.form;
        }

        // Width and height of textarea
        if (type === "textarea") {
            element.width = parseInt($el.attr("cols")) || 20;
            element.height = parseInt($el.attr("rows")) || 10;
        }

        // width and height of input
        if (type === "input") {
            element.width = parseInt($el.attr("width")) || INPUT_WIDTH;
            element.height = 1;
        }

        // name attr and colors
        if (type === "input" || type === "textarea") {
            element.name = $el.attr("name") || false;
            element.fg = defaultColors.input.fg;
            element.bg = defaultColors.input.bg
        }

        // button props
        if (type === "button") {
            element.onclick = $el.attr("onclick") || "";
            element.text = element.text || " Submit ";
            element.bg = defaultColors.button.bg;
            element.width = element.text.length;
            element.height = 1;
        }

        // prevent store data in closure (memory leaking)
        type = null;
        text = null;
        parent = null;

        // add parsed element
        this.elements.push(element);

        // parsing deeper
        $el.children().each(function() {
            self._parseElement(this, element);
        });

    };

    /**
     * Get color from element or from parent
     * @param $el
     * @param type
     * @param parent
     * @returns {*}
     * @private
     */
    Parser.prototype._getColor = function($el, type, parent) {

        var color = $el.data(type);

        // element has color
        if (typeof color !== "undefined") {
            return this._getRGBColor(color) || defaultColors.text[type];
        }

        // color from parent
        return parent[type];

    };

    /**
     * Getting coord from element, if element doesn`t - from parent (recursively)
     * if parent "body" - default 0
     * @param $el
     * @param axis
     * @returns {*}
     * @private
     * @param parent
     */
    Parser.prototype._getCoord = function($el, axis, parent) {

        // Check element
        var value = $el.data(axis);

        // Element has value
        if (typeof value !== "undefined") {
            return value;
        }

        // get parent position
        if (axis === "x") {
            return parent.x + parent.text.length; // Parent have text and his child need to move on position after text
        } else {
            return parent.y;
        }
    };

    /**
     * Recursivelly search bg color in parents
     */
    Parser.prototype._getBackgroundColor = function ($element) {

        if ($element === $("body")) {
            return $element.css("background-color")
        }

        if ($element.css("background-color") !== "rgba(0, 0, 0, 0)") {
            return $element.css("background-color")
        }

        return this._getBackgroundColor($element.parent());
    };

    /**
     * Parsing hex color into RGB array [255,255,255]
     * http://stackoverflow.com/questions/5623838
     */
    Parser.prototype._getRGBColor = function (hex) {

        if (!hex) {
            return false;
        }

        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : false;
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