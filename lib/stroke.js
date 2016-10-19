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

// export

module.exports = Stroke;
