'use strict';

/* jshint jasmine: true */

var handlib = require('./index');
var GLYPH_TEST_DATA = require('./glyph.synthetic-test-data.js');

describe('GlyphGatherer', function() {

  var REPETITION_FACTOR = 3;
  var glyphs;
  var that;

  beforeEach(function() {
    glyphs = [];
    Object.keys(GLYPH_TEST_DATA).forEach(function(id) {
      for (var i = 0; i < REPETITION_FACTOR; ++i) {
        var glyph = new handlib.Glyph({
          strokes: GLYPH_TEST_DATA[id],
          scale: 100,
        });
        glyphs.push(new handlib.FXGlyph(glyph));
      }
    });
    that = new handlib.GlyphGatherer(glyphs);
  });

  it('constructs with correct API', function() {
    expect(typeof that.set).toEqual('object');
    expect(typeof that.list).toEqual('object');
  });
  it('constructs correctly', function() {
    expect(that.set).toEqual(glyphs);
  });

  it('extracts correctly', function() {
    for (var i0 = 0; i0 < that.list.length; i0 += REPETITION_FACTOR) {
      for (var i = i0 + 1; i < i0 + REPETITION_FACTOR; i++) {
        expect(that.list[i0].signature).toEqual(that.list[i].signature);
      }
    }
  });
});
