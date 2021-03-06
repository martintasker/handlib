'use strict';

/* jshint jasmine: true */

var handlib = require('./index');
var GLYPH_TEST_DATA = require('./glyph.synthetic-test-data.js');

describe('GlyphBuilder API', function() {

  // test instance
  var that;

  beforeEach(function() {
    that = new handlib.GlyphBuilder();
  });

  describe('initialization', function() {
    it('has public interface', function() {
      expect(typeof that.setDevice).toEqual('function');
      expect(typeof that.addPoint).toEqual('function');
      expect(typeof that.endStroke).toEqual('function');
      expect(typeof that.strokes).toEqual('object');
      expect(typeof that.strokeInProgress).toEqual('boolean');
      expect(typeof that.getGlyph).toEqual('function');
    });
    it('has correct initial values', function() {
      expect(that.strokes).toEqual([]);
      expect(that.strokeInProgress).toEqual(false);
      expect(that.device).toEqual("");
      expect(handlib.Glyph.isValidUUID(that.id)).toEqual(true);
    });
    it('adds first point correctly', function() {
      that.addPoint(GLYPH_TEST_DATA.star[0][0]);
      expect(that.strokes.length).toEqual(1);
      expect(that.strokes[0].length).toEqual(1);
      expect(that.strokeInProgress).toEqual(true);
    });
    it('adds first stroke correctly', function() {
      that.addPoint(GLYPH_TEST_DATA.star[0][0]);
      that.addPoint(GLYPH_TEST_DATA.star[0][1]);
      that.endStroke();
      expect(that.strokes.length).toEqual(1);
      expect(that.strokes[0].length).toEqual(2);
      expect(that.strokeInProgress).toEqual(false);
    });
    it('handles device correctly', function() {
      that.setDevice("touch");
      that.addPoint(GLYPH_TEST_DATA.star[0][0]);
      that.addPoint(GLYPH_TEST_DATA.star[0][1]);
      that.endStroke();
      var glyph = that.getGlyph();
      expect(handlib.Glyph.isValidUUID(that.id)).toEqual(true);
      expect(glyph.device).toEqual("touch");
    });
    it('adds first three strokes correctly', function() {
      GLYPH_TEST_DATA.star.forEach(function(stroke) {
        stroke.forEach(function(point) {
          that.addPoint(point);
        });
        that.endStroke();
      });
      expect(that.strokes.length).toEqual(3);
      expect(that.strokes[2].length).toEqual(2);
      expect(that.strokeInProgress).toEqual(false);
    });
    it('eliminates duplicate points', function() {
      GLYPH_TEST_DATA.doubledPoint.forEach(function(stroke) {
        stroke.forEach(function(point) {
          that.addPoint(point);
        });
        that.endStroke();
      });
      expect(that.strokes.length).toEqual(1);
      expect(that.strokes[0].length).toEqual(2);
    });
  });
});
