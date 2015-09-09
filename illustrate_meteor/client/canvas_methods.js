Meteor.canvasMethods = {
    renderCanvas : function() {
        paper.setup('canvas');
        Meteor.canvasMethods.setToolActions();
        Session.set({'currentColour': 'black'});
    },
    renderSVG : function() {
        SVGs.find().forEach(function (doc) {
            if (doc.data != {})
                Meteor.canvasMethods.injectSVG(doc.data);
        });
    },
    setToolActions : function() {
        path = undefined;
        unmountTool = function(event) {
            var path_svg = path.exportSVG({asString:true});
            SVGs.insert({data : path_svg});
            path = undefined;
        };
        line_string_tool = new paper.Tool();
        line_string_tool.onMouseDown = function (event) {
            console.log(path);
            if (path === undefined) {
                path = new paper.Path();
                path.strokeColor = Session.get('currentColour');
                path.add(event.point);
            } else {
                if (Session.get('straight_modifier')) {
                    var prev_x = path._segments[path._segments.length - 1]._point._x;
                    var prev_y = path._segments[path._segments.length - 1]._point._y;
                    if (Math.abs(event.point.x - prev_x) < Math.abs(event.point.y - prev_y)) {
                        path.add(prev_x, event.point.y);
                    } else {
                        path.add(event.point.x, prev_y);
                    }
                } else {
                    path.add(event.point);
                }
                
            }
        };

        scribble_tool = new paper.Tool();
        scribble_tool.onMouseDown = function onMouseDown(event) {
            path = new paper.Path();
            path.strokeColor = Session.get('currentColour');
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