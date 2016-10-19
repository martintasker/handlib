'use strict';

var Glyph = function(spec) {
  this.id = (spec && spec.id) || "";
  this.device = (spec && spec.device) || "";
  this.strokes = (spec && spec.strokes) || [];
};

module.exports = Glyph;
