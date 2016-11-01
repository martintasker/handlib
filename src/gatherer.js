'use strict';

var Gatherer = function(pointSet) {
  this.set = pointSet;
};

Gatherer.prototype = {
  get list() {
    if (!this._list) {
      this._list = this._getList();
    }
    return this._list;
  }
};

Gatherer.prototype._getList = function() {
  return this.set;
}

module.exports = Gatherer;
