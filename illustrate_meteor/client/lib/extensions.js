if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

paper.Path.prototype.addPoint = function(point) {
	if (typeof this.clickPoints === 'undefined') {
		this.clickPoints = [];
	}
	this.clickPoints.push(point);
	path.add(point);
};

paper.Segment.prototype.getPoint = function() {
	return [this._x, this._y];
};