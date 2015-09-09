Template.tool_selector.helpers({
	tools : function() {
		tools = [
			{name: "Select Path", id: ToolTypeConstants.SelectPath},
			{name: "Scribble Tool", id: ToolTypeConstants.DrawLineString},
			{name: "Line Tool", id: ToolTypeConstants.DrawStraightLine},
		];
		return tools;
	},
});

Template.tool_selector.events({
	"click .tool_selector": function(e) {
		e.preventDefault();
		Meteor.canvasMethods.setCurrentTool(e.target.id);
	},
});