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

paper.Path.prototype.cleanLastPoint = function() {
    if (!_.contains(this.clickPoints, this._segments[this._segments.length - 1])) { // used to filter out last point added due to mouse move
        this.removeSegment(this._segments.length - 1);
    }
};

paper.Shape.Circle.prototype.setCenter = false;
paper.Shape.Rectangle.prototype.setCorner = false;