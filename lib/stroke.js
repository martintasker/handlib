'use strict';

var Stroke = function(points) {
  this._points = points;
};

// getters
Stroke.prototype = {
  get points() {
    return this._points;
  },
  get size() {
    if (typeof this._size === 'undefined') {
      this._size = this._calculateSize();
    }
    return this._size;
  },
  get subStrokes() {
    if (!this._subStrokes) {
      this._subStrokes = this._getSubStrokes();
    }
    return this._subStrokes;
  },
};

Stroke.prototype._calculateSize = function() {
  var s = 0;
  var x = this._points[0].x;
  var y = this._points[0].y;
  for (var i = 1; i < this._points.length; i++) {
    var nx = this._points[i].x;
    var ny = this._points[i].y;
    var dx = nx - x;
    var dy = ny - y;
    var ds = Math.sqrt(dx * dx + dy * dy);
    s += ds;
    x = nx;
    y = ny;
  }
  return s;
};

Stroke.prototype._getSubStrokes = function() {
  if (this.points.length <= 2) {
    return [this.points.map(function(point) {
      return {
        x: point.x,
        y: point.y
      };
    })];
  }

  var increments = [];
  for (var i = 1; i < this.points.length; i++) {
    var dx = this.points[i].x - this.points[i - 1].x;
    var dy = this.points[i].y - this.points[i - 1].y;
    increments.push({
      dx: dx,
      dy: dy
    });
  }

  var breakPoints = [];
  for (var i = 1; i < increments.length; i++) {
    var i1 = increments[i - 1];
    var i2 = increments[i];
    var modi1 = Math.sqrt(i1.dx * i1.dx + i1.dy * i1.dy);
    var modi2 = Math.sqrt(i2.dx * i2.dx + i2.dy * i2.dy);
    var dot12 = i1.dx * i2.dx + i1.dy * i2.dy;
    var cosTheta = dot12 / (modi1 * modi2);
    if (cosTheta < -0.1) {
      breakPoints.push(i);
    }
  }
  breakPoints.push(this.points.length - 1);

  var subStrokes = [];

  function addSubStroke(startIndex, endIndex) {
    var subStroke = [];
    for (var i = startIndex; i <= endIndex; i++) {
      subStroke.push({
        x: this.points[i].x,
        y: this.points[i].y
      });
    }
    subStrokes.push(subStroke);
  }

  var startIndex = 0;
  var breakPointIndex = 0;
  while (breakPointIndex < breakPoints.length) {
    var endIndex = breakPoints[breakPointIndex];
    addSubStroke.call(this, startIndex, endIndex);
    startIndex = endIndex;
    breakPointIndex++;
  }

  return subStrokes;
}

// export

module.exports = Stroke;
