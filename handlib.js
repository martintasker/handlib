(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.handlib = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports.Glyph = require('./lib/glyph');
module.exports.GlyphBuilder = require('./lib/glyph-builder');
module.exports.FXGlyph = require('./lib/fx-glyph');

},{"./lib/fx-glyph":2,"./lib/glyph":4,"./lib/glyph-builder":3}],2:[function(require,module,exports){
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
  return allSubStrokes;
}

// export

module.exports = FXGlyph;

},{"./glyph":4,"./stroke":5}],3:[function(require,module,exports){
'use strict';

var Glyph = require('./glyph');

var GlyphBuilder = function() {
  Glyph.call(this);
  this.strokeInProgress = false;
};

GlyphBuilder.prototype = Object.create(Glyph.prototype);
GlyphBuilder.prototype.constructor = GlyphBuilder;

// implementation -- methods
GlyphBuilder.prototype.setDevice = function(device) {
  this.device = device;
}

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
    strokes: this.strokes,
    device: this.device,
  });
};

module.exports = GlyphBuilder;

},{"./glyph":4}],4:[function(require,module,exports){
'use strict';

var Glyph = function(spec) {
  this.id = (spec && spec.id) || "";
  this.device = (spec && spec.device) || "";
  this.strokes = (spec && spec.strokes && normalizeStrokes(spec.strokes)) || [];
};

function normalizeStrokes(strokesSpec) {
  return strokesSpec.map(function(strokeSpec) {
    if (typeof strokeSpec !== 'object') {
      throw 'bad stroke spec: must be object';
    }
    if (typeof strokeSpec[0] === 'number') {
      var stroke = [];
      for (var i = 0; i < strokeSpec.length; i += 2) {
        stroke.push({
          x: strokeSpec[i],
          y: strokeSpec[i + 1]
        });
      }
      return stroke;
    } else if (typeof strokeSpec[0] === 'object') {
      return strokeSpec;
    } else {
      throw 'bad stroke spec: first must be number or (x,y) pair';
    }
  });
}

module.exports = Glyph;

},{}],5:[function(require,module,exports){
'use strict';

var Stroke = function(points) {
  this._points = points;
};

// getters
Stroke.prototype = {
  get points() {
    return this._points;
  },
  get size() {
    if (typeof this._size === 'undefined') {
      this._size = this._calculateSize();
    }
    return this._size;
  },
  get subStrokes() {
    if (!this._subStrokes) {
      this._subStrokes = this._getSubStrokes();
    }
    return this._subStrokes;
  },
};

Stroke.prototype._calculateSize = function() {
  var s = 0;
  var x = this.points[0].x;
  var y = this.points[0].y;
  for (var i = 1; i < this.points.length; i++) {
    var nx = this.points[i].x;
    var ny = this.points[i].y;
    var dx = nx - x;
    var dy = ny - y;
    var ds = Math.sqrt(dx * dx + dy * dy);
    s += ds;
    x = nx;
    y = ny;
  }
  return s;
};

Stroke.prototype._getSubStrokes = function() {
  if (this.points.length <= 2) {
    return [new Stroke(this.points)];
  }

  var increments = [];
  for (var i = 1; i < this.points.length; i++) {
    var dx = this.points[i].x - this.points[i - 1].x;
    var dy = this.points[i].y - this.points[i - 1].y;
    increments.push({
      dx: dx,
      dy: dy
    });
  }

  var breakPoints = [];
  for (var i = 1; i < increments.length; i++) {
    var i1 = increments[i - 1];
    var i2 = increments[i];
    var modi1 = Math.sqrt(i1.dx * i1.dx + i1.dy * i1.dy);
    var modi2 = Math.sqrt(i2.dx * i2.dx + i2.dy * i2.dy);
    var dot12 = i1.dx * i2.dx + i1.dy * i2.dy;
    var cosTheta = dot12 / (modi1 * modi2);
    if (cosTheta < -0.1) {
      breakPoints.push(i);
    }
  }
  breakPoints.push(this.points.length - 1);

  var subStrokes = [];

  function addSubStroke(startIndex, endIndex) {
    var points = [];
    for (var i = startIndex; i <= endIndex; i++) {
      points.push(this.points[i]);
    }
    subStrokes.push(new Stroke(points));
  }

  var startIndex = 0;
  var breakPointIndex = 0;
  while (breakPointIndex < breakPoints.length) {
    var endIndex = breakPoints[breakPointIndex];
    addSubStroke.call(this, startIndex, endIndex);
    startIndex = endIndex;
    breakPointIndex++;
  }

  return subStrokes;
}

// export

module.exports = Stroke;

},{}]},{},[1])(1)
});