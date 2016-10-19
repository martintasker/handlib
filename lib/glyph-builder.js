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
  return new Glyph({
    strokes: this.strokes
  });
};

module.exports = GlyphBuilder;
