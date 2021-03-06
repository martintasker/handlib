'use strict';

var GLYPH_TEST_DATA = (function() {

  // raw data in convenient form for human data entry and review
  var rawData = {
    star: [
      [0, 0, 100, 100],
      [100, 0, 0, 100],
      [0, 50, 100, 50]
    ],
    doubledPoint: [
      [0, 0, 100, 100, 100, 100]
    ],
    A: [
      [0,100,50,0,100,100],
      [25,50,75,50]
    ],
    A2: [
      [0,100,80,0,100,100],
      [25,50,75,50]
    ],
    i: [
      [50,50,50,90,60,100,80,100],
      [50,0]
    ]
  };

  // transform into form required for glyph building
  var res = {};
  Object.keys(rawData).forEach(function(key) {
    res[key] = rawData[key].map(function(stroke) {
      var res = [];
      for (var i = 0; i < stroke.length; i += 2) {
        res.push({
          x: stroke[i],
          y: stroke[i + 1]
        });
      }
      return res;
    });
  });
  return res;
})();

module.exports = GLYPH_TEST_DATA;
