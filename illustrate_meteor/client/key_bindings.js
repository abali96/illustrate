Mousetrap.bind('shift', function(e) {
    console.log("Shift pressed down.");
    this.current_tool = SplineTool.setToolActions(path, tool, group);
}, "keypress");
Mousetrap.bind('shift', function(e) {
    console.log("Shift pressed down.");
    this.current_tool = SplineTool.setToolActions(path, tool, group);
}, "keyup");

Mousetrap.bind('mod+s', function(e) {
    e.preventDefault();
    console.log("Saving document.");
});

Mousetrap.bind('mod', function(e) {
    console.log("Pin center.");
});