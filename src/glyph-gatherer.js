'use strict';

var Gatherer = require('./gatherer');

var GlyphGatherer = function(glyphSet) {
  this.set = glyphSet;
};

GlyphGatherer.prototype = {
  get list() {
    if (!this._list) {
      this._list = this._getList();
    }
    return this._list;
  }
};

GlyphGatherer.prototype._getList = function() {
  var sets = {};
  this.set.forEach(function(fxGlyph) {
    var sig = fxGlyph.signature;
    var set = sets[sig];
    if (!set) {
      sets[sig] = [];
      set = sets[sig];
    }
    set.push(fxGlyph);
  });

  var lists = [];
  Object.keys(sets).sort().forEach(function(sig) {
    var set = sets[sig];
    var list = (new Gatherer(set)).list;
    lists.push(list);
  });

  var result = [];
  lists.forEach(function(list) {
    list.forEach(function(fxGlyph) {
      result.push(fxGlyph);
    });
  });
  return result;
};

module.exports = GlyphGatherer;
