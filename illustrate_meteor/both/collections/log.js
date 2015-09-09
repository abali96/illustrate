Logs = new Mongo.Collection('logs');

Logs.after.insert(function () {
	$('#command_line_history').scrollTop($('#command_line_history')[0].scrollHeight); // scroll to the bottom of the log
});