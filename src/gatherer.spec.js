'use strict';

/*
  Algorithm: given objects with a distanceFrom() function,
  sort them into a sequence in which consecutive items are,
  on average, fairly close.

  Method: a tree comprising either
  * nothing
  * a leaf, with one item in
  * a 2-node, with two items and two subtrees
  * a tree of such 2-nodes and leaves

  To insert,
  * into a blank tree: create a leaf
  * into a leaf: replace it with a 2-node
  * into a 2-node: choose the closest item and insert it into the corresponding tree

  Thus
  * 1,2,3,4,5,6 -> [1], [1,2], [1,2[3]], [1,2[3,4]], [1,2[3,4[5]]], [1,2[3,4[5,6]]
  * 1,4,2,5,3,5 -> [1], [1,4], [1[2],4], [1[2],4[3]], [1[2],4[3,5]], [1[2],4[3,5[6]]]
  * 1,10,100,2,11,101 -> [1], [1,10], [1,10[100]], [1[2],10[100]], [1[2],10[100,11]], [1[2],10[100[101],11]]
  * 1,10,100,2,11,3 -> [1], [1,10], [1,10[100]], [1[2],10[100]], [1[2],10[100,11]], [1[2,3],10[100,11]]

  Then if we read back, the method is,
  * to emit a 1-node, just emit it
  * with a 2-node, emit left subtree, emit left node, emit right node, emit right subtree

  So then the trees above are emitted as
  * 1,2,3,4,5,6
  * 2,1,4,3,5,6
  * 2,1,10,101,100,11
  * 2,3,1,10,100,11

  A better emission algorithm would be
  * to emit a entire tree comprising a two-node, emit the first side, then the second side
  * to emit one side of a 2-node,
    * emit the value
    * if its child is a 2-node, emit the closest side, then the other side (first side first, if there's a tie)
    * if its child id a leaf, just emit it
  * to emit a leaf, just emit its value

  This would give a better order for most 2-nodes.  The trees above would emit as
  * 1,2,3,4,5,6
  * 1,2,4,3,5,6
  * 1,2,10,11,100,101
  * 1,2,3,10,11,100

  Note it's not the exact sequence that matters: within a cluster the order is really irrelevant.  So the
  improvement in the second line above doesn't matter much.  The improvement in the third and fourth lines
  is, however, more significant.
*/