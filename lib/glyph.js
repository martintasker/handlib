'use strict';

var Glyph = function() {

  // public API and instance variables
  var self = this;
  self.strokes = [];
  self.bbox = undefined;
};

// implementation -- methods
Glyph.prototype.getScaled = function(scale) {
  var self = this;

  var xScale = 0;
  if (self.bbox.right > self.bbox.left) {
    xScale = scale / (self.bbox.right - self.bbox.left);
  }
  var x0 = -self.bbox.left * scale;
  var yScale = 0;
  if (self.bbox.bottom > self.bbox.top) {
    yScale = scale / (self.bbox.bottom - self.bbox.top);
  }
  var y0 = -self.bbox.top * scale;

  function cx(x) {
    return x * xScale + x0;
  }

  function cy(y) {
    return y * yScale + y0;
  }

  var that = new Glyph();
  that.strokes = self.strokes.map(function(stroke) {
    return stroke.map(function(xy) {
      return {
        x: cx(xy.x),
        y: cy(xy.y)
      };
    });
  });
  that.bbox = {
    left: cx(self.bbox.left),
    right: cx(self.bbox.right),
    top: cy(self.bbox.top),
    bottom: cy(self.bbox.bottom),
  };
  return that;
};

Glyph.prototype.getUnitScaled = function() {
  return this.getScaled(1.0);
};

module.exports = Glyph;
