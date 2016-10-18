# handlib - handwriting library

Delivers classes useful for handwriting:

| `Glyph` | describes a single glyph |
| `GlyphBuilder` | builds a glyph |
| `FXGlyph` | feature-extracted `Glyph`, with lazy getters |

Todo:

* sanitize coding and unit testing of `GlyphFeatures`
* add `id` property to glyph
* convenience constructor on `Glyph`
* move scaling unit tests from `glyph-builder.spec.js` to `glyph.spec.js` (requires above change)
* ever-better and richer feature extraction
* better internal structure for feature extraction

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
