Meteor.canvasMethods = {
    renderCanvas : function() {
        paper.setup('canvas');
        // Set the default session values.
        Session.setDefault(ToolModifierConstants.StrokeColour, 'black');
        Session.setDefault(ToolModifierConstants.StrokeWidth, 1);
        Session.setDefault(ToolModifierConstants.StrokeDashLength, 1);
        Session.setDefault(ToolModifierConstants.StrokeDashGap, 0);
        Session.setDefault(ToolModifierConstants.StrokeDashGap, false);
    },
    calculateStraightLinePoint : function(event, path) {
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
    calculateSquareSize : function(default_x, default_y) {
        if (Session.get(CanvasConstants.StraightLineModifier)) {
            var min_value = Math.min(default_x, default_y);
            return new paper.Size(min_value, min_value);
        } else {
            return new paper.Size(default_x, default_y);
        }
    },
    calculateSquarePosition : function(x, y, rectangle){
        return new paper.Point((rectangle.point.x + x)/2, (rectangle.point.y + y)/2);
        
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
            fillColor: Session.get(ToolModifierConstants.FillColour),
        };
        return settings_map;
    },
    savePath : function(path) {
        var path_svg = path.exportSVG({asString:true});
        SVGs.insert({data : path_svg});
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