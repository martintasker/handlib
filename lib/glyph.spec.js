'use strict';

var handlib = require('../index');
var GLYPH_TEST_DATA = require('./glyph.mock.js');

describe('Glyph API', function() {

  // test instance
  var that;

  beforeEach(function() {
    that = new handlib.Glyph();
  });

  describe('initialization', function() {
    it('has public interface', function() {
      expect(typeof that.addPoint).toEqual('function');
      expect(typeof that.endStroke).toEqual('function');
      expect(typeof that.getScaled).toEqual('function');
      expect(typeof that.getUnitScaled).toEqual('function');
      expect(typeof that.strokes).toEqual('object');
      expect(typeof that.bbox).toEqual('undefined');
      expect(typeof that.strokeInProgress).toEqual('boolean');
    });
    it('has correct initial values', function() {
      expect(that.strokes).toEqual([]);
      expect(that.bbox).toEqual(undefined);
      expect(that.strokeInProgress).toEqual(false);
    });
    it('adds first point correctly', function() {
      that.addPoint(GLYPH_TEST_DATA.star[0][0]);
      expect(that.strokes.length).toEqual(1);
      expect(that.strokes[0].length).toEqual(1);
      expect(that.bbox.top).toEqual(0);
      expect(that.bbox.left).toEqual(0);
      expect(that.bbox.bottom).toEqual(0);
      expect(that.bbox.right).toEqual(0);
      expect(that.strokeInProgress).toEqual(true);
    });
    it('adds first stroke correctly', function() {
      that.addPoint(GLYPH_TEST_DATA.star[0][0]);
      that.addPoint(GLYPH_TEST_DATA.star[0][1]);
      that.endStroke();
      expect(that.strokes.length).toEqual(1);
      expect(that.strokes[0].length).toEqual(2);
      expect(that.bbox.top).toEqual(0);
      expect(that.bbox.left).toEqual(0);
      expect(that.bbox.bottom).toEqual(100);
      expect(that.bbox.right).toEqual(100);
      expect(that.strokeInProgress).toEqual(false);
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
      expect(that.bbox.top).toEqual(0);
      expect(that.bbox.left).toEqual(0);
      expect(that.bbox.bottom).toEqual(100);
      expect(that.bbox.right).toEqual(100);
      expect(that.strokeInProgress).toEqual(false);
    });
    it('scales correctly to unit dimensions', function() {
      GLYPH_TEST_DATA.star.forEach(function(stroke) {
        stroke.forEach(function(point) {
          that.addPoint(point);
        });
        that.endStroke();
      });
      var scaled = that.getUnitScaled();
      expect(scaled.strokes.length).toEqual(3);
      expect(scaled.strokes[2].length).toEqual(2);
      expect(scaled.bbox.top).toEqual(0);
      expect(scaled.bbox.left).toEqual(0);
      expect(scaled.bbox.bottom).toEqual(1);
      expect(scaled.bbox.right).toEqual(1);
      expect(scaled.strokeInProgress).toEqual(false);
    });
    it('scales correctly to large dimensions', function() {
      GLYPH_TEST_DATA.star.forEach(function(stroke) {
        stroke.forEach(function(point) {
          that.addPoint(point);
        });
        that.endStroke();
      });
      var scaled = that.getScaled(300);
      expect(scaled.strokes.length).toEqual(3);
      expect(scaled.strokes[2].length).toEqual(2);
      expect(scaled.bbox.top).toEqual(0);
      expect(scaled.bbox.left).toEqual(0);
      expect(scaled.bbox.bottom).toEqual(300);
      expect(scaled.bbox.right).toEqual(300);
      expect(scaled.strokeInProgress).toEqual(false);
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
