'use strict';

var handlib = require('../index');

describe('Glyph API basic', function() {

  // test instance
  var that;

  beforeEach(function() {
    that = new handlib.Glyph();
  });

  describe('initialization', function() {
    it('has public interface', function() {
      expect(typeof that.id).toEqual('string');
      expect(typeof that.device).toEqual('string');
      expect(typeof that.strokes).toEqual('object');
    });
    it('has correct initial values', function() {
      expect(that.id).toEqual("");
      expect(that.device).toEqual("");
      expect(that.strokes).toEqual([]);
    });
  });
});

describe('Glyph API extended', function() {

  // test instance
  var that;

  describe('initialization', function() {
    it('handles ID correctly', function() {
      that = new handlib.Glyph({
        id: "foo"
      });
      expect(that.id).toEqual("foo");
    });
    it('handles device correctly', function() {
      that = new handlib.Glyph({
        device: "mouse",
      });
      expect(that.device).toEqual("mouse");
    });
    it('handles strokes correctly', function() {
      that = new handlib.Glyph({
        strokes: [[0,0,100,100],[0,100,100,0]],
      });
      expect(that.strokes.length).toEqual(2);
    });
  });
});
