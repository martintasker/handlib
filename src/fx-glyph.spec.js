'use strict';

/* jshint jasmine: true */

var handlib = require('./index');
var GLYPH_TEST_DATA = require('./glyph.mock.js');
var Stroke = require('./stroke');

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
      expect(Object.keys(that.subStrokes[0].stroke)).toEqual(['_points', '_scale']);
      expect(Object.keys(that.subStrokes[0].stroke.points[0])).toEqual(['x', 'y']);
      expect(that.subStrokes[0].stroke.points.length).toEqual(that.unitScaledStrokes[0].sStroke.length);
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
    it('calculates signature correctly', function() {
      expect(that.signature).toEqual('stroke:stroke:stroke');
    });
    it('has the right feature vector length', function() {
      expect(that.featureVector.length).toEqual(Stroke.PC_DOT_COUNT * 2 * 3);
    });
    it('has credible feature vector components', function() {
      var fv = that.featureVector;
      expect(fv[0]).toEqual(0);
      expect(fv[fv.length - 2]).toBeCloseTo(1 / Math.sqrt(3 * Stroke.PC_DOT_COUNT), 3);
      expect(fv[fv.length - 1]).toBeCloseTo(0.5 / Math.sqrt(3 * Stroke.PC_DOT_COUNT), 3);
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
      expect(that.subStrokes[0].stroke.size).toBeCloseTo(Math.sqrt(1.25), 3);
      expect(that.subStrokes[1].stroke.size).toBeCloseTo(Math.sqrt(1.25), 3);
      expect(that.subStrokes[2].stroke.size).toBeCloseTo(0.5, 3);
    });
    it('calculates signature correctly', function() {
      expect(that.signature).toEqual('start:end:stroke');
    });
    it('has the right feature vector length', function() {
      expect(that.featureVector.length).toEqual(Stroke.PC_DOT_COUNT * 2 * 3);
    });
    it('has credible feature vector components', function() {
      var fv = that.featureVector;
      expect(fv[0]).toEqual(0);
      expect(fv[Stroke.PC_DOT_COUNT * 2 * 2 - 2]).toBeCloseTo(1 / Math.sqrt(3 * Stroke.PC_DOT_COUNT), 3);
      expect(fv[Stroke.PC_DOT_COUNT * 2 * 2 - 1]).toBeCloseTo(1 / Math.sqrt(3 * Stroke.PC_DOT_COUNT), 3);
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
      expect(that.subStrokes[1].stroke.size).toEqual(0);
    });
    it('calculates unitScaledStrokes correctly', function() {
      expect(that.unitScaledStrokes[0].points[0].x).toEqual(0.35);
      expect(that.unitScaledStrokes[0].points[0].y).toEqual(0.5);
      expect(that.unitScaledStrokes[0].points[3].x).toEqual(0.65);
      expect(that.unitScaledStrokes[0].points[3].y).toEqual(1);
    });
    it('calculates signature correctly', function() {
      expect(that.signature).toEqual('stroke:mark');
    });
    it('has the right feature vector length', function() {
      expect(that.featureVector.length).toEqual(Stroke.PC_DOT_COUNT * 2 + 2);
    });
    it('has credible feature vector components', function() {
      var fv = that.featureVector;
      expect(fv[fv.length - 3]).toBeCloseTo(1 / Math.sqrt(2 * Stroke.PC_DOT_COUNT), 3);
      expect(fv[fv.length - 2]).toBeCloseTo(0.35 / Math.sqrt(2), 3);
      expect(fv[fv.length - 1]).toEqual(0);
    });
  });
});

// feature vector tests
describe('FXGlyph i', function() {

  // test instance
  var those;

  beforeEach(function() {
    var names = ['star', 'A', 'i'];
    those = names.map(function(name) {
      return new handlib.Glyph({
        strokes: GLYPH_TEST_DATA[name],
        scale: 100,
      });
    }).map(function(glyph) {
      return new handlib.FXGlyph(glyph);
    });
  });

  describe('feature vector raw', function() {
    it('works trivially', function() {
      expect(handlib.FXGlyph.euclideanDistance([0, 0], [1, 1])).toBeCloseTo(Math.sqrt(2), 3);
      expect(handlib.FXGlyph.euclideanDistance([0, 0], [3, 4])).toEqual(5);
    });
    it('fails when given silly arguments', function() {
      expect(function() {
        var d = handlib.FXGlyph.euclideanDistance([0, 0, 0], [1, 1]);
      }).toThrow();
    });
  });

  describe('glyph comparison', function() {
    it('gives zero when comparing identical glyphs', function() {
      those.forEach(function(fxGlyph) {
        expect(fxGlyph.distanceFrom(fxGlyph)).toEqual(0);
      });
    });
    it('gives greater than zero and less than 1 when comparing compatible non-identical glyphs', function() {
      for (var i = 0; i < those.length; i++) {
        for (var j = 0; j < i; j++) {
          if (those[i].featureVector.length !== those[j].featureVector.length) {
            continue;
          }
          expect(those[i].distanceFrom(those[j])).toBeGreaterThan(0);
          expect(those[i].distanceFrom(those[j])).toBeLessThan(1);
        }
      }
    });
  });
});
