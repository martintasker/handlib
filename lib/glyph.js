'use strict';

var Glyph = function() {

  // public API and instance variables
  var self = this;
  self.strokes = [];
  self.bbox = undefined;

  self.strokeInProgress = false;
};

// implementation -- methods
Glyph.prototype.addPoint = function(xy) {
  var self = this;
  if (!self.strokeInProgress) {
    self.strokes.push([]);
    self.strokeInProgress = true;
  }

  var stroke = self.strokes[self.strokes.length - 1];
  if (stroke.length > 0) {
    var lastPoint = stroke[stroke.length - 1];
    if (lastPoint.x === xy.x && lastPoint.y === xy.y) {
      return;
    }
  }

  stroke.push(xy);

  if (!self.bbox) {
    self.bbox = {
      top: xy.y,
      bottom: xy.y,
      left: xy.x,
      right: xy.x
    };
  } else {
    if (xy.x < self.bbox.left) {
      self.bbox.left = xy.x;
    } else if (xy.x > self.bbox.right) {
      self.bbox.right = xy.x;
    }
    if (xy.y < self.bbox.top) {
      self.bbox.top = xy.y;
    } else if (xy.y > self.bbox.bottom) {
      self.bbox.bottom = xy.y;
    }
  }
};

Glyph.prototype.endStroke = function() {
  var self = this;
  if (!self.strokeInProgress) {
    return;
  }
  var stroke = self.strokes[self.strokes.length - 1];
  if (stroke.length === 0) {
    self.strokes.pop();
  }
  self.strokeInProgress = false;
};

Glyph.prototype.getScaled = function(scale) {
  var self = this;

  var xScale = 0;
  if (self.bbox.right > self.bbox.left) {
    xScale = scale / (self.bbox.right - self.bbox.left);
  }
  var x0 = - self.bbox.left * scale;
  var yScale = 0;
  if (self.bbox.bottom > self.bbox.top) {
    yScale = scale / (self.bbox.bottom - self.bbox.top);
  }
  var y0 = - self.bbox.top * scale;

  var that = new Glyph();
  self.strokes.forEach(function(stroke) {
    stroke.forEach(function(xy) {
      var x = xy.x * xScale + x0;
      var y = xy.y * yScale + y0;
      that.addPoint({x: x, y: y});
    });
    that.endStroke();
  });
  return that;
};

Glyph.prototype.getUnitScaled = function() {
  return this.getScaled(1.0);
};

module.exports = Glyph;
