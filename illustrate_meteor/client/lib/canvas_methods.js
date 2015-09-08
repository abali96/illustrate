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
        svg = $('#svg');
        exported_svg = paper.project.exportSVG();
        svg = exported_svg;
        console.log(exported_svg);
        Meteor.canvasMethods.eraseCanvas();
    },
    setToolActions : function(path, tool, group) {
        tool.onMouseDown = function(event) {
          path = new paper.Path();
          path.strokeColor = 'black';
          path.add(event.point);
          line_id = Lines.insert({createdAt: new Date()});
          Lines.update(
            {_id: line_id},
            {$push : {points: [event.point.x, event.point.y]}}
          );
          console.log(Lines.find(line_id));
        };

        tool.onMouseDrag = function(event) {
          path.add(event.point);
          Lines.update({_id: line_id}, {$push : {points: [event.point.x, event.point.y]}});
        };

        tool.onMouseUp = function(event) {
          path.smooth();
          path.simplify();
          group.addChild(path);
          Meteor.canvasMethods.renderSVG();
        };
    },
    eraseCanvas : function(group) {
        paper.project._activeLayer.removeChildren();
    }
};