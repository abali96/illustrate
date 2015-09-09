Meteor.toolMethods = {
    saveAsSVG : function(path) {
        var path_svg = path.exportSVG({asString:true});
        SVGs.insert({data : path_svg});
    },
    startNewPath: function() {
        var path = new paper.Path();
        path.strokeColor = Session.get('currentColour');
        return path;
    },
};