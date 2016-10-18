'use strict';

var Glyph = require('./glyph');
var GlyphFeatures = require('./glyph-features');

var FXGlyph = function(glyph) {

  // public API and instance variables
  var self = this;
  self.glyph = glyph;
};

FXGlyph.prototype = {
  get id() {
    return this.glyph.id;
  },
  get bbox() {
    return this.glyph.bbox;
  },
  get strokes() {
    return this.glyph.strokes;
  },
  get subStrokes() {
    if (!this._features) {
      this._features = new GlyphFeatures(this.glyph);
    }
    return this._features.subStrokes;
  },
  get size() {
    if (!this._features) {
      this._features = new GlyphFeatures(this.glyph);
    }
    return this._features.size;
  },
}

module.exports = FXGlyph;
