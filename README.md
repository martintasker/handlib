# handlib - handwriting library

Delivers classes useful for handwriting:

| class | purpose |
| --- | --- |
| `Glyph` | describes a single glyph |
| `GlyphBuilder` | builds a glyph |
| `FXGlyph` | feature-extracted `Glyph`, with lazy getters |
| `BoundingBox` | top/left/bottom/right box |
| `BoxTransform` | box transformation utility |
| `Gatherer` | gatherer for arbitrary data, provides a sort order based on light-weight but effective clustering |
| `GlyphGatherer` | gatherer for `FXGlyph`s |

## testing

```shell
npm test
```

## building and releasing

```shell
npm run build
git commit -a -m "latest changes"
git tag v1.2.3
git push origin v1.2.3
git push origin master
```

## using

From a client project,

```shell
bower install --save martintasker/handlib#v1.2.3
```

or, to update, change the version specified in `bower.json` to specify `v1.2.3`, or `^1.2.3`, or such,
and `bower install` again.

## releases

### v1.0.0

No code change since v0.11.0.  This underlies the [Handiwork](http://handiwork.databatix.com) website, which
works pretty well, so it seems fair to label this release v1.0.0.

The most obvious to-do items are:

* improve cusp detection in `FXGlyph`: this can miss corners sometimes, resulting in no sub-stroke division where really there should be one
* nice inline doc for each class

### v0.11.0

* implement `GlyphGatherer`, which sorts `FXGlyph`s into distinct-signature sets, then
  uses `Gatherer` to gather each set, then returns the amalgamated list.
* changed signature so that, for example, `stroke:start:middle:end:mark` would now be `-[-].`:
  this compactness is useful in displays, and the collision between stroke and middle is no
  problem in whole-glyph signatures since they are distinguishable positionally
  (stroke types themselves remain unchanged and fully descriptive)
* renamed `glyph.mock.js` to `glyph.synthetic-test-data.js` since that's what it is

### v0.10.0

* implement `Gatherer`, which sorts items with a `distanceFrom()` function into a semi-coherent order

This `Gatherer` would ideally belong in a separate library of machine-learning algorithms, as it is in a way a generic clusterer.
However, the implementation is very tailored to its intended application (which is why I hestitate even to call it a clusterer),
and `handlib` currently builds on and/or includes no other machine-learning algorithms.  So, until that changes, `Gatherer` has a happy home here.

### v0.9.7

* expose `date` and `storeId` via FXGlyph

### v0.9.6

* newly-exposed `handlib.Glyph.getUUID()` and `handlib.Glyph.isValidUUID()` functions
* ensure Glyph date is always a valid JavaScript Date

### v0.9.5

Compared with v0.8.0,

* made Glyph `id` use UUID format unless overridden, introduced `node-uuid` as a dependency to enable that
* store Glyph `date` explicitly instead of deriving it from ID
* store Glyph `storeId` explicitly -- relying on client code to set this
* changed directory structure and packaging to be more mainstream webpack and to include minified versions and map
* added npm run jshint and corrected all issues so found
* added `gatherer.spec.js` for future usefulness

### v0.8.0

* added `pcDots` to `mark` sub-strokes
* extracted `featureVector` from `FXGlyph`
* added `FXGlyph.distanceFrom(that)` which calculates distance between two `FXGlyph` objects,
  provided they are signature-compatible

### v0.7.1

* added `signature` to `FXGlyph`
* added `pcDots` to sub-strokes

### v0.7.0

* added scale to strokes (as well as to glyphs)
* added `ds` and `sStroke` to `Stroke` properties as key intermediates for feature extraction
* extract substrokes using s-space instead of t-space
* extract substrokes are a `{type, stroke}` object in which `type` can be `mark` or `stroke`

### v0.6.0

* added `BoundingBox` with suitable constructors
* added `BoxTransform` with suitable options
* added `scale` to `Glyph` and required it to be specified for `FXGlyph` at construct time
* added comprehensive description of feature extraction in `fx.md`
* added `.jshintrc` and jshint jasmine pragmas to ensure that `jshint` works correctly,
  and sorted a few resulting issues

### v0.5.0

Compared with v0.4.1,

* introduced `GlyphBuilder.setDevice()` and `FXGlyph.getDevice()` as more direct client APIs to device
* introduced non-exported class `Stroke` which handles all feature extraction for `FXGlyph`:
  this looks saner already and will be a night-and-day improvement when it comes to $s$-parameterization

### v0.4.1

Compared with v0.4.0,

* fixed substrokes so they really are properly unit-scaled

### v0.4.0

Compared with v0.3.0,

* the internal dependency on `GlyphFeatures` has been eliminated and GlyphFeatures deleted from the library
* the API to `FXGlyph` has been made entirely read-only, comprising getters either of glyph set at construct time or lazily-extracted features
* `bbox` is no longer in `Glyph`
* `FXGlyph.subStrokes` is based on unit-scaled strokes, now also available as `FXGlyph.unitScaledStrokes` -- previously they were scaled the same as
  the glyph's `strokes`
* similarly, `FXGlyph.size` and `FXGlyph.sizes` are unit-scaled
* besides using a `GlyphBuilder`, you can construct a glyph directly using `new Glyph(spec)`: the `spec` parameter allows you to specify `id`, `strokes` and `device`
* the strokes given to the `Glyph` constructor may be specified either in sequential form eg `[[0,0,100,100]]` or struct form eg `[{x:0,y:0],{x:100,y:100}]`
* all this is well tested
