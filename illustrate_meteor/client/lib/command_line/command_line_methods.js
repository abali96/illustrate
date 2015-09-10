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
            "dash": Meteor.commandLineMethods.setStrokeWidth,
            "end": Meteor.commandLineMethods.endLine,
            "debug": Meteor.commandLineMethods.debug,
        };
        possible_actions = [];
        command = command.toLowerCase();
        for (var action in action_map) { // Find all those actions that the user's command could relate to
            if (action_map.hasOwnProperty(action) && action.startsWith(command)) {
                possible_actions.push(action);
            }
        }
        console.log(possible_actions);
        if (possible_actions.length === 0) {
            Logs.insert({text: command_line_value, type: "Unknown Command"});
        } else if (possible_actions.length == 1) {
            Logs.insert({text: command_line_value, type: "Command", resultant_command: possible_actions[0]});
            action_map[possible_actions[0]]();
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
            path.add(Meteor.canvasMethods.calculatePoint(event, path));
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
        $(document).keyup(function(e) {
            if (e.keyCode == 27) { // escape key maps to keycode `27`
                path.removeSegment(path._segments.length - 1);
                console.log(path._segments.length);
                Meteor.canvasMethods.savePath(path);
                line_tool.remove();
                Meteor.commandLineMethods.setLineTool();
            }
        });
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

};