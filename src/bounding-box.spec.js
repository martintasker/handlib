'use strict';

/* jshint jasmine: true */

var handlib = require('./index');

describe('BoundingBox constructors', function() {

  it('works from x1, y1, x2, y2', function() {
    var that = new handlib.BoundingBox(1, 2, 3, 4);
    expect(that.top).toEqual(2);
    expect(that.left).toEqual(1);
    expect(that.bottom).toEqual(4);
    expect(that.right).toEqual(3);
  });
  it('works from x1, y1, x2, y2 in wrong order', function() {
    var that = new handlib.BoundingBox(3, 4, 1, 2);
    expect(that.top).toEqual(2);
    expect(that.left).toEqual(1);
    expect(that.bottom).toEqual(4);
    expect(that.right).toEqual(3);
  });
  it('works from unit box', function() {
    var that = new handlib.BoundingBox('unit');
    expect(that.top).toEqual(0);
    expect(that.left).toEqual(0);
    expect(that.bottom).toEqual(1);
    expect(that.right).toEqual(1);
  });
  it('works from spec', function() {
    var spec = {
      top: 1,
      left: 2,
      bottom: 3,
      right: 4
    };
    var that = new handlib.BoundingBox(spec);
    expect(that.top).toEqual(1);
    expect(that.left).toEqual(2);
    expect(that.bottom).toEqual(3);
    expect(that.right).toEqual(4);
  });
  it('fails from invalid box spec', function() {
    var spec = {
      top: 3,
      left: 4,
      bottom: 1,
      right: 2
    };
    expect(function() {
      new handlib.BoundingBox(spec);
    }).toThrow();
  });
  it('works from point list', function() {
    var points = [{
      x: 1,
      y: 2
    }, {
      x: 3,
      y: 4
    }];
    var that = new handlib.BoundingBox(points);
    expect(that.top).toEqual(2);
    expect(that.left).toEqual(1);
    expect(that.bottom).toEqual(4);
    expect(that.right).toEqual(3);
  });
  it('works from short point list', function() {
    var points = [{
      x: 1,
      y: 2
    }];
    var that = new handlib.BoundingBox(points);
    expect(that.top).toEqual(2);
    expect(that.left).toEqual(1);
    expect(that.bottom).toEqual(2);
    expect(that.right).toEqual(1);
  });
  it('fails from null point list', function() {
    var points = [];
    expect(function() {
      new handlib.BoundingBox(points);
    }).toThrow();
  });
  it('works from two bounding boxes', function() {
    var bbox1 = new handlib.BoundingBox(1, 2, 3, 4);
    var bbox2 = new handlib.BoundingBox(5, 6, 7, 8);
    var that = new handlib.BoundingBox(bbox1, bbox2);
    expect(that.top).toEqual(2);
    expect(that.left).toEqual(1);
    expect(that.bottom).toEqual(8);
    expect(that.right).toEqual(7);
  });
  it('works from bounding box list', function() {
    var bbox1 = new handlib.BoundingBox(1, 2, 3, 4);
    var bbox2 = new handlib.BoundingBox(5, 6, 7, 8);
    var that = new handlib.BoundingBox([bbox1, bbox2]);
    expect(that.top).toEqual(2);
    expect(that.left).toEqual(1);
    expect(that.bottom).toEqual(8);
    expect(that.right).toEqual(7);
  });
});
