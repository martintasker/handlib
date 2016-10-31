'use strict';

var uuid = require('node-uuid');

var Glyph = function(spec) {
  this.id = (spec && spec.id) || uuid.v4();
  this.date = (spec && spec.date) || (this.id && dateFromId(this.id)) || new Date();
  this.storeId = (spec && spec.storeId) || "";
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

function dateFromId(oldStyleId) {
  if (!/^\d-\d{8}-\d{6}-\d{5}$/.test(oldStyleId)) {
    return null;
  }
  var idComponents = oldStyleId.split('-');
  var yyyymmdd = idComponents[1];
  var hhmmss = idComponents[2];
  var yyyy = parseInt(yyyymmdd.slice(0, 4), 10);
  var MM = parseInt(yyyymmdd.slice(4, 6), 10);
  var dd = parseInt(yyyymmdd.slice(6, 8), 10);
  var hh = parseInt(hhmmss.slice(0, 2), 10);
  var mm = parseInt(hhmmss.slice(2, 4), 10);
  var ss = parseInt(hhmmss.slice(4, 6), 10);
  return new Date(yyyy, MM - 1, dd, hh, mm, ss);
}

module.exports = Glyph;
