Meteor.toolMethods = {
    saveAsSVG : function() {
        var path_svg = path.exportSVG({asString:true});
        SVGs.insert({data : path_svg});
        delete Session.keys['currentPath'];
    },
};