'use strict';

var BoxTransformer = function(fromBox, toBox, options) {
  this.fromBox = fromBox;
  this.toBox = toBox;
  this.x = x;
  this.y = y;
  this.options = {
    center: true,
    maintainAspectRatio: true
  };
  var self = this;
  Object.keys(options || {}).forEach(function(option) {
    self.options[option] = options[option];
  });

  var xInScale = this.fromBox.right - this.fromBox.left;
  if (xInScale === 0) {
    xInScale = 1
  }
  var yInScale = this.fromBox.bottom - this.fromBox.top;
  if (yInScale === 0) {
    yInScale = 1;
  }
  var xInAnchor = this.fromBox.left;
  var yInAnchor = this.fromBox.top;

  var xOutScale = this.toBox.right - this.toBox.left;
  var yOutScale = this.toBox.bottom - this.toBox.top;
  var xOutAnchor = this.toBox.left;
  var yOutAnchor = this.toBox.top;

  if (this.options.center) {
    xInAnchor = 0.5 * (this.fromBox.left + this.fromBox.right);
    yInAnchor = 0.5 * (this.fromBox.top + this.fromBox.bottom);
    xOutAnchor = 0.5 * (this.toBox.left + this.toBox.right);
    yOutAnchor = 0.5 * (this.toBox.top + this.toBox.bottom);
  }

  var xScale = xOutScale / xInScale;
  var yScale = yOutScale / yInScale;
  var minScale = Math.min(xScale, yScale);
  if (this.options.maintainAspectRatio) {
    xScale = minScale;
    yScale = minScale;
  }

  function x(xIn) {
    return (xIn - xInAnchor) * xScale + xOutAnchor;
  }

  function y(yIn) {
    return (yIn - yInAnchor) * yScale + yOutAnchor;
  }
};

module.exports = BoxTransformer;
