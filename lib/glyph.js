'use strict';

var Glyph = function(spec) {
  this.id = (spec && spec.id) || "";
  this._strokes = (spec && spec.strokes) || [];
};

Glyph.prototype = {
  get strokes() {
    return this._strokes;
  },
};

module.exports = Glyph;
