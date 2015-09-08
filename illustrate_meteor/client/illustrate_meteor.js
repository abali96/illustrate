function renderCanvas(path_points) {
  paper.setup('canvas');
  var tool = new paper.Tool();
  var line_id;
  var path;

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
  };
}

if (Meteor.isClient) {
  Template.canvas.onRendered(function (){
    renderCanvas();
  });
}