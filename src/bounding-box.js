'use strict';

var BoundingBox = function(a, b, c, d) {
  this.top = undefined;
  this.left = undefined;
  this.bottom = undefined;
  this.right = undefined;
  if (typeof a === 'number' && typeof b === 'number' && typeof c === 'number' && typeof d === 'number') {
    constructFromCoordinates.call(this, a, b, c, d); // x1, y1, x2, y2
  } else if (typeof a === 'object' && typeof a.top === 'number') {
    constructFromList.call(this, arguments); // args are series of BoundingBoxes or {top,left,bottom,right} specs
  } else if (typeof a === 'object' && typeof a.length === 'number' && a.length > 0) {
    constructFromList.call(this, a); // [ {x,y} | bbox, {x,y} | bbox ...]
  } else if (a === 'unit') {
    constructUnitBox.call(this);
  } else {
    throw 'unexpected BoundingBox parameters';
  }

  function constructFromCoordinates(x1, y1, x2, y2) {
    /* jshint validthis: true */
    this.top = Math.min(y1, y2);
    this.left = Math.min(x1, x2);
    this.bottom = Math.max(y1, y2);
    this.right = Math.max(x1, x2);
  }

  function constructUnitBox() {
    /* jshint validthis: true */
    this.top = 0;
    this.left = 0;
    this.bottom = 1;
    this.right = 1;
  }

  function constructFromList(items) {
    /* jshint validthis: true */
    var item0 = items[0];
    if (typeof item0.top === 'number') {
      checkSpec(item0);
      this.top = item0.top;
      this.left = item0.left;
      this.right = item0.right;
      this.bottom = item0.bottom;
    } else {
      this.top = this.bottom = item0.y;
      this.left = this.right = item0.x;
    }
    for (var i = 1; i < items.length; ++i) {
      var item = items[i];
      if (typeof item.top === 'number') {
        checkSpec(item);
        this.left = Math.min(this.left, item.left);
        this.right = Math.max(this.right, item.right);
        this.top = Math.min(this.top, item.top);
        this.bottom = Math.max(this.bottom, item.bottom);
      } else {
        this.left = Math.min(this.left, item.x);
        this.right = Math.max(this.right, item.x);
        this.top = Math.min(this.top, item.y);
        this.bottom = Math.max(this.bottom, item.y);
      }
    }

    function checkSpec(spec) {
      if (spec.top > spec.bottom || spec.left > spec.right) {
        throw 'invalid box: top > bottom or left > right';
      }
    }
  }
};

module.exports = BoundingBox;
