Template.tool_selector.helpers({
	tools : function() {
		tools = [
			{name: "Scribble Tool", id: ToolTypeConstants.DrawLineString, button: true},
			{name: "Line Tool (hold shift for vertical/horizontal lines)", id: ToolTypeConstants.DrawStraightLine, button: true},
		];
		return tools;
	},
	tool_modifiers : function() {
		modifiers = [
			{name: "Colour", id: ToolModifierConstants.StrokeColour, button: false, value: Session.get(ToolModifierConstants.StrokeColour)},
			{name: "Width (pt)", id: ToolModifierConstants.StrokeWidth, value: Session.get(ToolModifierConstants.StrokeWidth)},
			{name: "Dash Length (pt)", id: ToolModifierConstants.StrokeDashLength, value: Session.get(ToolModifierConstants.StrokeDashLength)},
			{name: "Dash Gap (pt)", id: ToolModifierConstants.StrokeDashGap, value: Session.get(ToolModifierConstants.StrokeDashGap)},
		];
		return modifiers;
	},
});

Template.tool_selector.events({
	"click .tool_selector": function(e) {
		e.preventDefault();
		Meteor.canvasMethods.setCurrentTool(e.target.id);
	},
	"submit .tool_modifier_selector": function(e) {
		e.preventDefault();
		new_value = $(e.target).find('input')[0].value;
		console.log("Setting " + e.target.id + " to " + new_value);
		Session.set(e.target.id, new_value);
	},
});