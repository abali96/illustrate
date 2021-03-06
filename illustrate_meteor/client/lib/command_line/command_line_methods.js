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
            "strokecolour": Meteor.commandLineMethods.setStrokeColour,
            "fillcolour": Meteor.commandLineMethods.setFillColour,
            "width": Meteor.commandLineMethods.setStrokeWidth,
            "dash": Meteor.commandLineMethods.setStrokeDash,
            "end": Meteor.commandLineMethods.endLine,
            "debug": Meteor.commandLineMethods.debug,
            "close": Meteor.commandLineMethods.closeLine,
            "circle": Meteor.commandLineMethods.setCircleTool,
            "rectangle": Meteor.commandLineMethods.setRectangleTool,
            "polygon": Meteor.commandLineMethods.setPolygonTool,
            "delete": Meteor.commandLineMethods.setDeleteTool,
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
            // Meteor.canvasMethods.eraseCanvas();
            params = command.length > 1 ? command.slice(1) : null;
            action_map[possible_actions[0]](params); // Pass in the parameters along with the value
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
        line_tool.onMouseDown = function (event) {
            if (!line_tool.clickCount) {
                line_tool.clickCount += 1;
                path = new paper.Path({style: Meteor.canvasMethods.collectStyleSettings()});
            }
            path.addPoint(Meteor.canvasMethods.calculateStraightLinePoint(event, path));
            console.log(path._segments.length);
        };
        line_tool.onMouseMove = function (event) {
            if (line_tool.clickCount) {
                if (path._segments.length > 1) {
                    path.removeSegment(path._segments.length - 1);
                    path.add(Meteor.canvasMethods.calculateStraightLinePoint(event, path));
                } else if (path._segments.length == 1) {
                    path.add(Meteor.canvasMethods.calculateStraightLinePoint(event, path));
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
    setCircleTool : function() {
        circle_tool = new paper.Tool();
        function createNewCircle() {
            circle = new paper.Shape.Circle(new paper.Point(event.point), 1); // create a floating tool
            circle.style = Meteor.canvasMethods.collectStyleSettings();
        }
        circle_tool.onMouseDown = function (event) {
            if (!circle.setCenter) {
                circle.position = new paper.Point(event.point);
                circle.setCenter = true;
            } else {
                Meteor.canvasMethods.savePath(circle);
                createNewCircle();
            }
        };
        circle_tool.onMouseMove = function(event) {
            if (!circle.setCenter) {
                circle.position = new paper.Point(event.point);
            } else {
                dist_to_point = Math.sqrt(Math.pow(event.point.x - circle.position._x, 2) + Math.pow(event.point.y - circle.position._y, 2));
                circle.radius = dist_to_point;
            }
            
        };
        createNewCircle();
        circle_tool.activate();
    },
    setRectangleTool : function() {
        // Since we can only modify the center position and the size, we have to do some math to make this seem like a simple top left corner to bottom right corner tool.
        rectangle_tool = new paper.Tool();
        rectangle_tool.onMouseDown = function (event) {
            if (!rectangle_tool.clickCount) {
                rectangle_tool.clickCount += 1;
                rectangle = new paper.Shape.Rectangle({point: event.point, size: new paper.Size(0, 0)});
                rectangle.style = Meteor.canvasMethods.collectStyleSettings();
            } else {
                Meteor.canvasMethods.savePath(rectangle);
                rectangle_tool.clickCount = 0;
            }
        };
        rectangle_tool.onMouseMove = function(event) {
            function sign(x) {
                return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
            }
            var square_modified_x = event.point.x, // will be modified if we are drawing a square.
                square_modified_y = event.point.y;
            if (Session.get(CanvasConstants.StraightLineModifier)) {
                var x_delta = rectangle.point.x - event.point.x;
                var y_delta = rectangle.point.y - event.point.y;
                var min_delta = Math.min(Math.abs(x_delta), Math.abs(y_delta));
                square_modified_x = rectangle.point.x - sign(x_delta)*Math.abs(min_delta);
                square_modified_y = rectangle.point.y - sign(y_delta)*Math.abs(min_delta);
            }
            rectangle.position = Meteor.canvasMethods.calculateSquarePosition(square_modified_x, square_modified_y, rectangle);
            rectangle.size = Meteor.canvasMethods.calculateSquareSize(Math.abs(2 * (rectangle.position.x - square_modified_x)), Math.abs(2 * (rectangle.position.y - square_modified_y)));
        };
        rectangle_tool.activate();
    },
    setPolygonTool : function(params) {
        // Since we can only modify the center position and the size, we have to do some math to make this seem like a simple top left corner to bottom right corner tool.
        if (!params || isNaN(params[0])) {
            Logs.insert({text: "polygon <number of sides>", type:"Usage"});
        } else {
            polygon_tool = new paper.Tool();
            polygon_tool.onMouseDown = function (event) {
                if (!polygon_tool.clickCount) {
                    polygon_tool.clickCount += 1;
                    polygon = new paper.Path.RegularPolygon({center: new paper.Point(event.point), sides: params[0], radius: CommandLineConstants.MinPolygonRadius});
                    polygon.style = Meteor.canvasMethods.collectStyleSettings();
                } else {
                    Meteor.canvasMethods.savePath(polygon);
                    polygon_tool.clickCount = 0;
                }
            };
            polygon_tool.onMouseMove = function(event) {
                // We want this to scale the shape. We already know that the distance of one point in the polygon to the center will be constant.
                // Therefore we scale by a factor of dist_of_mouse_to_center/dist_of_one_point_to_center.
                console.log(polygon);
                var point_on_poly = [polygon._segments[0]._point.x, polygon._segments[0]._point.y];
                var dist_of_point_to_center = Math.pow(point_on_poly[0] - polygon.position.x, 2) + Math.pow(point_on_poly[1] - polygon.position.y, 2);
                var dist_of_mouse_to_center = Math.pow(polygon.position.x - event.point.x, 2) + Math.pow(polygon.position.y - event.point.y, 2);
                polygon.scale(Math.sqrt(dist_of_mouse_to_center/dist_of_point_to_center));
            };
            polygon_tool.activate();
        }
    },
    setDeleteTool : function() {
        selectTool = new paper.Tool();
        selectTool.onMouseMove = function(event) {
            SVGs.find().forEach( function(doc) {
            });
        };
        selectTool.onMouseDown = function(event) {
            SVGs.find().forEach(function(doc) {
                var path = paper.project.importSVG(doc.svg_str); // could probably add these to a selection paper js layer with display type none.
                paper.project._activeLayer.removeChildren(paper.project.length - 1);
                if (path.hitTest(event.point)) {
                    SVGs.remove({_id: doc._id});
                }
            });
        };
        selectTool.activate();
    },
    endLine : function(close_break_signal) {
        // Will be implemented after context switching exists (you'd be able to tell which tool to reactivate.)
        if (!(close_break_signal === true)) // will be an empty array otherwise.
            path.cleanLastPoint();
        Meteor.canvasMethods.savePath(path);
        line_tool.remove();
        Meteor.commandLineMethods.setLineTool();
    },
    setStrokeColour : function(params) {
        if (!params || params.length !== 1) {
            Logs.insert({text: "colour <colourname/hexcode including #/rgba(r, g, b, a)>", type: "Usage"});
        } else {
            Session.set(ToolModifierConstants.StrokeColour, params[0]);
        }
    },
    setFillColour : function(params) {
        if (!params || params.length !== 1) {
            Logs.insert({text: "colour <colourname/hexcode including #/rgba(r, g, b, a)>", type: "Usage"});
        } else {
            Session.set(ToolModifierConstants.FillColour, params[0]);
        }
    },
    setStrokeWidth : function(params) {
        if (!params || params.length !== 1 || isNaN(params[0])) {
            Logs.insert({text: "width <number>", type: "Usage"});
        } else {
            Session.set(ToolModifierConstants.StrokeWidth, Number(params[0]));
        }
    },
    setStrokeDash : function(params) {
        if (!params || params.length !== 2 || isNaN(params[0]) || isNaN(params[1])) {
            Logs.insert({text: "dash <number> <number>", type: "Usage"});
        } else {
            Session.set(ToolModifierConstants.StrokeDashLength, Number(params[0]));
            Session.set(ToolModifierConstants.StrokeDashGap, Number(params[1]));
        }
    },
    closeLine : function() {
        var allowed_arr = ["line", "scribble"];
        path.cleanLastPoint();
        if (_.contains(allowed_arr, Session.get(CommandLineConstants.Context))) {
            path.addPoint([path._segments[0]._point._x, path._segments[0]._point._y]);
            Meteor.commandLineMethods.endLine(true);
        } else {
            Logs.insert({text: allowed_arr.join(", "), type: "Can only be used within commands"});
        }
    },
};