function SplineTool() {
    this.happy = true;
}
function StraightLineTool() {
    this.setToolActions = function(path, tool, group) {
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
          // Meteor.canvasMethods.eraseCanvas();
        };
    };
}