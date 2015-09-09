Meteor.logger = {
	log : function(data, type, broadcast) {
		Logs.insert({text: data, type: type, broadcast: broadcast});
	},
};