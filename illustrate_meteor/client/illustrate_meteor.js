Template.edit_canvas.onRendered(function (){
	Meteor.canvasMethods.renderCanvas();
	$('canvas').mousemove(function (e) {
		Session.set('mousePosition', [e.pageX, e.pageY]);
	});
});

Template.view_canvas.onRendered(function() {
	svg_cursor = SVGs.find();
	svg_cursor.observe({
		added: function (doc) {
			console.log("adding svg");
			Meteor.canvasMethods.injectSVG(doc.data);
		},
	});
});