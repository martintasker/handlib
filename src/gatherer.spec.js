'use strict';

/* jshint jasmine: true */

var handlib = require('./index');

var TestPoint = function(vector) {
  this.vector = vector;
};

TestPoint.prototype.distanceFrom = function(other) {
  var s2 = 0;
  for (var i = 0; i < this.vector.length; ++i) {
    var d = this.vector[i] - other.vector[i];
    s2 += d * d;
  }
  return Math.sqrt(s2);
};

var makeTestPoints = function( /*points*/ ) {
  var args = Array.prototype.slice.call(arguments);
  return args.map(function(point) {
    return new TestPoint(point);
  });
};

describe('TestPoint test', function() {
  it('constructs correctly', function() {
    var that = new TestPoint([0, 1]);
    expect(that.vector.length).toEqual(2);
    expect(that.vector[0]).toEqual(0);
    expect(that.vector[1]).toEqual(1);
  });
  it('handles 1D distance correctly', function() {
    var p1 = new TestPoint([5]);
    var p2 = new TestPoint([7]);
    expect(p1.distanceFrom(p2)).toEqual(2);
  });
  it('handles 2D distance correctly', function() {
    var p1 = new TestPoint([5, 6]);
    var p2 = new TestPoint([8, 10]);
    expect(p1.distanceFrom(p2)).toEqual(5);
  });
  it('handles 2D distance correctly', function() {
    var set1 = makeTestPoints([1], [2], [10], [11]);
    expect(set1.length).toEqual(4);
    expect(set1[2].vector[0]).toEqual(10);
  });
});

describe('Gatherer basics', function() {

  var set1;
  var that;

  beforeEach(function() {
    set1 = makeTestPoints([1]);
    that = new handlib.Gatherer(set1);
  });

  it('constructs with correct API', function() {
    expect(typeof that.set).toEqual('object');
    expect(typeof that.list).toEqual('object');
  });
  it('constructs correctly', function() {
    expect(that.set).toEqual(set1);
  });
  it('returns a list with same length as initial set', function() {
    expect(that.list.length).toEqual(set1.length);
  });

});

describe('Gatherer with two items', function() {

  var set2;
  var that;

  beforeEach(function() {
    set2 = makeTestPoints([1], [2]);
    that = new handlib.Gatherer(set2);
  });

  it('constructs correctly', function() {
    expect(that.set).toEqual(set2);
  });
  it('returns a list with same length as initial set', function() {
    expect(that.list.length).toEqual(set2.length);
  });

});

describe('Gatherer with three items', function() {

  var set;
  var that;

  beforeEach(function() {
    set = makeTestPoints([1], [2], [10]);
    that = new handlib.Gatherer(set);
  });

  it('constructs correctly', function() {
    expect(that.set).toEqual(set);
  });
  it('returns a list with same length as initial set', function() {
    expect(that.list.length).toEqual(set.length);
    expect(that.list[0].vector[0]).toEqual(1);
    expect(that.list[1].vector[0]).toEqual(2);
    expect(that.list[2].vector[0]).toEqual(10);
  });

});

describe('Gatherer with six items in three groups', function() {

  var set;
  var that;

  beforeEach(function() {
    set = makeTestPoints([2], [3], [1], [11], [100], [10]);
    that = new handlib.Gatherer(set);
  });

  it('constructs correctly', function() {
    expect(that.set).toEqual(set);
  });
  it('returns a list with same length as initial set', function() {
    expect(that.list.length).toEqual(set.length);
    // console.log("that.list: %j", that.list);
    expect(that.list[0].vector[0]).toBeLessThan(10);
    expect(that.list[1].vector[0]).toBeLessThan(10);
    expect(that.list[2].vector[0]).toBeLessThan(10);
    expect(that.list[5].vector[0]).toBeGreaterThan(99);
  });

});

describe('Gatherer with eight 2D items in two groups', function() {

  var set;
  var that;

  beforeEach(function() {
    set = makeTestPoints([1, 2], [2, 1], [1, 1], [2, 2], [10, 10], [10, 11], [11, 10], [11, 11]);
    that = new handlib.Gatherer(set);
  });

  it('constructs correctly', function() {
    expect(that.set).toEqual(set);
  });
  it('returns a list with same length as initial set', function() {
    expect(that.list.length).toEqual(set.length);
  });
});
