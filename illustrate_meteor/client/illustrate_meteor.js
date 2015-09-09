Template.edit_canvas.onRendered(function (){
	Meteor.canvasMethods.renderCanvas();
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