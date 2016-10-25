# handlib - handwriting library

Delivers classes useful for handwriting:

| `Glyph` | describes a single glyph |
| `GlyphBuilder` | builds a glyph |
| `FXGlyph` | feature-extracted `Glyph`, with lazy getters |
| `BoundingBox` | top/left/bottom/right box |
| `BoxTransform` | box transformation utility |

Todo:

* improve the detection of cusps in knotty situations
* properly unit-test pcDots extraction, and stroke type
* ensure that an FXGlyph constructor can cope with either a Glyph or FXGlyph parameter

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
bower install --save git@192.168.0.136:/opt/git/handlib#v1.2.3
```

or, to update, change the version specified in `bower.json` to specify `v1.2.3`, or `^1.2.3`, or such,
and `bower update handlib`.

## releases

### v0.8.0,

* added `pcDots` to `mark` sub-strokes
* extracted `featureVector` from `FXGlyph`
* added `FXGlyph.distanceFrom(that)` which calculates distance between two `FXGlyph` objects,
  provided they are signature-compatible

### v0.7.1,

* added `signature` to `FXGlyph`
* added `pcDots` to sub-strokes

### v0.7.0,

* added scale to strokes (as well as to glyphs)
* added `ds` and `sStroke` to `Stroke` properties as key intermediates for feature extraction
* extract substrokes using s-space instead of t-space
* extract substrokes are a `{type, stroke}` object in which `type` can be `mark` or `stroke`

### v0.6.0,

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
