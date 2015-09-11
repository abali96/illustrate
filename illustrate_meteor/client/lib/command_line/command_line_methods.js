Meteor.logger = {
    log : function(data, type, broadcast) {
        Logs.insert({text: data, type: type, broadcast: broadcast});
    },
};

Meteor.commandLineMethods = {
    executeCommand : function(command) { // parse the command to do the desired action
        action_map = {
            "line": Meteor.commandLineMethods.setLineTool,
            "scribble": Meteor.commandLineMethods.setScribbleTool,
            "colour": Meteor.commandLineMethods.setColour,
            "width": Meteor.commandLineMethods.setStrokeWidth,
            "dash": Meteor.commandLineMethods.setStrokeDash,
            "end": Meteor.commandLineMethods.endLine,
            "debug": Meteor.commandLineMethods.debug,
            "close": Meteor.commandLineMethods.closeLine,
        };
        non_context_setting_actions = ["close", "colour", "width", "dash", "end"];
        possible_actions = [];
        command = command.toLowerCase().trim().split(' ');
        if (command[0] === '') {
            Logs.insert({text: Object.keys(action_map).join(", "), type: "All commands"});
            return;
        }
        for (var action in action_map) { // Find all those actions that the user's command could relate to
            if (action_map.hasOwnProperty(action) && action.startsWith(command[0])) {
                possible_actions.push(action);
            }
        }
        if (possible_actions.length === 0) {
            Logs.insert({text: command_line_value, type: "Unknown Command"});
        } else if (possible_actions.length == 1) {
            Logs.insert({text: command_line_value, type: "Command", resultant_command: possible_actions[0]});
            action_map[possible_actions[0]](command.slice(1)); // Pass in the parameters along with the value
            console.log(command);
            if (!_.contains(non_context_setting_actions, possible_actions[0])) {
                Session.set(CommandLineConstants.Context, possible_actions[0]);
            }
        } else {
            type_val = "Possible commands with given input: '" + command_line_value + "'";
            text_val = possible_actions.join(", ");
            Logs.insert({text: text_val, type: type_val});
        }
    },
    setLineTool : function() {
        line_tool = new paper.Tool();
        Session.set('start_new', true);
        line_tool.onMouseDown = function (event) {
            if (Session.get('start_new')) {
                Session.set('start_new', false);
                path = new paper.Path({style: Meteor.canvasMethods.collectStyleSettings()});
            }
            path.addPoint(Meteor.canvasMethods.calculatePoint(event, path));
            console.log(path._segments.length);
        };
        line_tool.onMouseMove = function (event) {
            if (!Session.get('start_new') && typeof path !== 'undefined') {
                if (path._segments.length > 1) {
                    path.removeSegment(path._segments.length - 1);
                    path.add(Meteor.canvasMethods.calculatePoint(event, path));
                } else if (path._segments.length == 1) {
                    path.add(Meteor.canvasMethods.calculatePoint(event, path));
                }
            }
        };
        line_tool.activate();
    },
    setScribbleTool : function() {
        scribble_tool = new paper.Tool();
        path = new paper.Path();
        scribble_tool.onMouseDown = function onMouseDown(event) {
            path = new paper.Path();
            path.style = Meteor.canvasMethods.collectStyleSettings();
            path.add(event.point);
        };
        scribble_tool.onMouseDrag = function(event) {
            path.add(event.point);
        };
        scribble_tool.onMouseUp = function(event) {
            Meteor.canvasMethods.savePath(path);
        };
        scribble_tool.activate();
    },
    endLine : function(close_break_signal) {
        // Will be implemented after context switching exists (you'd be able to tell which tool to reactivate.)
        if (!_.contains(path.clickPoints, path._segments[path._segments.length - 1].getPoint()) && !(close_break_signal === true)) { // used to filter out last point added due to mouse move
            console.log("deleting last point in end line");
            console.log(path.clickPoints);
            console.log(path._segments);
            path.removeSegment(path._segments.length - 1);
        }
        Meteor.canvasMethods.savePath(path);
        line_tool.remove();
        Meteor.commandLineMethods.setLineTool();
    },
    setColour : function(params) {
        if (params.length !== 1) {
            Logs.insert({text: "colour <colourname/hexcode including #/rgba(r, g, b, a)>", type: "Usage"});
        } else {
            Session.set(ToolModifierConstants.StrokeColour, params[0]);
        }
    },
    setStrokeWidth : function(params) {
        if (params.length !== 1 || isNaN(params[0])) {
            Logs.insert({text: "width <number>", type: "Usage"});
        } else {
            Session.set(ToolModifierConstants.StrokeWidth, Number(params[0]));
        }
    },
    setStrokeDash : function(params) {
        if (params.length !== 2 || isNaN(params[0]) || isNaN(params[1])) {
            Logs.insert({text: "dash <number> <number>", type: "Usage"});
        } else {
            Session.set(ToolModifierConstants.StrokeDashLength, Number(params[0]));
            Session.set(ToolModifierConstants.StrokeDashGap, Number(params[1]));
        }
    },
    closeLine : function(params) {
        var allowed_arr = ["line", "scribble"];
        if (!_.contains(path.clickPoints, path._segments[path._segments.length - 1])) { // used to filter out last point added due to mouse move
            path.removeSegment(path._segments.length - 1);
            console.log("deleting last point in close line");
        }
        if (_.contains(allowed_arr, Session.get(CommandLineConstants.Context))) {
            console.log('adding closing point');
            path.addPoint([path._segments[0]._point._x, path._segments[0]._point._y]);
            Meteor.commandLineMethods.endLine(true);
        } else {
            Logs.insert({text: allowed_arr.join(", "), type: "Can only be used within commands"});
        }
    }
};