'use strict';

describe('GlyphFeatures basic', function() {

  // test instance
  var glyph;
  var that;

  beforeEach(function() {
    glyph = new Glyph();
    GLYPH_TEST_DATA.star.forEach(function(stroke) {
      stroke.forEach(function(point) {
        glyph.addPoint(point);
      });
      glyph.endStroke();
    });
    that = new GlyphFeatures(glyph);
  });

  describe('initialization', function() {
    it('has public interface', function() {
      expect(typeof that.glyph).toEqual('object');
      expect(typeof that.subStrokes).toEqual('object');
      expect(typeof that.bbox).toEqual('object');
    });
    it('has correct initial values', function() {
      expect(that.glyph).toEqual(glyph);
      expect(that.subStrokes.length).toEqual(glyph.strokes.length);
      expect(that.bbox).toEqual(glyph.bbox);
    });
  });
});

describe('GlyphFeatures A', function() {

  // test instance
  var glyph;
  var that;

  beforeEach(function() {
    glyph = new Glyph();
    GLYPH_TEST_DATA.A.forEach(function(stroke) {
      stroke.forEach(function(point) {
        glyph.addPoint(point);
      });
      glyph.endStroke();
    });
    that = new GlyphFeatures(glyph);
  });

  describe('extraction', function() {
    it('has glyph and bbox correctly', function() {
      expect(that.glyph).toEqual(glyph);
      expect(that.bbox).toEqual(glyph.bbox);
    });
    it('has three substrokes', function() {
      expect(that.subStrokes.length).toEqual(3);
    });
  });
});
