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

Gatherer.Leaf = function(point) {
  this.point = point;
};

Gatherer.Leaf.prototype.emit = function(gatherer) {
  gatherer._list.push(this.point);
};

Gatherer.prototype._getList = function() {
  this._root = null;
  this._list = [];
  if (this.set.length === 0) {
    return;
  }
  for (var i = 0; i < this.set.length; ++i) {
    this._addPoint(this.set[i]);
  }
  this._root.emit(this);
};

Gatherer.prototype._addPoint = function(point) {
  if (!this._root) {
    this._root = new Gatherer.Leaf(point);
  }
};

module.exports = Gatherer;
