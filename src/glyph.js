'use strict';

var Glyph = function(spec) {
  this.id = (spec && spec.id) || "";
  this.device = (spec && spec.device) || "";
  this.strokes = (spec && spec.strokes && normalizeStrokes(spec.strokes)) || [];
  this.scale = spec && spec.scale;
};

function normalizeStrokes(strokesSpec) {
  return strokesSpec.map(function(strokeSpec) {
    if (typeof strokeSpec !== 'object') {
      throw 'bad stroke spec: must be object';
    }
    if (typeof strokeSpec[0] === 'number') {
      var stroke = [];
      for (var i = 0; i < strokeSpec.length; i += 2) {
        stroke.push({
          x: strokeSpec[i],
          y: strokeSpec[i + 1]
        });
      }
      return stroke;
    } else if (typeof strokeSpec[0] === 'object') {
      return strokeSpec;
    } else {
      throw 'bad stroke spec: first must be number or (x,y) pair';
    }
  });
}

module.exports = Glyph;
