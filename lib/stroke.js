'use strict';

var Stroke = function(points, scale) {
  this._points = points;
  this._scale = scale;
};

Stroke.DS_UNIT_DEFAULT = 0.05;

// getters
Stroke.prototype = {
  get points() {
    return this._points;
  },
  get scale() {
    return this._scale;
  },
  get size() {
    if (typeof this._size === 'undefined') {
      this._size = this._calculateSize();
    }
    return this._size;
  },
  get ds() {
    if (typeof this._dS === 'undefined') {
      this._ds = this._getDS();
    }
    return this._ds;
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
  var x = this.points[0].x;
  var y = this.points[0].y;
  for (var i = 1; i < this.points.length; i++) {
    var nx = this.points[i].x;
    var ny = this.points[i].y;
    var dx = nx - x;
    var dy = ny - y;
    var ds = Math.sqrt(dx * dx + dy * dy);
    s += ds;
    x = nx;
    y = ny;
  }
  return s;
};

Stroke.prototype._getDS = function() {
  var ds0 = this.scale * Stroke.DS_UNIT_DEFAULT;
  var nIncrements = Math.floor(this.size / ds0);
  var ds = ds0;
  if (nIncrements > 0) {
    ds = this.size / nIncrements;
  }
  return ds;
};

Stroke.prototype._getSubStrokes = function() {
  if (this.points.length <= 2) {
    return [new Stroke(this.points, this.scale)];
  }

  var increments = [];
  var i;
  for (i = 1; i < this.points.length; i++) {
    var dx = this.points[i].x - this.points[i - 1].x;
    var dy = this.points[i].y - this.points[i - 1].y;
    increments.push({
      dx: dx,
      dy: dy
    });
  }

  var breakPoints = [];
  for (i = 1; i < increments.length; i++) {
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

  function addSubStroke(strokePoints, startIndex, endIndex) {
    var points = [];
    for (var i = startIndex; i <= endIndex; i++) {
      points.push(strokePoints[i]);
    }
    subStrokes.push(new Stroke(points, this.scale));
  }

  var startIndex = 0;
  var breakPointIndex = 0;
  while (breakPointIndex < breakPoints.length) {
    var endIndex = breakPoints[breakPointIndex];
    addSubStroke.call(this, this.points, startIndex, endIndex);
    startIndex = endIndex;
    breakPointIndex++;
  }

  return subStrokes;
};

// export

module.exports = Stroke;
