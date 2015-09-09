Mousetrap.bind('shift', function(e) {
    Session.set('straight_modifier', true);
}, "keydown");

Mousetrap.bind('shift', function(e) {
    Session.set('straight_modifier', false);
}, "keyup");

Mousetrap.bind('mod+s', function(e) {
    e.preventDefault();
});

Mousetrap.bind('mod', function(e) {
});