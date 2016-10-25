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
  this._scale = glyph.scale;
};

// getters
FXGlyph.prototype = {
  get glyph() {
    return this._glyph;
  },
  get scale() {
    return this._scale;
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
  get signature() {
    if (!this._signature) {
      this._signature = this._getSignature();
    }
    return this._signature;
  },
  get featureVector() {
    if (!this._featureVector) {
      this._featureVector = this._getFeatureVector();
    }
    return this._featureVector;
  }
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
  var scale = Math.min(bboxTo.right - bboxTo.left, bboxTo.bottom - bboxTo.top);

  var oStrokes = strokes.map(function(stroke) {
    var points = stroke.map(function(xy) {
      return {
        x: scaler.x(xy.x),
        y: scaler.y(xy.y)
      };
    });
    return new Stroke(points, scale);
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

FXGlyph.prototype._getSignature = function() {
  return this.subStrokes.map(function(subStroke) {
      return subStroke.type;
    })
    .join(':');
};

FXGlyph.prototype._getFeatureVector = function() {
  var fv = [];
  var ssnf = 1 / Math.sqrt(Stroke.PC_DOT_COUNT);
  var snf = 1 / Math.sqrt(this.subStrokes.length);
  this.subStrokes.forEach(function(subStroke) {
    if (subStroke.type === 'mark') {
      var pcDot = subStroke.pcDots[0];
      fv.push(pcDot.x * snf);
      fv.push(pcDot.y * snf);
    } else {
      subStroke.pcDots.forEach(function(pcDot) {
        fv.push(pcDot.x * snf * ssnf);
        fv.push(pcDot.y * snf * ssnf);
      });
    }
  });
  return fv;
};

// export

module.exports = FXGlyph;
