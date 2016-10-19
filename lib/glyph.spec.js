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
    it('handles abbreviated stroke specifications correctly', function() {
      that = new handlib.Glyph({
        strokes: [
          [0, 0, 100, 100],
          [0, 100, 100, 0]
        ],
      });
      expect(that.strokes.length).toEqual(2);
      expect(that.strokes[0][0].x).toEqual(0);
      expect(that.strokes[0][1].y).toEqual(100);
    });
    it('handles full stroke specifications correctly', function() {
      that = new handlib.Glyph({
        strokes: [
          [{
            x: 0,
            y: 0
          }, {
            x: 100,
            y: 100
          }],
          [{
            x: 0,
            y: 100
          }, {
            x: 100,
            y: 0
          }]
        ],
      });
      expect(that.strokes.length).toEqual(2);
      expect(that.strokes[0][0].x).toEqual(0);
      expect(that.strokes[0][1].y).toEqual(100);
    });
    it('handles invalid stroke specifications correctly', function() {
      expect(function() {
        that = new handlib.Glyph({
          strokes: "foo",
        });
      }).toThrow();
    });
  });
});
