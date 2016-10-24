'use strict';

var BoundingBox = function(a, b, c, d) {
  this.top = undefined;
  this.left = undefined;
  this.bottom = undefined;
  this.right = undefined;
  if (typeof a === 'number' && typeof b === 'number' && typeof c === 'number' && typeof d === 'number') {
    constructFromCoordinates.call(this, a, b, c, d); // x1, y1, x2, y2
  } else if (typeof a === 'object' && typeof a.top === 'number') {
    constructFromBoundingBoxes.apply(this, arguments); // args are series of BoundingBoxes
  } else if (typeof a === 'object' && typeof a.length === 'number' && a.length > 0) {
    constructFromPointList.call(this, a); // [ {x,y}, {x,y} ...]
  } else if (a === 'unit') {
    constructUnitBox.call(this);
  } else {
    throw 'unexpected BoundingBox parameters';
  }

  function constructFromCoordinates(x1, y1, x2, y2) {
    this.top = Math.min(y1, y2);
    this.left = Math.min(x1, x2);
    this.bottom = Math.max(y1, y2);
    this.right = Math.max(x1, x2);
  }

  function constructUnitBox() {
    this.top = 0;
    this.left = 0;
    this.bottom = 1;
    this.right = 1;
  }

  function constructFromPointList(points) {
    this.top = this.bottom = points[0].y;
    this.left = this.right = points[0].x;
    for (var i = 1; i < points.length; ++i) {
      var x = points[i].x;
      var y = points[i].y;
      this.left = Math.min(this.left, x);
      this.right = Math.max(this.right, x);
      this.top = Math.min(this.top, y);
      this.bottom = Math.max(this.bottom, y);
    }
  }

  function constructFromBoundingBoxes() {
    var bb0 = arguments[0];
    checkSpec(bb0);
    this.top = bb0.top;
    this.left = bb0.left;
    this.bottom = bb0.bottom;
    this.right = bb0.right;
    for (var i = 1; i < arguments.length; ++i) {
      var bb = arguments[i];
      checkSpec(bb);
      this.left = Math.min(this.left, bb.left);
      this.right = Math.max(this.right, bb.right);
      this.top = Math.min(this.top, bb.top);
      this.bottom = Math.max(this.bottom, bb.bottom);
    }

    function checkSpec(spec) {
      if (spec.top > spec.bottom || spec.left > spec.right) {
        throw 'invalid box: top > bottom or left > right';
      }
    }
  }
};

module.exports = BoundingBox;
