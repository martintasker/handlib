(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports.Glyph = __webpack_require__(1);
	module.exports.GlyphBuilder = __webpack_require__(2);
	module.exports.FXGlyph = __webpack_require__(3);
	module.exports.BoundingBox = __webpack_require__(5);
	module.exports.BoxTransformer = __webpack_require__(6);


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Glyph = __webpack_require__(1);

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* jshint jasmine: true */

	var Stroke = __webpack_require__(4);
	var BoundingBox = __webpack_require__(5);
	var BoxTransformer = __webpack_require__(6);

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

	FXGlyph.prototype.distanceFrom = function(that) {
	  return FXGlyph.euclideanDistance(this.featureVector, that.featureVector);
	};

	FXGlyph.euclideanDistance = function(fv1, fv2) {
	  if (fv1.length !== fv2.length) {
	    throw 'feature vectors must be same length';
	  }
	  var d2 = 0;
	  for (var i = 0; i < fv1.length; ++i) {
	    var d = fv1[i] - fv2[i];
	    d2 += d * d;
	  }
	  return Math.sqrt(d2);
	};

	// export

	module.exports = FXGlyph;


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var Stroke = function(points, scale) {
	  this._points = points;
	  this._scale = scale;
	};

	Stroke.DS_UNIT_DEFAULT = 0.05;
	Stroke.PC_DOT_COUNT = 9;

	Stroke.getEqualSamples = getEqualSamples;

	// getters
	Stroke.prototype = {
	  get points() {
	    return this._points;
	  },
	  get scale() {
	    return this._scale;
	  },
	  get size() {
	    if (typeof this._size === 'undefined') {
	      this._size = this._calculateSize();
	    }
	    return this._size;
	  },
	  get ds() {
	    if (typeof this._dS === 'undefined') {
	      this._ds = this._getDS();
	    }
	    return this._ds;
	  },
	  get sList() {
	    if (typeof this._sList === 'undefined') {
	      this._sList = this._getSList();
	    }
	    return this._sList;
	  },
	  get sStroke() {
	    if (typeof this._sStroke === 'undefined') {
	      this._sStroke = this._getSStroke();
	    }
	    return this._sStroke;
	  },
	  get subStrokes() {
	    if (!this._subStrokes) {
	      this._subStrokes = this._getSubStrokes();
	    }
	    return this._subStrokes;
	  },
	};

	Stroke.prototype._calculateSize = function() {
	  return this.sList[this.points.length - 1];
	};

	Stroke.prototype._getDS = function() {
	  var ds0 = this.scale * Stroke.DS_UNIT_DEFAULT;
	  var nIncrements = Math.floor(this.size / ds0);
	  var ds = ds0;
	  if (nIncrements > 0) {
	    ds = this.size / nIncrements;
	  }
	  return ds;
	};

	Stroke.prototype._getSList = function() {
	  var sList = [0];
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
	    sList.push(s);
	    x = nx;
	    y = ny;
	  }
	  return sList;
	};

	Stroke.prototype._getSStroke = function() {
	  var sList = this.sList;
	  var xList = this.points.map(function(point) {
	    return point.x;
	  });
	  var yList = this.points.map(function(point) {
	    return point.y;
	  });
	  var nSamples = 1 + Math.floor(this.size / this.ds + 0.1);
	  var xs = Stroke.getEqualSamples(xList, sList, nSamples);
	  var ys = Stroke.getEqualSamples(yList, sList, nSamples);
	  var stroke = [];
	  for (var i = 0; i < nSamples; i++) {
	    stroke.push({
	      x: xs[i],
	      y: ys[i]
	    });
	  }
	  return stroke;
	};

	Stroke.prototype._getSubStrokes = function() {
	  if (this.sStroke.length <= 2) {
	    return [{
	      type: 'mark',
	      stroke: new Stroke([this.points[0]], this.scale),
	      pcDots: [this.points[0]],
	    }];
	  }

	  var increments = [];
	  var i;
	  for (i = 1; i < this.sStroke.length; i++) {
	    var dx = this.sStroke[i].x - this.sStroke[i - 1].x;
	    var dy = this.sStroke[i].y - this.sStroke[i - 1].y;
	    increments.push({
	      dx: dx,
	      dy: dy
	    });
	  }

	  var breakPoints = [];
	  for (i = 1; i < increments.length; i++) {
	    var i1 = increments[i - 1];
	    var i2 = increments[i];
	    var dot12 = i1.dx * i2.dx + i1.dy * i2.dy;
	    var cosTheta = dot12 / (this.ds * this.ds);
	    if (cosTheta < -0.1) {
	      breakPoints.push(i);
	    }
	  }
	  breakPoints.push(this.sStroke.length - 1);

	  var subStrokes = [];
	  var sizes = [];

	  function addSubStroke(strokePoints, startIndex, endIndex) {
	    var points = [];
	    for (var i = startIndex; i <= endIndex; i++) {
	      points.push(strokePoints[i]);
	    }
	    subStrokes.push(new Stroke(points, this.scale));
	    sizes.push(this.ds * (endIndex + 1 - startIndex));
	  }

	  var startIndex = 0;
	  var breakPointIndex = 0;
	  while (breakPointIndex < breakPoints.length) {
	    var endIndex = breakPoints[breakPointIndex];
	    addSubStroke.call(this, this.sStroke, startIndex, endIndex);
	    startIndex = endIndex;
	    breakPointIndex++;
	  }

	  return subStrokes.map(function(subStroke, i) {
	    var start = i === 0;
	    var end = i === subStrokes.length - 1;
	    var type = start && end ? 'stroke' :
	      start && !end ? 'start' :
	      !start && end ? 'end' :
	      'middle';
	    var pcDots = getPCDots(subStroke.points, sizes[i]);
	    return {
	      type: type,
	      stroke: subStroke,
	      pcDots: pcDots,
	    };
	  });
	};

	function getEqualSamples(xt, st, n) {
	  if (st.length != xt.length) {
	    throw 'st.length must equal xt.length';
	  }
	  if (st[0] !== 0) {
	    throw 'st[0] must be equal to zero';
	  }
	  for (var i = 1; i <= st.length; i++) {
	    if (st[i] < st[i - 1]) {
	      throw 'st must increase monotonically';
	    }
	  }
	  if (n <= 0 || typeof n !== 'number') {
	    throw 'n must be number > 0';
	  }
	  var tmax = xt.length;
	  var smax = st[tmax - 1];
	  var sIncrement = smax / (tmax - 1);
	  var isInLess = 0;
	  var isInMore = 0;
	  var xOut = [];
	  for (var isOut = 0; isOut < n; isOut++) {
	    var s = smax * (isOut / (n - 1));
	    while (st[isInMore] < s && isInMore < st.length - 1) {
	      isInMore += 1;
	    }
	    isInLess = isInMore;
	    while (st[isInLess] > s && isInLess > 0) {
	      isInLess -= 1;
	    }
	    var sLE = st[isInLess];
	    var sGE = st[isInMore];
	    if (sLE === sGE) {
	      xOut.push(xt[isInLess]);
	      continue;
	    }
	    var sRange = sGE - sLE;
	    var xRange = xt[isInMore] - xt[isInLess];
	    var x0 = xt[isInLess];
	    xOut.push(x0 + xRange * (s - sLE) / sRange);
	  }
	  return xOut;
	}

	function getPCDots(sDots, size) {
	  var xIn = sDots.map(function(dot) {
	    return dot.x;
	  });
	  var yIn = sDots.map(function(dot) {
	    return dot.y;
	  });
	  var nIn = sDots.length;
	  var sIn = [];
	  for (var si = 0; si < nIn; si++) {
	    sIn.push(size * si / (nIn - 1));
	  }

	  var xOut = getEqualSamples(xIn, sIn, Stroke.PC_DOT_COUNT);
	  var yOut = getEqualSamples(yIn, sIn, Stroke.PC_DOT_COUNT);

	  var pcDots = [];
	  for (var i = 0; i < Stroke.PC_DOT_COUNT; i++) {
	    pcDots.push({
	      x: xOut[i],
	      y: yOut[i]
	    });
	  }
	  return pcDots;
	}

	// export

	module.exports = Stroke;


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ },
/* 6 */
/***/ function(module, exports) {

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


/***/ }
/******/ ])
});
;