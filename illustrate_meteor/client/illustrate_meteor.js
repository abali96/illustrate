Template.edit_canvas.onRendered(function (){
    Meteor.canvasMethods.renderCanvas();
    Meteor.logger.log('Rendered Canvas', CommandLineConstants.NewSession, false);
    $('canvas').mousemove(function (e) {
        Session.set('mousePosition', [e.pageX, e.pageY]);
    });
    
    Mousetrap.bind('shift', function(e) {
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

    $(document).keydown(function(e) {
        if (e.keyCode == 27) { // escape key maps to keycode `27`
            Meteor.canvasMethods.savePath(path);
        } else if (e.keyCode == 16) {
            Session.set(CanvasConstants.StraightLineModifier, true);
        }
    });

    $(document).keyup(function(e) {
        if (e.keyCode == 16) {
            Session.set(CanvasConstants.StraightLineModifier, false);
        }
    });
});

Template.view_canvas.onRendered(function() {
    svg_cursor = SVGs.find();
    svg_cursor.observe({
        added: function (doc) {
            Meteor.canvasMethods.injectSVG(doc.data);
        },
    });
});