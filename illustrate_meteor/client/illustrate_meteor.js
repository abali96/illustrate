Template.edit_canvas.onRendered(function (){
	Meteor.canvasMethods.renderCanvas();
	Meteor.logger.log('Rendered Canvas', CommandLineConstants.NewSession, false);
	$('canvas').mousemove(function (e) {
		Session.set('mousePosition', [e.pageX, e.pageY]);
	});
});

Template.view_canvas.onRendered(function() {
	svg_cursor = SVGs.find();
	svg_cursor.observe({
		added: function (doc) {
			Meteor.canvasMethods.injectSVG(doc.data);
		},
	});
});