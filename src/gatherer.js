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

// Leaf

Gatherer.Leaf = function(point) {
  this.point = point;
};

Gatherer.Leaf.prototype.emit = function(gatherer) {
  gatherer._list.push(this.point);
};

Gatherer.Leaf.prototype.add = function(point) {
  return new Gatherer.Node(this.point, point);
};

// Node

Gatherer.Node = function(point1, point2) {
  this.point1 = point1;
  this.point2 = point2;
  this.tree1 = null;
  this.tree2 = null;
};

Gatherer.Node.prototype.emit = function(gatherer) {
  if (this.tree1) {
    tree1.emit(gatherer);
  }
  gatherer.list.push(this.point1);
  gatherer.list.push(this.point2);
  if (this.tree2) {
    tree2.emit(gatherer);
  }
};

// Gatherer

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
  } else {
    this._root = this._root.add(point);
  }
};

module.exports = Gatherer;
