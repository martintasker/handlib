'use strict';

/* jshint jasmine: true */

var handlib = require('./index');

describe('BoxTransformer', function() {

  var unitBox = new handlib.BoundingBox('unit');
  var hundredBox = new handlib.BoundingBox(0, 0, 100, 100);
  var postBox = new handlib.BoundingBox(0, 0, 100, 50);
  var doorBox = new handlib.BoundingBox(0, 0, 50, 100);

  it('works from unit to 100,100', function() {
    var that = new handlib.BoxTransformer(unitBox, hundredBox);
    expect(that.x(0)).toEqual(0);
    expect(that.y(0)).toEqual(0);
    expect(that.x(1)).toEqual(100);
    expect(that.y(1)).toEqual(100);
  });
  it('works from unit to 100,50', function() {
    var that = new handlib.BoxTransformer(unitBox, postBox);
    expect(that.x(0)).toEqual(25);
    expect(that.y(0)).toEqual(0);
    expect(that.x(1)).toEqual(75);
    expect(that.y(1)).toEqual(50);
  });
  it('works from unit to 100,50, not centered', function() {
    var that = new handlib.BoxTransformer(unitBox, postBox, {
      center: false
    });
    expect(that.x(0)).toEqual(0);
    expect(that.y(0)).toEqual(0);
    expect(that.x(1)).toEqual(50);
    expect(that.y(1)).toEqual(50);
  });
  it('works from unit to 100,50, aspect ratio not maintained', function() {
    var that = new handlib.BoxTransformer(unitBox, postBox, {
      maintainAspectRatio: false
    });
    expect(that.x(0)).toEqual(0);
    expect(that.y(0)).toEqual(0);
    expect(that.x(1)).toEqual(100);
    expect(that.y(1)).toEqual(50);
  });
  it('works from unit to 50,100', function() {
    var that = new handlib.BoxTransformer(unitBox, doorBox);
    expect(that.x(0)).toEqual(0);
    expect(that.y(0)).toEqual(25);
    expect(that.x(1)).toEqual(50);
    expect(that.y(1)).toEqual(75);
  });
  it('works from unit to 50,100, not centered', function() {
    var that = new handlib.BoxTransformer(unitBox, doorBox, {
      center: false
    });
    expect(that.x(0)).toEqual(0);
    expect(that.y(0)).toEqual(0);
    expect(that.x(1)).toEqual(50);
    expect(that.y(1)).toEqual(50);
  });
  it('works from unit to 50,100, aspect ratio not maintained', function() {
    var that = new handlib.BoxTransformer(unitBox, doorBox, {
      maintainAspectRatio: false
    });
    expect(that.x(0)).toEqual(0);
    expect(that.y(0)).toEqual(0);
    expect(that.x(1)).toEqual(50);
    expect(that.y(1)).toEqual(100);
  });
});
