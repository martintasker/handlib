'use strict';

/* jshint jasmine: true */

var handlib = require('./index');

describe('Glyph static functions', function() {
  it('returns valid UUIDs', function() {
    expect(handlib.Glyph.isValidUUID(handlib.Glyph.getUUID())).toEqual(true);
  });
});

describe('Glyph API basic', function() {

  // test instance
  var that;

  beforeEach(function() {
    that = new handlib.Glyph();
  });

  describe('initialization', function() {
    it('has public interface', function() {
      expect(typeof that.id).toEqual('string');
      expect(typeof that.storeId).toEqual('string');
      expect(typeof that.date).toEqual('object');
      expect(typeof that.device).toEqual('string');
      expect(typeof that.strokes).toEqual('object');
      expect(typeof that.scale).toEqual('undefined');
      expect(Object.keys(that).length).toEqual(6);
    });
    it('has correct initial values', function() {
      expect(handlib.Glyph.isValidUUID(that.id)).toEqual(true);
      expect(that.storeId).toEqual("");
      // todo: check date using Jasmine mocks
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
    it('handles specified date correctly', function() {
      var now = new Date();
      that = new handlib.Glyph({
        date: now,
      });
      expect(that.date).toEqual(now);
    });
    it('handles date from old-style ID correctly', function() {
      var then = new Date(2004,4,3,9,30,15);
      var oldStyleId = '0-20040503-093015-00000';
      that = new handlib.Glyph({
        id: oldStyleId,
      });
      expect(that.date).toEqual(then);
    });
    it('handles storeId correctly', function() {
      that = new handlib.Glyph({
        storeId: 'bar',
      });
      expect(that.storeId).toEqual('bar');
    });
    it('handles device correctly', function() {
      that = new handlib.Glyph({
        device: "mouse",
      });
      expect(that.device).toEqual("mouse");
    });
    it('handles scale correctly', function() {
      that = new handlib.Glyph({
        scale: 100,
      });
      expect(that.scale).toEqual(100);
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
