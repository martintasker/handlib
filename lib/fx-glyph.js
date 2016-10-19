'use strict';

var Glyph = require('./glyph');
var GlyphFeatures = require('./glyph-features');

var FXGlyph = function(glyph) {
  this._glyph = glyph;
};

// getters
FXGlyph.prototype = {
  get glyph() {
    return this._glyph;
  },
  get id() {
    return this._glyph.id;
  },
  get bbox() {
    if (!this._bbox) {
      this._bbox = this.getBBox(this._glyph);
    }
    return this._bbox;
  },
  get strokes() {
    return this._glyph.strokes;
  },
  get unitScaledStrokes() {
    if (!this._unitScaledStrokes) {
      this._unitScaledStrokes = FXGlyph.getScaledStrokes(this.strokes, this.bbox, 1);
    }
    return this._unitScaledStrokes;
  },
  get subStrokes() {
    if (!this._features) {
      this._features = new GlyphFeatures(this._glyph);
    }
    return this._features.subStrokes;
  },
  get size() {
    if (!this._sizes) {
      this.calculateSizes();
    }
    return this._size;
  },
  get sizes() {
    if (!this._sizes) {
      this.calculateSizes();
    }
    return this._sizes;
  },
};

// more methods

FXGlyph.prototype.getBBox = function(glyph) {
  var xy0 = glyph.strokes[0][0];
  var bbox = {
    top: xy0.y,
    bottom: xy0.y,
    left: xy0.x,
    right: xy0.x,
  };
  glyph.strokes.forEach(function(stroke) {
    stroke.forEach(function(xy) {
      if (xy.x < bbox.left) {
        bbox.left = xy.x;
      } else if (xy.x > bbox.right) {
        bbox.right = xy.x;
      }
      if (xy.y < bbox.top) {
        bbox.top = xy.y;
      } else if (xy.y > bbox.bottom) {
        bbox.bottom = xy.y;
      }
    });
  });
  return bbox;
};

FXGlyph.prototype.calculateSizes = function() {
  this._sizes = this.unitScaledStrokes.map(function(stroke) {
    var s = 0;
    var x = stroke[0].x;
    var y = stroke[0].y;
    for (var i = 1; i < stroke.length; i++) {
      var nx = stroke[i].x;
      var ny = stroke[i].y;
      var dx = nx - x;
      var dy = ny - y;
      var ds = Math.sqrt(dx * dx + dy * dy);
      s += ds;
      x = nx;
      y = ny;
    }
    return s;
  });
  this._size = this._sizes.reduce(function(tot, size) {
    return tot + size;
  }, 0);
};

FXGlyph.getScaledStrokes = function(strokes, bbox, scale) {
  if (typeof scale === 'undefined') {
    scale = 1;
  }

  var xScale = 1;
  if (bbox.right > bbox.left) {
    xScale = 1 / (bbox.right - bbox.left);
  }
  var yScale = 1;
  if (bbox.bottom > bbox.top) {
    yScale = 1 / (bbox.bottom - bbox.top);
  }
  var xyScale = Math.min(xScale, yScale);

  var xMid = 0.5 * (bbox.left + bbox.right);
  var yMid = 0.5 * (bbox.top + bbox.bottom);

  function cx(x) {
    return scale * (0.5 + (x - xMid) * xyScale);
  }

  function cy(y) {
    return scale * (0.5 + (y - yMid) * xyScale);
  }

  var oStrokes = strokes.map(function(stroke) {
    return stroke.map(function(xy) {
      return {
        x: cx(xy.x),
        y: cy(xy.y)
      };
    });
  });
  return oStrokes;
};

// export

module.exports = FXGlyph;
