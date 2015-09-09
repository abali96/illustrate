Template.command_line.events({
	'submit #command_line_form' : function(e) {
		e.preventDefault();
		command_line_value = $(e.target).find('input')[0].value;
		Logs.insert({text: command_line_value});
		$(e.target).find('input')[0].value = ""; // Set the value of the text input to nothing
		$('#command_line_history').scrollTop($('#command_line_history')[0].scrollHeight); // scroll to the bottom of the log
	}
});

Template.command_line.helpers({
	'logs' : function() {
		return Logs.find();
	}
});