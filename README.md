# handlib - handwriting library

Delivers classes useful for handwriting:

| `Glyph` | describes a single glyph |
| `GlyphBuilder` | builds a glyph |
| `GlyphFeatures` | extracts the features from a `Glyph` |

Todo:

* change `GlyphFeatures` API to `FXGlyph` using JavaScript getters and memoization
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
