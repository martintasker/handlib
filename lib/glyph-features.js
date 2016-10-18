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
        subStroke.push({
          x: stroke[i].x,
          y: stroke[i].y
        });
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
