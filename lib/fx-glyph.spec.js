'use strict';

var handlib = require('../index');
var GLYPH_TEST_DATA = require('./glyph.mock.js');

describe('FXGlyph basic', function() {

  // test instance
  var glyph;
  var that;

  beforeEach(function() {
    var glyphBuilder = new handlib.GlyphBuilder();
    GLYPH_TEST_DATA.star.forEach(function(stroke) {
      stroke.forEach(function(point) {
        glyphBuilder.addPoint(point);
      });
      glyphBuilder.endStroke();
    });
    glyph = glyphBuilder.getGlyph();
    glyph.id = "test-*";
    that = new handlib.FXGlyph(glyph);
  });

  describe('initialization', function() {
    it('has public interface', function() {
      expect(typeof that.glyph).toEqual('object');
      expect(typeof that.id).toEqual('string');
      expect(typeof that.bbox).toEqual('object');
      expect(typeof that.strokes).toEqual('object');
      expect(typeof that.subStrokes).toEqual('object');
      expect(typeof that.size).toEqual('number');
    });
    it('has correct initial values', function() {
      expect(that.glyph).toEqual(glyph);
      expect(that.id).toEqual("test-*");
      expect(that.subStrokes.length).toEqual(glyph.strokes.length);
      expect(Object.keys(that.subStrokes[0])).toEqual(['points', 'size']);
      expect(Object.keys(that.subStrokes[0].points[0])).toEqual(['x', 'y', 's', 'ds']);
      expect(Object.keys(that.subStrokes[0].points[1])).toEqual(['x', 'y', 's']);
      expect(that.subStrokes[0].points.length).toEqual(glyph.strokes[0].length);
      expect(Object.keys(that.bbox).length).toEqual(4);
      expect(that.size).toBeGreaterThan(0);
    });
    it('accumulates size correctly', function() {
      expect(that.size).toBeCloseTo(2 * Math.sqrt(2) * 100 + 100, 3);
      var size = that.subStrokes.reduce(function(previous, subStroke) {
        var lastPoint = subStroke.points[subStroke.points.length - 1];
        return lastPoint.s + previous;
      }, 0);
      expect(that.size).toBeCloseTo(size, 3);
    });
    it('calculates bbox correctly', function() {
      expect(that.bbox.top).toEqual(0);
      expect(that.bbox.left).toEqual(0);
      expect(that.bbox.bottom).toEqual(100);
      expect(that.bbox.right).toEqual(100);
    });
  });
});

// interesting because one stroke has substrokes
describe('FXGlyph A', function() {

  // test instance
  var glyph;
  var that;

  beforeEach(function() {
    var glyphBuilder = new handlib.GlyphBuilder();
    GLYPH_TEST_DATA.A.forEach(function(stroke) {
      stroke.forEach(function(point) {
        glyphBuilder.addPoint(point);
      });
      glyphBuilder.endStroke();
    });
    glyph = glyphBuilder.getGlyph();
    that = new handlib.FXGlyph(glyph);
  });

  describe('extraction', function() {
    it('has glyph and bbox correctly', function() {
      expect(that.glyph).toEqual(glyph);
      expect(that.bbox.top).toEqual(0);
      expect(that.bbox.left).toEqual(0);
      expect(that.bbox.bottom).toEqual(100);
      expect(that.bbox.right).toEqual(100);
    });
    it('has three substrokes', function() {
      expect(that.subStrokes.length).toEqual(3);
    });
    it('has credible size', function() {
      expect(that.size).toBeGreaterThan(250);
    });
  });
});

// interesting because one stroke is a single dot
describe('FXGlyph i', function() {

  // test instance
  var glyph;
  var that;

  beforeEach(function() {
    var glyphBuilder = new handlib.GlyphBuilder();
    GLYPH_TEST_DATA.i.forEach(function(stroke) {
      stroke.forEach(function(point) {
        glyphBuilder.addPoint(point);
      });
      glyphBuilder.endStroke();
    });
    glyph = glyphBuilder.getGlyph();
    that = new handlib.FXGlyph(glyph);
  });

  describe('extraction', function() {
    it('has glyph correctly', function() {
      expect(that.glyph).toEqual(glyph);
    });
    it('has two substrokes', function() {
      expect(that.subStrokes.length).toEqual(2);
    });
    it('has credible size', function() {
      expect(that.size).toBeLessThan(100);
    });
    it('does the dot correctly', function() {
      expect(Object.keys(that.subStrokes[1].points[0])).toEqual(['x', 'y', 's']);
    });
  });
});