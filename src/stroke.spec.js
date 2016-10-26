'use strict';

/* jshint jasmine: true */

var handlib = require('./index');
var Stroke = require('./stroke');
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
      scale: 100,
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
      expect(that.ds).toBeCloseTo(Math.sqrt(2) / Math.floor(Math.sqrt(2) / Stroke.DS_UNIT_DEFAULT), 3);
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
      scale: 100,
    });
    fxglyph = new handlib.FXGlyph(glyph);
    that = fxglyph.unitScaledStrokes[0];
  });

  describe('extraction', function() {
    it('has correct initial values', function() {
      expect(that.points.length).toEqual(glyph.strokes[0].length);
      expect(that.size).toBeCloseTo(2 * Math.sqrt(1.25), 3);
      expect(that.sList[0]).toEqual(0);
      expect(that.sList[1]).toBeCloseTo(Math.sqrt(1.25), 3);
      expect(that.sList[2]).toBeCloseTo(2 * Math.sqrt(1.25), 3);
    });
    it('has correct s-sample end-points', function() {
      expect(that.sStroke[0].x).toEqual(that.points[0].x);
      expect(that.sStroke[0].y).toEqual(that.points[0].y);
      var tLength = that.points.length;
      var sLength = that.sStroke.length;
      expect(that.sStroke[sLength - 1].x).toEqual(that.points[tLength - 1].x);
      expect(that.sStroke[sLength - 1].y).toEqual(that.points[tLength - 1].y);
    });
    it('has credible s-sample inter-point distances', function() {
      var sLength = that.sStroke.length;
      for (var i = 1; i < sLength; ++i) {
        var dx = that.sStroke[i].x - that.sStroke[i - 1].x;
        var dy = that.sStroke[i].y - that.sStroke[i - 1].y;
        var ds = Math.sqrt(dx * dx + dy * dy);
        expect(ds).toBeLessThan(that.ds * 1.01);
      }
    });
    it('has two substrokes', function() {
      expect(that.subStrokes.length).toEqual(2);
    });
  });
});

// interesting because one stroke is a single dot
describe('FXGlyph i', function() {

  // test instance
  var glyph;
  var fxglyph;
  var that;
  var dot;

  beforeEach(function() {
    glyph = new handlib.Glyph({
      strokes: GLYPH_TEST_DATA.i,
      scale: 100,
    });
    fxglyph = new handlib.FXGlyph(glyph);
    that = fxglyph.unitScaledStrokes[1];
  });

  describe('extraction', function() {
    it('has correct initial values', function() {
      expect(that.points.length).toEqual(glyph.strokes[1].length);
      expect(that.size).toEqual(0);
      expect(that.ds).toEqual(Stroke.DS_UNIT_DEFAULT);
    });
    it('has one substroke', function() {
      expect(that.subStrokes.length).toEqual(1);
    });
  });
});

describe('getEqualSamples', function() {
  it('works trivially', function() {
    var xs = Stroke.getEqualSamples([0, 1], [0, 1], 3);
    expect(xs.length).toEqual(3);
    expect(xs[0]).toEqual(0);
    expect(xs[1]).toEqual(0.5);
    expect(xs[2]).toEqual(1);
  });
  it('works near-trivially', function() {
    var xs = Stroke.getEqualSamples([0, 50, 100], [0, 1, 2], 3);
    expect(xs.length).toEqual(3);
    expect(xs[0]).toEqual(0);
    expect(xs[1]).toEqual(50);
    expect(xs[2]).toEqual(100);
  });
  it('works with uneven spacing', function() {
    var xs = Stroke.getEqualSamples([0, 75, 100], [0, 1.5, 2], 3);
    expect(xs.length).toEqual(3);
    expect(xs[0]).toEqual(0);
    expect(xs[1]).toEqual(50);
    expect(xs[2]).toEqual(100);
  });
  it('works with longer sample and more uneven spacing', function() {
    var xs = Stroke.getEqualSamples([0, 25, 75, 100], [0, 1, 2, 3], 4);
    expect(xs.length).toEqual(4);
    expect(xs[0]).toEqual(0);
    expect(xs[1]).toEqual(25);
    expect(xs[2]).toEqual(75);
    expect(xs[3]).toEqual(100);
  });
  it('works with over-sampling', function() {
    var xs = Stroke.getEqualSamples([0, 25, 75, 100], [0, 1, 2, 3], 7);
    expect(xs.length).toEqual(7);
    expect(xs[0]).toEqual(0);
    expect(xs[1]).toEqual(12.5);
    expect(xs[2]).toEqual(25);
    expect(xs[3]).toEqual(50);
  });
  it('works with inconvenient sampling', function() {
    var xs = Stroke.getEqualSamples([0, 25, 75, 100], [0, 1, 2, 3], 5);
    expect(xs.length).toEqual(5);
    expect(xs[0]).toEqual(0);
    expect(xs[1]).toEqual(18.75);
    expect(xs[2]).toEqual(50);
  });
});
