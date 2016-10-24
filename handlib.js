(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.handlib = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports.Glyph = require('./lib/glyph');
module.exports.GlyphBuilder = require('./lib/glyph-builder');
module.exports.FXGlyph = require('./lib/fx-glyph');
module.exports.BoundingBox = require('./lib/bounding-box');
module.exports.BoxTransformer = require('./lib/box-transformer');

},{"./lib/bounding-box":2,"./lib/box-transformer":3,"./lib/fx-glyph":4,"./lib/glyph":6,"./lib/glyph-builder":5}],2:[function(require,module,exports){
'use strict';

var BoundingBox = function(a, b, c, d) {
  this.top = undefined;
  this.left = undefined;
  this.bottom = undefined;
  this.right = undefined;
  if (typeof a === 'number' && typeof b === 'number' && typeof c === 'number' && typeof d === 'number') {
    constructFromCoordinates.call(this, a, b, c, d); // x1, y1, x2, y2
  } else if (typeof a === 'object' && typeof a.top === 'number') {
    constructFromList.call(this, arguments); // args are series of BoundingBoxes or {top,left,bottom,right} specs
  } else if (typeof a === 'object' && typeof a.length === 'number' && a.length > 0) {
    constructFromList.call(this, a); // [ {x,y} | bbox, {x,y} | bbox ...]
  } else if (a === 'unit') {
    constructUnitBox.call(this);
  } else {
    throw 'unexpected BoundingBox parameters';
  }

  function constructFromCoordinates(x1, y1, x2, y2) {
    this.top = Math.min(y1, y2);
    this.left = Math.min(x1, x2);
    this.bottom = Math.max(y1, y2);
    this.right = Math.max(x1, x2);
  }

  function constructUnitBox() {
    this.top = 0;
    this.left = 0;
    this.bottom = 1;
    this.right = 1;
  }

  function constructFromList(items) {
    var item0 = items[0];
    if (typeof item0.top === 'number') {
      checkSpec(item0);
      this.top = item0.top;
      this.left = item0.left;
      this.right = item0.right;
      this.bottom = item0.bottom
    } else {
      this.top = this.bottom = item0.y;
      this.left = this.right = item0.x;
    }
    for (var i = 1; i < items.length; ++i) {
      var item = items[i];
      if (typeof item.top === 'number') {
        checkSpec(item);
        this.left = Math.min(this.left, item.left);
        this.right = Math.max(this.right, item.right);
        this.top = Math.min(this.top, item.top);
        this.bottom = Math.max(this.bottom, item.bottom);
      } else {
        this.left = Math.min(this.left, item.x);
        this.right = Math.max(this.right, item.x);
        this.top = Math.min(this.top, item.y);
        this.bottom = Math.max(this.bottom, item.y);
      }
    }

    function checkSpec(spec) {
      if (spec.top > spec.bottom || spec.left > spec.right) {
        throw 'invalid box: top > bottom or left > right';
      }
    }
  }
};

module.exports = BoundingBox;

},{}],3:[function(require,module,exports){
'use strict';

var BoxTransformer = function(fromBox, toBox, options) {
  this.fromBox = fromBox;
  this.toBox = toBox;
  this.x = x;
  this.y = y;
  this.options = {
    center: true,
    maintainAspectRatio: true
  };
  var self = this;
  Object.keys(options || {}).forEach(function(option) {
    self.options[option] = options[option];
  });

  var xInScale = this.fromBox.right - this.fromBox.left;
  if (xInScale === 0) {
    xInScale = 1
  }
  var yInScale = this.fromBox.bottom - this.fromBox.top;
  if (yInScale === 0) {
    yInScale = 1;
  }
  var xInAnchor = this.fromBox.left;
  var yInAnchor = this.fromBox.top;

  var xOutScale = this.toBox.right - this.toBox.left;
  var yOutScale = this.toBox.bottom - this.toBox.top;
  var xOutAnchor = this.toBox.left;
  var yOutAnchor = this.toBox.top;

  if (this.options.center) {
    xInAnchor = 0.5 * (this.fromBox.left + this.fromBox.right);
    yInAnchor = 0.5 * (this.fromBox.top + this.fromBox.bottom);
    xOutAnchor = 0.5 * (this.toBox.left + this.toBox.right);
    yOutAnchor = 0.5 * (this.toBox.top + this.toBox.bottom);
  }

  var xScale = xOutScale / xInScale;
  var yScale = yOutScale / yInScale;
  var minScale = Math.min(xScale, yScale);
  if (this.options.maintainAspectRatio) {
    xScale = minScale;
    yScale = minScale;
  }

  function x(xIn) {
    return (xIn - xInAnchor) * xScale + xOutAnchor;
  }

  function y(yIn) {
    return (yIn - yInAnchor) * yScale + yOutAnchor;
  }
};

module.exports = BoxTransformer;

},{}],4:[function(require,module,exports){
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

},{"./bounding-box":2,"./box-transformer":3,"./stroke":7}],5:[function(require,module,exports){
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
};

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

},{"./glyph":6}],6:[function(require,module,exports){
'use strict';

var Glyph = function(spec) {
  this.id = (spec && spec.id) || "";
  this.device = (spec && spec.device) || "";
  this.strokes = (spec && spec.strokes && normalizeStrokes(spec.strokes)) || [];
  this.scale = spec && spec.scale;
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

},{}],7:[function(require,module,exports){
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
  var i;
  for (i = 1; i < this.points.length; i++) {
    var dx = this.points[i].x - this.points[i - 1].x;
    var dy = this.points[i].y - this.points[i - 1].y;
    increments.push({
      dx: dx,
      dy: dy
    });
  }

  var breakPoints = [];
  for (i = 1; i < increments.length; i++) {
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

  function addSubStroke(strokePoints, startIndex, endIndex) {
    var points = [];
    for (var i = startIndex; i <= endIndex; i++) {
      points.push(strokePoints[i]);
    }
    subStrokes.push(new Stroke(points));
  }

  var startIndex = 0;
  var breakPointIndex = 0;
  while (breakPointIndex < breakPoints.length) {
    var endIndex = breakPoints[breakPointIndex];
    addSubStroke(this.points, startIndex, endIndex);
    startIndex = endIndex;
    breakPointIndex++;
  }

  return subStrokes;
};

// export

module.exports = Stroke;

},{}]},{},[1])(1)
});