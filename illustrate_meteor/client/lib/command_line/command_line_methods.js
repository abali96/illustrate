Meteor.logger = {
	log : function(data, type, broadcast) {
		Logs.insert({text: data, type: type, broadcast: broadcast});
	},
};

Meteor.commandLineMethods = {
	executeCommand : function(command) { // parse the command to do the desired action
		action_map = {
			"line": Meteor.commandLineMethods.setLineTool,
			"scribble": Meteor.commandLineMethods.setScribbleTool,
			"colour": Meteor.commandLineMethods.setColour,
			"width": Meteor.commandLineMethods.setStrokeWidth,
			"dash": Meteor.commandLineMethods.setStrokeWidth,
			"end": Meteor.commandLineMethods.endLine,
			"debug": Meteor.commandLineMethods.debug,
		};
		possible_actions = [];
		command = command.toLowerCase();
		for (var action in action_map) { // Find all those actions that the user's command could relate to
			if (action_map.hasOwnProperty(action) && action.startsWith(command)) {
				possible_actions.push(action);
			}
		}
		console.log(possible_actions);
		if (possible_actions.length === 0) {
			Logs.insert({text: command_line_value, type: "Unknown Command"});
		} else if (possible_actions.length == 1) {
			Logs.insert({text: command_line_value, type: "Command", resultant_command: possible_actions[0]});
			action_map[possible_actions[0]]();
		} else {
			Logs.insert({text: possible_actions.join(", "), type: "Possible commands with given input: '" + command_line_value + "'"});
		}
	},
	debug : function(command) {
		alert("yes?");
	},
};