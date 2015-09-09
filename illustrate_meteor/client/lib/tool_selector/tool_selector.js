Template.tool_selector.helpers({
	tools : function() {
		tools = [
			{name: "Colour", id: ToolTypeConstants.SelectColour, button: false},
			{name: "Scribble Tool", id: ToolTypeConstants.DrawLineString, button: true},
			{name: "Line Tool", id: ToolTypeConstants.DrawStraightLine, button: true},
		];
		return tools;
	},
});

Template.tool_selector.events({
	"click .tool_selector": function(e) {
		e.preventDefault();
		Meteor.canvasMethods.setCurrentTool(e.target.id);
	},
	"submit .colour_selector": function(e) {
		e.preventDefault();
		colour = $("#"+ToolTypeConstants.SelectColour)[0].value;
		Session.set({'currentColour': colour});
	},
});