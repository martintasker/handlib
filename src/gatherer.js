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

// NodeSide

Gatherer.NodeSide = function(point) {
  this.point = point;
  this.tree = null;
};

Gatherer.NodeSide.prototype.add = function(point) {
  if (!this.tree) {
    this.tree = new Gatherer.Leaf(point);
  } else {
    this.tree = this.tree.add(point);
  }
};

Gatherer.NodeSide.prototype.emit = function(gatherer) {
  gatherer._list.push(this.point);
  if (this.tree) {
    this.tree.emit(gatherer);
  }
};

// Node

Gatherer.Node = function(point1, point2) {
  this.side1 = new Gatherer.NodeSide(point1);
  this.side2 = new Gatherer.NodeSide(point2);
};

Gatherer.Node.prototype.emit = function(gatherer) {
  this.side1.emit(gatherer);
  this.side2.emit(gatherer);
};

Gatherer.Node.prototype.add = function(point) {
  var d1 = this.side1.point.distanceFrom(point);
  var d2 = this.side2.point.distanceFrom(point);
  if (d1 < d2) {
    this.side1.add(point);
  } else {
    this.side2.add(point);
  }
  return this;
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
