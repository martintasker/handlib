'use strict';

var Glyph = require('./glyph');

var GlyphBuilder = function() {
  Glyph.call(this);
  this.strokeInProgress = false;
};

GlyphBuilder.prototype = Object.create(Glyph.prototype);
GlyphBuilder.prototype.constructor = GlyphBuilder;

// implementation -- methods
GlyphBuilder.prototype.addPoint = function(xy) {
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

GlyphBuilder.prototype.endStroke = function() {
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

GlyphBuilder.prototype.getGlyph = function() {
  var that = new Glyph();
  that.strokes = this.strokes;
  that.bbox = this.bbox;
  return that;
};

module.exports = GlyphBuilder;
