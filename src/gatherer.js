'use strict';

var Gatherer = function(pointSet) {
  this.set = pointSet;
};

Gatherer.prototype = {
  get list() {
    if (!this._list) {
      this._getList();
    }
    return this._list;
  }
};

Gatherer.prototype._getList = function() {
  this._list = [];
  for (var i = 0; i < this.set.length; ++i) {
    this._addPoint(this.set[i]);
  }
};

Gatherer.prototype._addPoint = function(point) {
  this._list.push(point);
};

module.exports = Gatherer;
