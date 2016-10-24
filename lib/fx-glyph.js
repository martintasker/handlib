'use strict';

/* jshint jasmine: true */

var Stroke = require('./stroke');
var BoundingBox = require('./bounding-box');
var BoxTransformer = require('./box-transformer');

var FXGlyph = function(glyph) {
  if (!glyph.scale) {
    throw 'glyph must have scale for successful feature extraction';
  }
  this._glyph = glyph;
  this.scale = glyph.scale;
};

// getters
FXGlyph.prototype = {
  get glyph() {
    return this._glyph;
  },
  get id() {
    return this._glyph.id;
  },
  get device() {
    return this._glyph.device;
  },
  get bbox() {
    if (!this._bbox) {
      this._bbox = this._getBBox(this._glyph);
    }
    return this._bbox;
  },
  get strokes() {
    return this._glyph.strokes;
  },
  get unitScaledStrokes() {
    if (!this._unitScaledStrokes) {
      this._unitScaledStrokes = FXGlyph.getScaledStrokes(this.strokes, this.bbox, new BoundingBox('unit'));
    }
    return this._unitScaledStrokes;
  },
  get size() {
    if (!this._sizes) {
      this._size = this._getSize();
    }
    return this._size;
  },
  get sizes() {
    if (!this._sizes) {
      this._sizes = this._getSizes();
    }
    return this._sizes;
  },
  get subStrokes() {
    if (!this._subStrokes) {
      this._subStrokes = this._getSubStrokes();
    }
    return this._subStrokes;
  },
};

// more methods

FXGlyph.prototype._getBBox = function(glyph) {
  var bboxes = glyph.strokes.map(function(stroke) {
    return new BoundingBox(stroke);
  });
  return new BoundingBox(bboxes);
};

FXGlyph.getScaledStrokes = function(strokes, bboxFrom, bboxTo) {
  var scaler = new BoxTransformer(bboxFrom, bboxTo);

  var oStrokes = strokes.map(function(stroke) {
    var points = stroke.map(function(xy) {
      return {
        x: scaler.x(xy.x),
        y: scaler.y(xy.y)
      };
    });
    return new Stroke(points);
  });
  return oStrokes;
};

FXGlyph.prototype._getSizes = function() {
  return this.unitScaledStrokes.map(function(stroke) {
    return stroke.size;
  });
};

FXGlyph.prototype._getSize = function() {
  return this.sizes.reduce(function(tot, size) {
    return tot + size;
  }, 0);
};

FXGlyph.prototype._getSubStrokes = function() {
  var allSubStrokes = [];
  this.unitScaledStrokes.forEach(function(stroke) {
    var subStrokes = stroke.subStrokes;
    subStrokes.forEach(function(subStroke) {
      allSubStrokes.push(subStroke);
    });
  });
  return allSubStrokes;
};

// export

module.exports = FXGlyph;
