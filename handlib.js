(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.handlib = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports.Glyph = require('./lib/glyph');
module.exports.GlyphFeatures = require('./lib/glyph-features');

},{"./lib/glyph":3,"./lib/glyph-features":2}],2:[function(require,module,exports){
'use strict';

var Glyph = require('./glyph');

var GlyphFeatures = function(glyph) {

  // public API and instance variables
  var self = this;
  self.glyph = glyph;

  self.bbox = getBoundingBox(self.glyph);
  self.subStrokes = getGlyphSubStrokes(self.glyph);
  self.size = getSubStrokeSizes(self.subStrokes);

  function getBoundingBox(glyph) {
    return glyph.bbox;
  }

  function getGlyphSubStrokes(glyph) {
    var res = [];
    glyph.strokes.forEach(function(stroke) {
      var subStrokes = getStrokeSubStrokes(stroke);
      subStrokes.forEach(function(subStroke) {
        res.push(subStroke);
      });
    });
    return res;
  }

  function getStrokeSubStrokes(stroke) {
    if (stroke.length <= 2) {
      return [{
        points: stroke
      }];
    }

    var increments = [];
    for (var i = 1; i < stroke.length; i++) {
      var dx = stroke[i].x - stroke[i - 1].x;
      var dy = stroke[i].y - stroke[i - 1].y;
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
    breakPoints.push(stroke.length - 1);

    var subStrokes = [];

    function addSubStroke(startIndex, endIndex) {
      var subStroke = [];
      for (var i = startIndex; i <= endIndex; i++) {
        subStroke.push(stroke[i]);
      }
      subStrokes.push({
        points: subStroke
      });
    }

    var startIndex = 0;
    var breakPointIndex = 0;
    while (breakPointIndex < breakPoints.length) {
      var endIndex = breakPoints[breakPointIndex];
      addSubStroke(startIndex, endIndex);
      startIndex = endIndex;
      breakPointIndex++;
    }

    return subStrokes;
  }

  function getSubStrokeSizes(subStrokes) {
    var size = subStrokes.reduce(function(previousSize, subStroke) {
      return subStrokeSize(subStroke) + previousSize;
    }, 0);
    return size;
  }

  function subStrokeSize(subStroke) {
    var s = 0;
    var i = 0;
    for (i = 0; i < subStroke.points.length - 1; i++) {
      var x0 = subStroke.points[i].x;
      var y0 = subStroke.points[i].y;
      var x1 = subStroke.points[i + 1].x;
      var y1 = subStroke.points[i + 1].y;
      var dx = x1 - x0;
      var dy = y1 - y0;
      var ds = Math.sqrt(dx * dx + dy * dy);
      subStroke.points[i].s = s;
      subStroke.points[i].ds = ds;
      s += ds;
    }
    subStroke.points[i].s = s;
    subStroke.size = s;
    return subStroke.size;
  }
};

module.exports = GlyphFeatures;

},{"./glyph":3}],3:[function(require,module,exports){
'use strict';

var Glyph = function() {

  // public API and instance variables
  var self = this;
  self.strokes = [];
  self.bbox = undefined;

  self.strokeInProgress = false;
};

// implementation -- methods
Glyph.prototype.addPoint = function(xy) {
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

  if (!self.bbox) {
    self.bbox = {
      top: xy.y,
      bottom: xy.y,
      left: xy.x,
      right: xy.x
    };
  } else {
    if (xy.x < self.bbox.left) {
      self.bbox.left = xy.x;
    } else if (xy.x > self.bbox.right) {
      self.bbox.right = xy.x;
    }
    if (xy.y < self.bbox.top) {
      self.bbox.top = xy.y;
    } else if (xy.y > self.bbox.bottom) {
      self.bbox.bottom = xy.y;
    }
  }
};

Glyph.prototype.endStroke = function() {
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

Glyph.prototype.getScaled = function(scale) {
  var self = this;

  var xScale = 0;
  if (self.bbox.right > self.bbox.left) {
    xScale = scale / (self.bbox.right - self.bbox.left);
  }
  var x0 = - self.bbox.left * scale;
  var yScale = 0;
  if (self.bbox.bottom > self.bbox.top) {
    yScale = scale / (self.bbox.bottom - self.bbox.top);
  }
  var y0 = - self.bbox.top * scale;

  var that = new Glyph();
  self.strokes.forEach(function(stroke) {
    stroke.forEach(function(xy) {
      var x = xy.x * xScale + x0;
      var y = xy.y * yScale + y0;
      that.addPoint({x: x, y: y});
    });
    that.endStroke();
  });
  return that;
};

Glyph.prototype.getUnitScaled = function() {
  return this.getScaled(1.0);
};

module.exports = Glyph;

},{}]},{},[1])(1)
});