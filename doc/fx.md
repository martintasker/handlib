# Feature extraction

To compare glyphs, you need a similarity measure between them or, looked at in an opposite perspective, a distance measure.
The method we use here, when comparing two glyphs, is to find _corresponding points_ on the strokes of each
glyph, and to find the Euclidean distance between them $d^2 = \Delta x^2 + \Delta y^2$.  It turns out we have to do quite a lot
of work to get points which actually correspond, and that between some pairs of glypphs there is simply no correspondence: they
are just _different_.

* for glyphs to be comparable at all, they have to have the same structure of strokes and dots; so 'i' and 'j' are comparable, as are 'e' and 'l';
  but 'i' and 'e' are not
* to get stroke and dot structure, we need to identify strokes which are so short that they count as dots; and we need to identify strokes with
  sharp bends in them and divide them into substrokes
* in order to do that reliably, we have to scale the glyphs from the input (which is usually several hundred pixels wide and high) into a
  normalized unit box, 1.0 wide and 1.0 high; and we need to re-sample the strokes from the roughly equal units of _time_ in which they originally
  are given, into equal units of _distance_

That process is explained below in more detail, and in bottom-up order.

## The fundamental requirements of space-based sampling

An original stroke is a set of points $(x_t,y_t)$ where $t$ is effectively a time-based index.  Between any two
consecutive values of $t$ there may be any distance $\Delta s=\sqrt{\Delta x^2 + \Delta y^2}$, depending on how fast
the pen (mouse or finger) was moving.

Visually, however, the speed of pen movement is irrelevant.  What matters is even increments of _distance_.  All useful
analysis of a stroke begins with a re-sampled version of the stroke into even distance increments.  Then stroke then
becomes a set of points $(x_s,y_s)$ where $s$ is a distance-based index.  This re-sampling raises two questions immediately:

* what method is used to re-sample?--answer, straightforwardly, linear interpolation between $t$-based samples
* what distance $\delta s$ is used as the constant interval between samples?--first answer, about 1/20th the glyph size,
  but we need to justify this, and some additional sophistication may also be needed

Let's call that first answer $\delta s_0$.  $\delta s_0$ must be

* smaller than any visually-useful artefacts in the writing--otherwise valuable information is lost in re-sampling
* not so small that it produces many points--otherwise noise is generated which won't help any downstream computations
* not so small that it produces many points--otherwise performance will be affected

The value $\delta s_0=0.05$ of the glyph size seems a reasonable choice given those criteria.

But then "the glyph size" needs to be determined.  It will help, in fact, if we normalize all glyphs to a unit-box
before doing $s$-based re-sampling on them: the glyph as a whole (ie, all its strokes) must be normalized in size,
to within a square bounding box, which encloses the longer dimension of the glyph exactly, and which centres the
glyph in the other dimension.  But, degenerate or pathological glyph forms, in particular dots or small strokes
which might be a dot or comma or such, should not be scaled in this bounding-box manner but should be handled specially.

So, prior to any stroke analysis in the unit-box domain, there needs to be whole-glyph analysis:

* the whole glyph (not just strokes) needs to be scaled into the unit-box domain
* if the glyph comprises only a single stroke which is small in comparison to the writepad-box, then instead of scaling to unit
  dimensions, the glyph is scaled to sub-unit dimensions--say, 0.1 unit size

And, when doing later stroke analysis in the unit-box domain, small strokes need to be handled specially:

* they may be treated simply as a dot
* it might make sense to sample them finely using $\delta s=\delta s_0/10$, say, in order to extract whatever information is available
  from small strokes which are more than a dot

These fundamental requirements have implications for the APIs and objects involved in glyph analysis:

* original glyph data must include not only the dot values of glyphs, but the dot-domain scale of the writepad on which they were drawn
* a unit-scaled version of a glyph is needed prior to any space-based re-sampling
* original stroke lengths are needed prior to unit-scaling -- because they're needed for identifying small strokes
* it will help enormously to have a `BoxTransformer` class which takes two bounding boxes in its constructor and offers `x` and `y`
  transformations
* in turn this requires a `BoundingBox` class

State of play in v0.5.0:

* there's no facility for specifying the scale in `GlyphBuilder`, `Glyph` or `FXGlyph`
* there's no `BoundingBox` and no `BoxTransformer`
* there's no check for small strokes prior to transforming to unit scale
* substroke detection is done entirely in the $t$ domain, not the $s$ domain

Introducing the glyph scale would be a breaking change, and introducing the `BoundingBox` and `BoxTransformer` would
require disruptive exploitation.  These should be the main changes for v0.6 and should be adopted by client prior to
further work.

## Substroke analysis

In the $s$-domain the glyph should be broken down into substrokes.  A substroke is:

* a mark, for short strokes
* a whole stroke, for strokes which do not include _cusps_ -- ie, sharp changes in direction over a small interval of $\Delta s$
* part of a stroke, for strokes which do include cusps

So a substroke has attributes, `mark` (true for marks only), `begin` (true for whole strokes and for beginning part-strokes),
and `end` (true for whole strokes and for ending part-strokes).

The key technical question here is, how to identify cusps.  The answer in simple terms is a large $\Delta \theta$ in a small $\Delta s$.

* in the ideal simple case, a single point has a change in angle $\Delta \theta$ which is bigger than some threshhold, eg $100^\circ$:
  in this case, we mark that point as a cusp point and use it as the end of one substroke and the beginning of the next
* in pathological cases, we may have a run of such points, in which case we have a knotty cusp; we should mark the first such point as
  the end of the first substroke, and the last such point as the beginning of the next
* however, when analyzing such runs, we should distinguish between left- and right-turning points: a run of sharp left turns is ended
  by a sharp right turn, and vice versa

The change in angle at a given point, $\Delta \theta$, does not have to be calculated explicitly.  Its sine and cosine are given by

$$
\begin{align*}
\sin \Delta \theta &= { {(\vec{a} \times \vec{b})}_z \over \| \vec{a} \| \, \| \vec{b} \| }, \\
\cos \Delta \theta &= { \vec{a} . \vec{b} \over \| \vec{a} \| \, \| \vec{b} \| }
\end{align*}
$$

where

$$
\begin{align*}
\vec{a} &= (x_s - x_{s-1}, y_s - y_{s-1}), \\
\vec{b} &= (x_{s+1} - x_s, y_{s+1} - y_s), \\
\vec{a} . \vec{b} &= a_x b_x + a_y b_y, \\
{(\vec{a} \times \vec{b})}_z &= a_x b_y - a_y b_x, \\
\| \vec{a} \| = \| \vec{b} \| &= \delta s
\end{align*}
$$

So the sine and cosine are easy to calculate: we can use the cosine as the threshhold for whether a turn is sharp ($\cos \Delta \theta < -0.2$, say),
and the sine for whether it's right or left.

State of play in v0.5.0:

* analysis is done in the $t$ domain, not the $s$ domain
* we don't identify `mark`, `begin` or `end`
* we look at only a single point rather than a run of points

The v0.7 change should introduce these features (v0.6 will do pre-processing).

## Point correspondence

To tell whether one glyph is similar to another, we need to extract some numbers from each glyph and, where these numbers have the
same structure, to compare them.

The numbers may not have the same structure: for example an 'i' comprising a stroke and a mark has an entirely different structure from an 'e'
comprising a single stroke.  These two glyphs are simply "different".  But an 'i' and a 'j' may be compared, as may an 'e' and an 'l'.

We can represent the _structure_ of a glyph by its sequence of marks and strokes, eg `sm` for 'i', `s` for 'e', or `sss` for 'F' written in the usual way.

We assign comparable numbers as follows:

* a mark can be represented simply by the coordinates of its point
* each substroke can be represented by the coordinates of $N$ evenly-spaced points along it: its start, $N-2$ mid-points, and its end

We can then assign a distance measure based on the Euclidean distance between corresponding points, $d_p^2 = \Delta x^2 + \Delta y^2$.  The
distance between two marks is very simply:

$$
d^2 = d_p^2
$$

while the distance between two strokes is the scaled sum of the point-correspondence distances:

$$
d^2 = {1 \over N} \sum_{j=1}^N d_{p,j}^2
$$

This scaling ensures that marks and whole strokes are comparable: without it, a one-point mark would be insignificant compared with an $N$-point stroke.

Where structures are comparable, we assign a total Euclidean distance by summing the distances between their $M$ marks and substrokes:

$$
d_{tot}^2 = {1 \over M} \sum_{i=1}^M d_i^2
$$

The scaling here ensures that distances are broadly of order unity, regardless of the structure of the glyphs being compared.  This gives a better
feel for humans comparing distances, and also gives more desirable statistical properties for distance-based algorithms to work with.

Instead of post-dividing a $\sum^N d_p^2$ by $N$, we can pre-divide each $x$ and $y$ that goes into the sum by $\sqrt{N}$; in fact for mark strokes
we pre-divide by $\sqrt{M}$ and for others we pre-divide by $\sqrt{MN}$.  This means we can extract scaled feature vectors and do the distance calculation
without any division at that time.

This will be the major feature of v0.8.
