Meteor.canvasMethods = {
    renderCanvas : function() {
        paper.setup('canvas');
        Meteor.canvasMethods.setToolActions();
        // Set the default session values.
        Session.setDefault(ToolModifierConstants.StrokeColour, 'black');
        Session.setDefault(ToolModifierConstants.StrokeWidth, 1);
        Session.setDefault(ToolModifierConstants.StrokeDashLength, 1);
        Session.setDefault(ToolModifierConstants.StrokeDashGap, 0);
    },
    calculatePoint : function(event, path) {
        console.log(Session.get(CanvasConstants.StraightLineModifier), path._segments.length);
        if (Session.get(CanvasConstants.StraightLineModifier) && path._segments.length) {
            var prev_x = path._segments[path._segments.length - 1]._point._x,
                prev_y = path._segments[path._segments.length - 1]._point._y;
            if (Math.abs(event.point.x - prev_x) < Math.abs(event.point.y - prev_y)) {
                return [prev_x, event.point.y];
            } else {
                return [event.point.x, prev_y];
            }
        } else {
            return [event.point.x, event.point.y];
        }
    },
    renderSVG : function() {
        SVGs.find().forEach(function (doc) {
            if (doc.data != {})
                Meteor.canvasMethods.injectSVG(doc.data);
        });
    },
    collectStyleSettings : function() {
        settings_map = {
            dashArray: [Session.get(ToolModifierConstants.StrokeDashLength), Session.get(ToolModifierConstants.StrokeDashGap)],
            strokeWidth: Session.get(ToolModifierConstants.StrokeWidth),
            strokeColor: Session.get(ToolModifierConstants.StrokeColour),
        };
        return settings_map;
    },
    setToolActions : function() {
        path = undefined;
        line_string_tool = new paper.Tool();
        scribble_tool = new paper.Tool();
        unmountTool = function(event) {
            var path_svg = path.exportSVG({asString:true});
            SVGs.insert({data : path_svg});
            path = new paper.Path({style: Meteor.canvasMethods.collectStyleSettings()});
        };
        line_string_tool.onMouseDown = function (event) {
            if (path === undefined) {
                path = new paper.Path({style: Meteor.canvasMethods.collectStyleSettings()});
                path.add(Meteor.canvasMethods.calculatePoint(event, path));
            } else {
                path.add(Meteor.canvasMethods.calculatePoint(event, path));
            }
        };
        line_string_tool.onMouseMove = function (event) {
            if (path._segments.length > 1) {
                path.removeSegment(path._segments.length - 1);
                path.add(Meteor.canvasMethods.calculatePoint(event, path));
            } else {
                path.add(Meteor.canvasMethods.calculatePoint(event, path));
            }
        };

        scribble_tool.onMouseDown = function onMouseDown(event) {
            path = new paper.Path();
            path.style = Meteor.canvasMethods.collectStyleSettings();
            path.add(event.point);
        };
        scribble_tool.onMouseDrag = function(event) {
            path.add(event.point);
        };
        scribble_tool.onMouseUp = function(event) {
            unmountTool();
            path = undefined;
        };
        Mousetrap.bind('esc', function(e) {
            unmountTool();
            path = undefined;
        });
    },
    setCurrentTool : function(tool_type) {
        switch(tool_type) {
            case ToolTypeConstants.DrawStraightLine:
                line_string_tool.activate();
                break;
            case ToolTypeConstants.Scribble:
                scribble_tool.activate();
                break;
            default:
                scribble_tool.activate();
                break;
        }
    },
    eraseCanvas : function() {
        paper.project._activeLayer.removeChildren();
    },
    injectSVG : function(path) {
        var svg = $('svg')[0]; // Get svg element from DOM.
        var container_div = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        container_div.innerHTML = path;
        var elements = container_div.childNodes;
        svg.appendChild(elements[0]);
    },
};