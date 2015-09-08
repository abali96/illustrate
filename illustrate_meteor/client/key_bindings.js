Mousetrap.bind('shift', function(e) {
	console.log("Shift pressed down.");
});

Mousetrap.bind('mod+s', function(e) {
	e.preventDefault();
	console.log("Saving document.");
});

Mousetrap.bind('mod', function(e) {
	console.log("Pin center.");
});