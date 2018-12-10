/**
 * Created by Alexandr on 02.07.2015.
 */
"use strict";
(function(global) {

    // Shorthands
    var events = global.eventsHandler;
    var actions = global.userActions;
    var parser = global.tagParser;

    var $data;

    var inputsStr = "input, textarea, select";

    // After data was drawn
    $(global).bind("drawn", function() {

        // Hotkeys for new area
        $(document).on("keypress", function (e) {

            if (48 <= e.which && e.which <= 57) {
                selectColorSettings(e.which - 48);
                return;
            }

            if (!e.shiftKey) {
                return;
            }

            switch (e.which) {

                // Shift + plus
                case 43:
                    addArea();
                    break;

                // Shift + minus
                case 95:
                    deleteArea();
                    break;
            }


        });

        // Parsed data
        $data = actions.getObj();

        // Main menu
        var $mainmenu = $data.find("#main-menu");

        // Index of selected input in main menu
        var selectedMainMenu = 1;

        var confirmId = null;

        var hexcoloursObj = parser.getHexColors();

        var hexColorsArr = [];

        for (var color in hexcoloursObj) if (hexcoloursObj.hasOwnProperty(color)) {
            hexColorsArr.push(color);
        }

        // Show submenu
        $data.on("click", "input[type=button]", function () {
            var $this = $(this);
            setTimeout(function () {
                $this.focus();
            }, 20);
        });

        // Store index of selected input in main menu
        $mainmenu.find("input").on("select", function () {
            selectedMainMenu = $(this).index();
        });

        // Show submenu
        $mainmenu.on("down pressed-enter up", "input", function (e) {

            e.preventDefault();
            e.stopPropagation();

            if (e.type === "up") {
                return;
            }

            var $this = $(this);

            var num = $this.data("sub");

            if (num) {

                hideAll();

                setTimeout(function () {
                    $data.find("#sub-menu-" + num)
                        .showHidden()
                        .find("input")
                        .first()
                        .focus();
                }, 20);
            }
        });

        // Close submenu
        $data.on("pressed-esc up", "div.sub-menu input", function (e) {

            var $this = $(this);

            if (e.type === "up" && $this.parent().index() !== 0) {
                return;
            }

            e.preventDefault();

            setTimeout(function () {
                actions.deselectElement();
            }, 40);

            setTimeout(function () {
                hideAll();
                var num = $this.closest("div").attr("id").substr(-1);
                $mainmenu.find("[data-sub=" + num + "]").focus();
            }, 60);

        });

        // For all elements with attr alt onselect place text from alt to first line
        $data.find("[alt]").on("select", function() {
            var $this = $(this);
            setTimeout(function () {
                $data.find("#info-line").setVal($this.attr("alt"));
            }, 40);
        });

        // Deselct event
        $(global).on("deselect", function() {
            // Clear info line (on top)
            setTimeout(function () {
                $data.find("#info-line").setVal("");
            }, 20);


        });

        // return to main menu on ESC
        $(global).on("pressed-esc", returnToMainMenu);

        // Show window with settings
        $data.on("click", "input[data-id]", function () {

            var $this = $(this);

            var id = $this.data("id");

            var $settings = $data.find("#" + id);

            actions.deselectElement();

            setTimeout(function () {
                actions.deselectElement();
                $data.find(".sub-menu").hideHidden();
                $settings.showHidden();
            }, 20);

            setTimeout(function () {
                $settings.find(inputsStr).first().focus();
            }, 40);

        });

        // Selecting elements inside Settings windows
        $data.find("div.settings").on("select", inputsStr, function (e) {
            var $this = $(this);

            if ($this.attr("type") == "button") {
                return;
            }

            $this.closest("div.settings").find(inputsStr).restoreColor();
            $this.setFgBg("yellow", "blue");

            e.preventDefault();
            e.stopPropagation();

        });

        // Close all windows and select main menu button
        $data.find("div.settings").on("pressed-esc", inputsStr, returnToMainMenu);

        // Message Area cursor navigation
        $data.find("#message-areas").on("next prev", inputsStr, function (e, data) {

            var $this = $(this);

            // All li elements
            var $li = $this.closest("ul").find("li");

            // current index of li
            var index = $this.closest("li").index();

            // side
            var side = data.side || "down";

            if (side === "down" && index === 12) {
                $li.eq(13).find(inputsStr).eq(2).focus();
                e.preventDefault();
                return;
            }

            if (1 <= index && index <= 12) {

                if (side === "up" || side === "down") {
                    return;
                }

                if (index > 6) {

                    if (side === "right") {
                        e.preventDefault();
                        return;
                    }

                    index -= 6;
                } else {

                    if (side === "left") {
                        e.preventDefault();
                        return;
                    }

                    index += 6;
                }


                $li.eq(index).find(inputsStr).first().focus();

                e.preventDefault();
                return;
            }

            if (index === 13 && side === "up") {
                $li.eq(12).find(inputsStr).eq(0).focus();
                e.preventDefault();
                return;
            }

            if (index === 18 && side === "up") {
                $li.eq(17).find(inputsStr).eq(0).focus();
                e.preventDefault();
                return;
            }

            if (index === 17 && side === "down") {
                $li.eq(18).find(inputsStr).eq(0).focus();
                e.preventDefault();
            }

        });

        // Global Options cursor navigation (roundtrip)
        $data.find("#mail-global-options").on("next prev", inputsStr, function (e, data) {

            var $this = $(this);

            // All li elements
            var $li = $this.closest("ul").find("li");

            // current index of li
            var index = $this.closest("li").index();

            // side
            var side = data.side || "down";

            if (index === 0 && side === "up") {
                $li.eq(10).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (0 <= index && index <= 4 && side === "right") {
                $li.eq(index + 5).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (5 <= index && index <= 9 && side === "left") {
                $li.eq(index - 5).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 10 && side === "down") {
                $li.eq(0).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 4 && side === "down") {
                $li.eq(5).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 5 && side === "up") {
                $li.eq(4).find(inputsStr).first().focus();
                e.preventDefault();
            }

        });

        // Global filearea options navigation
        $data.find("#file-global-options").on("next prev", inputsStr, function (e, data) {

            var $this = $(this);

            // All li elements
            var $li = $this.closest("ul").find("li");

            // current index of li
            var index = $this.closest("li").index();

            // side
            var side = data.side || "down";

            if (index === 0 && side === "up") {
                $li.eq(12).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (0 <= index && index <= 5 && side === "right") {
                $li.eq(index + 7).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (7 <= index && index <= 12 && side === "left") {
                $li.eq(index - 7).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 12 && side === "down") {
                $li.eq(0).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 6 && side === "down") {
                $li.eq(7).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 7 && side === "up") {
                $li.eq(6).find(inputsStr).first().focus();
                e.preventDefault();
            }

        });

        // New user options navigation
        $data.find("#new-users").on("next prev", inputsStr, function (e, data) {

            var $this = $(this);

            // All li elements
            var $li = $this.closest("ul").find("li");

            // current index of li
            var index = $this.closest("li").index();

            // side
            var side = data.side || "down";

            if (index === 4 && side === "down") {
                $li.eq(5).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 5 && side === "up") {
                $li.eq(4).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (5 <= index && index <= 13 && side === "right") {
                $li.eq(index + 10).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (15 <= index && index <= 23 && side === "left") {
                $li.eq(index - 10).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 23 && side === "down") {
                $li.eq(0).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 14 && side === "down") {
                $li.eq(15).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 15 && side === "up") {
                $li.eq(14).find(inputsStr).first().focus();
                e.preventDefault();
            }

        });

        // General options navigation
        $data.find("#other-general-options").on("next prev", inputsStr, function (e, data) {

            var $this = $(this);

            // All li elements
            var $li = $this.closest("ul").find("li");

            // current index of li
            var index = $this.closest("li").index();

            // side
            var side = data.side || "down";

            if (index === 0 && side === "up") {
                $li.eq(15).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (0 <= index && index <= 6 && side === "right") {
                $li.eq(index + 7).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (7 <= index && index <= 13 && side === "left") {
                $li.eq(index - 7).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 15 && side === "down") {
                $li.eq(0).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 14 && side === "down") {
                $li.eq(7).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 7 && side === "up") {
                $li.eq(14).find(inputsStr).first().focus();
                e.preventDefault();
            }

        });

        // On/off options cursor navigation (roundtrip)
        $data.find("#on-off-options").on("next prev", inputsStr, function (e, data) {

            var $this = $(this);

            // All li elements
            var $li = $this.closest("ul").find("li");

            // current index of li
            var index = $this.closest("li").index();

            // side
            var side = data.side || "down";

            if (index === 0 && side === "up") {
                $li.eq(11).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (0 <= index && index <= 5 && side === "right") {
                $li.eq(index + 6).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (6 <= index && index <= 11 && side === "left") {
                $li.eq(index - 6).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 11 && side === "down") {
                $li.eq(0).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 5 && side === "down") {
                $li.eq(6).find(inputsStr).first().focus();
                e.preventDefault();
                return;
            }

            if (index === 6 && side === "up") {
                $li.eq(5).find(inputsStr).first().focus();
                e.preventDefault();
            }

        });

        // Press esc in file area settings window
        $data.on("pressed-esc", "div.new-area-settings " + inputsStr, function (e) {

            e.stopPropagation();

            // Save id of opened window
            confirmId = $(this).closest("div").attr("id");

            var $confirm = $("#confirm-save");

            // show confirm window
            $confirm.showHidden();

            setTimeout(function () {
                $confirm.find(inputsStr).first().focus();
            }, 20);

        });

        // Click on confirm buttons
        $data.find("#confirm-save").on("click", inputsStr, function (e) {
            e.stopPropagation();

            // if nothing to confirm
            if (confirmId === null) {
                return;
            }

            // Settings window
            var $settings = $data.find("#" + confirmId);

            actions.deselectElement();

            // hide confirm window
            $(this).closest("div").hideHidden();

            // hide window
            $settings.hideHidden();

            // set focus to prev menu
            setTimeout(function () {
                $data.find("[data-id=" + confirmId + "]").focus();
                confirmId = null;
            }, 20);
        });

        // ESC on confirm buttons
        $data.find("#confirm-save").on("pressed-esc", inputsStr, function (e) {
            e.stopPropagation();

            // if nothing to confirm
            if (confirmId === null) {
                return;
            }

            var $settings = $data.find("#" + confirmId);

            confirmId = null;

            actions.deselectElement();

            // hide confirm window
            $(this).closest("div").hideHidden();

            // set focus to prev menu
            setTimeout(function () {
                $settings.find(inputsStr).first().focus();
            }, 20);
        });

        $data.find("div.color-settings").on("select", "input[type=button]", function () {

            var $this = $(this);

            setTimeout(function () {
                var data = $this.get(0).asciiData;
                $this.setFgBg($this.data("color"), "black");
                events.setCursor({x: data.x, y: data.y});
                data.fgBak = data.fg;
                data.bgBak = data.bg;
            }, 20);

        });

        $data.find("div.color-settings").on("next prev", "input[type=button]", function (e, data) {
            e.preventDefault();

            var $this = $(this);
            var asciiData = $this.get(0).asciiData;
            events.setCursor({x: asciiData.x, y: asciiData.y});

            var side = data.side || "down";

            if (side === "down" || side === "up") {
                return;
            }

            var index = hexColorsArr.indexOf($this.data("color"));

            if (side === "left") {
                index++;
                index = index === hexColorsArr.length ? 0 : index;
            } else if (side === "right") {
                index--;
                index = index < 0 ? hexColorsArr.length - 1 : index;
            }

            var color = hexColorsArr[index];

            $this.data("color", color);

            $this.setFg(color);

            asciiData.fgBak = asciiData.fg;
            asciiData.bgBak = asciiData.bg;

        });

        function selectColorSettings(num) {

            var $selected = $(actions.selected);

            // if wrong menu, prevent adding new area
            if (!$selected.closest("div").hasClass("color-settings")) {
                return;
            }

            var $inputs = $selected.closest("div").find("input[type=button]");

            $inputs.eq(num).focus();
        }

        // Hide all sub-menu and settings windows
        function hideAll() {
            $data.find(".settings, .sub-menu").hideHidden();
        }

        // Hides everything except main menu and selects last selected input in main menu
        function returnToMainMenu(e) {

            e.stopPropagation();

            actions.deselectElement();

            setTimeout(function () {
                hideAll();
            }, 20);

            setTimeout(function () {
                $mainmenu.children().eq(selectedMainMenu).focus();
            }, 40);
        }

        // Add Area to Areas list
        function addArea() {

            // if wrong menu, prevent adding new area
            if (!$(actions.selected).hasClass("new-area")) {
                return;
            }

            // First element is example
            var $li = $data.find("#file-areas").find("li");

            // Copy example
            var $area = $li.first().clone();

            // Setting name
            var name = "new-area" + $li.length;

            // Create new area settings window
            $data.find("#new-area").clone().attr("id", name).appendTo($data).reparse();

            // set attr
            $area.find("input").attr({
                "data-id": name,
                name: name,
                value: "New Area " + $li.length
            });

            // Attaching to second place
            $li.first().after($area);

            // Parent of added element
            $data.find("#file-areas").find("ul").reparse().redraw();

            setTimeout(function () {
                $data.find("#file-areas").find(inputsStr).first().focus();
            }, 20);
        }

        // Delete area
        function deleteArea() {

            var $selected = $(actions.selected);

            // if wrong menu, prevent adding new area
            if (!$selected.hasClass("new-area")) {
                return;
            }

            // Remove settings window
            var id = $selected.data("id");
            $data.find("div#" + id).remove();

            // parent ul
            var $ul = $selected.closest("ul");

            // remove all li (row with input)
            $selected.closest("li").remove();

            // Getting ul dimensions, all inside div
            var data = $ul.closest("div").getData().border;

            // deselect
            actions.deselectElement();

            // clearing whole ul area
            actions.clearRect(data.x + 1, data.y + 1, data.width - 2, data.height - 2);

            // reparsing and redrawing
            $ul.reparse().redraw();

            // Set focus to first menu in areas list
            setTimeout(function () {
                $data.find("#file-areas").find(inputsStr).first().focus();
            }, 20);
        }
    });

})(this);