'use strict';

/* jshint jasmine: true */

var handlib = require('../index');
var GLYPH_TEST_DATA = require('./glyph.mock.js');

describe('Stroke basic', function() {

  // test instance
  var glyph;
  var fxglyph;
  var that;

  beforeEach(function() {
    glyph = new handlib.Glyph({
      id: "test-*",
      strokes: GLYPH_TEST_DATA.star,
    });
    fxglyph = new handlib.FXGlyph(glyph);
    that = fxglyph.unitScaledStrokes[0];
  });

  describe('initialization', function() {
    it('has public interface', function() {
      expect(typeof that.points).toEqual('object');
      expect(typeof that.size).toEqual('number');
    });
    it('has correct initial values', function() {
      expect(that.points.length).toEqual(glyph.strokes[0].length);
      expect(that.size).toBeCloseTo(Math.sqrt(2), 3);
    });
    // it('has one substroke', function() {
    //   expect(that.subStrokes.length).toEqual(3);
    // });
  });
});

// interesting because one stroke has substrokes
describe('FXGlyph A', function() {

  // test instance
  var glyph;
  var fxglyph;
  var that;

  beforeEach(function() {
    glyph = new handlib.Glyph({
      strokes: GLYPH_TEST_DATA.A,
    });
    fxglyph = new handlib.FXGlyph(glyph);
    that = fxglyph.unitScaledStrokes[0];
  });

  describe('extraction', function() {
    it('has correct initial values', function() {
      expect(that.points.length).toEqual(glyph.strokes[0].length);
      expect(that.size).toBeCloseTo(2*Math.sqrt(1.25), 3);
    });
    it('has two substrokes', function() {
      expect(that.subStrokes.length).toEqual(2);
    });
    it('has credible sizes', function() {
      expect(that.size).toBeGreaterThan(2);
      // expect(that.subStrokes[0].size).toBeCloseTo(Math.sqrt(1.25), 3);
      // expect(that.subStrokes[1].size).toBeCloseTo(Math.sqrt(1.25), 3);
    });
  });
});

// interesting because one stroke is a single dot
describe('FXGlyph i', function() {

  // test instance
  var glyph;
  var fxglyph;
  var that;

  beforeEach(function() {
    glyph = new handlib.Glyph({
      strokes: GLYPH_TEST_DATA.i,
    });
    fxglyph = new handlib.FXGlyph(glyph);
    that = fxglyph.unitScaledStrokes[1];
  });

  describe('extraction', function() {
    it('has correct initial values', function() {
      expect(that.points.length).toEqual(glyph.strokes[1].length);
      expect(that.size).toBeCloseTo(0, 3);
    });
    it('has one substroke', function() {
      expect(that.subStrokes.length).toEqual(1);
    });
  });
});
