'use strict';

var handlib = require('../index');

describe('Glyph API', function() {

  // test instance
  var that;

  beforeEach(function() {
    that = new handlib.Glyph();
  });

  describe('initialization', function() {
    it('has public interface', function() {
      expect(typeof that.strokes).toEqual('object');
    });
    it('has correct initial values', function() {
      expect(that.strokes).toEqual([]);
    });
  });
});
