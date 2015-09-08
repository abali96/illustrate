Meteor.canvasMethods = {
    renderCanvas : function() {
        paper.setup('canvas');
        var tool = new paper.Tool();
        var line_id;
        var path;
        var group = new paper.Group();
        Meteor.canvasMethods.setToolActions(path, tool, group);
    },
    renderSVG : function() {
        SVGs.find().forEach(function (doc) {
            if (doc.data != {})
                Meteor.canvasMethods.injectSVG(doc.data);
        });
    },
    setToolActions : function(path, tool, group) {
        tool.onMouseDown = function(event) {
          path = new paper.Path();
          path.strokeColor = 'black';
          path.add(event.point);
        };

        tool.onMouseDrag = function(event) {
          path.add(event.point);
        };

        tool.onMouseUp = function(event) {
          path.smooth();
          path.simplify();
          var path_svg = path.exportSVG({asString:true});
          SVGs.insert({data : path_svg});
          Meteor.canvasMethods.eraseCanvas();
        };
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