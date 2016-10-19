'use strict';

var Glyph = require('./glyph');
var Stroke = require('./stroke');

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
      this._bbox = this._getBBox(this._glyph);
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
    var points = stroke.map(function(xy) {
      return {
        x: cx(xy.x),
        y: cy(xy.y)
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
  allSubStrokes.forEach(function(subStroke) {
    calculateSubstrokeSize(subStroke);
  });
  var subStrokeDescriptions = allSubStrokes.map(function(subStroke) {
    return {
      points: subStroke,
      size: subStroke[subStroke.length - 1].s,
    };
  });
  return subStrokeDescriptions;
}

function calculateSubstrokeSize(subStroke) {
  var s = 0;
  var i = 0;
  for (i = 0; i < subStroke.length - 1; i++) {
    var x0 = subStroke[i].x;
    var y0 = subStroke[i].y;
    var x1 = subStroke[i + 1].x;
    var y1 = subStroke[i + 1].y;
    var dx = x1 - x0;
    var dy = y1 - y0;
    var ds = Math.sqrt(dx * dx + dy * dy);
    subStroke[i].s = s;
    subStroke[i].ds = ds;
    s += ds;
  }
  subStroke[i].s = s;
}

// export

module.exports = FXGlyph;
