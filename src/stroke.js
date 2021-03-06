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
  var CUSP_COS = -0.1;
  for (i = 1; i < increments.length; i++) {
    var i1 = increments[i - 1];
    var i2 = increments[i];
    var dot12 = i1.dx * i2.dx + i1.dy * i2.dy;
    var cosTheta = dot12 / (this.ds * this.ds);
    if (cosTheta < CUSP_COS) {
      breakPoints.push(i);
    } else if (i + 1 < increments.length) {
      var i3 = increments[i+1];
      var cross12 = i1.dx * i2.dy - i1.dy * i2.dx;
      var cross23 = i2.dx * i3.dy - i2.dy * i3.dx;
      if (cross12 * cross23 > 0) {
        var dot13 = i1.dx * i3.dx + i1.dy * i3.dy;
        cosTheta = dot13 / (this.ds * this.ds);
        if (cosTheta < CUSP_COS) {
          i += 1;
          breakPoints.push(i);
        }
      }
    }
  }
  breakPoints.push(this.sStroke.length - 1);

  var subStrokes = [];
  var sizes = [];

  function addSubStroke(strokePoints, startIndex, endIndex) {
    /* jshint validthis: true */
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
  if (st.length !== xt.length) {
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
