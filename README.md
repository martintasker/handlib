# handlib - handwriting library

Delivers classes useful ofr handwriting:

| `Glyph` | describes a single glyph |
| `GlyphFeatures` | extracts the features from a `Glyph` |

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
