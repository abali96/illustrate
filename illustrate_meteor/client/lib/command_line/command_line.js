Template.command_line.events({
	'submit #command_line_form' : function(e) {
		e.preventDefault();
		command_line_value = $(e.target).find('input')[0].value;
		$(e.target).find('input')[0].value = ""; // Set the value of the text input to nothing
		Meteor.commandLineMethods.executeCommand(command_line_value);
	}
});

Template.command_line.helpers({
	'logs' : function() {
		return Logs.find();
	},
	'context' : function() {
		raw_string = Session.get(CommandLineConstants.Context);
		if (typeof raw_string !== 'undefined')
			return raw_string.charAt(0).toUpperCase() + raw_string.slice(1);
		return "Command";
	}
});