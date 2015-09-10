Mousetrap.bind('shift', function(e) {
	console.log('here');
    Session.set(CanvasConstants.StraightLineModifier, true);
}, "keydown");

Mousetrap.bind('shift', function(e) {
    Session.set(CanvasConstants.StraightLineModifier, false);
}, "keyup");

Mousetrap.bind('mod+s', function(e) {
    e.preventDefault();
});

Mousetrap.bind('mod', function(e) {
});


$(document).on('keypress', function(e) {
	$('#command_line').focus();
});