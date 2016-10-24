'use strict';

/* jshint jasmine: true */

var handlib = require('../index');
var GLYPH_TEST_DATA = require('./glyph.mock.js');

describe('FXGlyph basic', function() {

  // test instance
  var glyph;
  var that;

  beforeEach(function() {
    glyph = new handlib.Glyph({
      id: "test-*",
      strokes: GLYPH_TEST_DATA.star,
      device: "mouse",
      scale: 100,
    });
    that = new handlib.FXGlyph(glyph);
  });

  describe('initialization', function() {
    it('has public interface', function() {
      expect(typeof that.glyph).toEqual('object');
      expect(typeof that.id).toEqual('string');
      expect(typeof that.device).toEqual('string');
      expect(typeof that.bbox).toEqual('object');
      expect(typeof that.strokes).toEqual('object');
      expect(typeof that.subStrokes).toEqual('object');
      expect(typeof that.size).toEqual('number');
    });
    it('has correct initial values', function() {
      expect(that.glyph).toEqual(glyph);
      expect(that.id).toEqual("test-*");
      expect(that.device).toEqual("mouse");
      expect(that.subStrokes.length).toEqual(glyph.strokes.length);
      expect(Object.keys(that.subStrokes[0])).toEqual(['_points', '_scale']);
      expect(Object.keys(that.subStrokes[0].points[0])).toEqual(['x', 'y']);
      expect(that.subStrokes[0].points.length).toEqual(glyph.strokes[0].length);
      expect(Object.keys(that.bbox).length).toEqual(4);
      expect(that.size).toBeGreaterThan(0);
    });
    it('accumulates size correctly', function() {
      expect(that.size).toBeCloseTo(2 * Math.sqrt(2) + 1, 3);
      expect(that.sizes[0]).toBeCloseTo(Math.sqrt(2), 3);
      expect(that.sizes[1]).toBeCloseTo(Math.sqrt(2), 3);
      expect(that.sizes[2]).toEqual(1);
    });
    it('calculates bbox correctly', function() {
      expect(that.bbox.top).toEqual(0);
      expect(that.bbox.left).toEqual(0);
      expect(that.bbox.bottom).toEqual(100);
      expect(that.bbox.right).toEqual(100);
    });
    it('calculates unitScaledStrokes correctly', function() {
      expect(that.unitScaledStrokes[0].points[0].x).toEqual(0);
      expect(that.unitScaledStrokes[0].points[1].x).toEqual(1);
      expect(that.unitScaledStrokes[0].points[0].y).toEqual(0);
      expect(that.unitScaledStrokes[0].points[1].y).toEqual(1);
      expect(that.unitScaledStrokes[0].scale).toEqual(1);
    });
  });
});

// interesting because one stroke has substrokes
describe('FXGlyph A', function() {

  // test instance
  var glyph;
  var that;

  beforeEach(function() {
    glyph = new handlib.Glyph({
      strokes: GLYPH_TEST_DATA.A,
      scale: 100,
    });
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
    it('has no device or ID', function() {
      expect(that.id).toEqual("");
      expect(that.device).toEqual("");
    });
    it('has three substrokes', function() {
      expect(that.subStrokes.length).toEqual(3);
    });
    it('has credible sizes', function() {
      expect(that.size).toBeGreaterThan(2.5);
      expect(that.subStrokes[0].size).toBeCloseTo(Math.sqrt(1.25), 3);
      expect(that.subStrokes[1].size).toBeCloseTo(Math.sqrt(1.25), 3);
      expect(that.subStrokes[2].size).toBeCloseTo(0.5, 3);
    });
  });
});

// interesting because one stroke is a single dot
describe('FXGlyph i', function() {

  // test instance
  var glyph;
  var that;

  beforeEach(function() {
    glyph = new handlib.Glyph({
      strokes: GLYPH_TEST_DATA.i,
      scale: 100,
    });
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
      expect(that.size).toBeLessThan(1);
    });
    it('does the dot correctly', function() {
      expect(that.subStrokes[1].size).toEqual(0);
    });
    it('calculates unitScaledStrokes correctly', function() {
      expect(that.unitScaledStrokes[0].points[0].x).toEqual(0.35);
      expect(that.unitScaledStrokes[0].points[0].y).toEqual(0.5);
      expect(that.unitScaledStrokes[0].points[3].x).toEqual(0.65);
      expect(that.unitScaledStrokes[0].points[3].y).toEqual(1);
    });
  });
});
