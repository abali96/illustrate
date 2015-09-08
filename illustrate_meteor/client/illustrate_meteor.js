Template.canvas.onRendered(function (){
	Meteor.canvasMethods.renderCanvas();
});

Template.svg.onRendered(function() {
	svg_cursor = SVGs.find();
	svg_cursor.observe({
		added: function (doc) {
			console.log("adding svg");
			Meteor.canvasMethods.injectSVG(doc.data);
		},
	});
});