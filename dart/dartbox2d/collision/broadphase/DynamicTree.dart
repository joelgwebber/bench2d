// Copyright 2012 Google Inc. All Rights Reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * A dynamic tree arranges data in a binary tree to accelerate
 * queries such as volume queries and ray casts. Leafs are proxies
 * with an AxisAlignedBox. In the tree we expand the proxy box by
 * Settings.BOUNDING_BOX_EXTENSION so that the proxy box is bigger than the
 * client object. This allows the client object to move by small amounts without
 * triggering a tree update.
 */
class DynamicTree {
  static final int MAX_STACK_SIZE = 64;

  /** The number of nodes to add to the node stack if its empty. */
  static final int _DEFAULT_NODE_ADDITION = 6;

  DynamicTreeNode _root;
  int _nodeCount;
  DynamicTreeNode _lastLeaf;
  int _insertionCount;
  int _path;

  final Queue<DynamicTreeNode> _nodeStack;
  final List<Vector> _drawVectors;
  int _nodeCounter;

  /**
   *  Temporary objects that are used privately and are initialized at
   *  construction. These are used instead of creating new objects during tree
   *  operation.
   */
  final Vector _tempVector;
  final AxisAlignedBox _tempBox;
  final Vector center;
  final Vector deltaOne;
  final Vector deltaTwo;

  /**
   * Constructs a new DynamicTree.
   */
  DynamicTree() :
    _root = null,
    _nodeCount = 0,
    _insertionCount = 0,
    _path = 0,
    _lastLeaf = null,
    _drawVectors = new List<Vector>(4),
    _nodeCounter = 0,
    _tempVector = new Vector(),
    _tempBox = new AxisAlignedBox(),
    _nodeStack = new Queue<DynamicTreeNode>(),
    // Pool objects.
    center = new Vector(),
    deltaOne = new Vector(),
    deltaTwo = new Vector() {

    // Place new vectors in the draw vectors array.
    for (int i = 0; i < _drawVectors.length; i++) {
      _drawVectors[i] = new Vector();
    }
  }

  /**
   * Create a proxy. Provides a tight fitting axis aligned box
   * and a userData pointer.
   */
  DynamicTreeNode createProxy(AxisAlignedBox box, Object userData) {
    DynamicTreeNode proxy = _allocateNode();

    // Fatten the bounding box.
    proxy.box.lowerBound.x = box.lowerBound.x - Settings.BOUNDING_BOX_EXTENSION;
    proxy.box.lowerBound.y = box.lowerBound.y - Settings.BOUNDING_BOX_EXTENSION;
    proxy.box.upperBound.x = box.upperBound.x + Settings.BOUNDING_BOX_EXTENSION;
    proxy.box.upperBound.y = box.upperBound.y + Settings.BOUNDING_BOX_EXTENSION;

    // Assign the given user Data to the proxy node.
    proxy.userData = userData;

    // Insert the proxy node on the tree.
    _insertLeaf(proxy);

    //TODO(gregbglw): why 4? why 64? what is going on here?
    int iterationCount = _nodeCount >> 4;
    int tryCount = 0;
    int height = computeHeightFromRoot();
    while (height > 64 && tryCount < 10) {
      rebalance(iterationCount);
      height = computeHeightFromRoot();
      tryCount++;
    }

    return proxy;
  }

  /** Destroys the given proxy. */
  // TODO(gregbglw): what the hell is a proxy?
  void destroyProxy(DynamicTreeNode toDestroy) {
    // The given proxy must not be null and must be a leaf.
    assert(toDestroy != null);
    assert(toDestroy.isLeaf);

    // Remove and free the proxy.
    _removeLeaf(toDestroy);
    _freeNode(toDestroy);
  }

  /**
   * Move a proxy with a swept AABB. If the proxy has moved outside of its
   * fattened AABB, then the proxy is removed from the tree and re-inserted.
   * Otherwise, the function returns immediately.
   *
   * Returns true if the given proxy was re-inserted.
   */
  bool moveProxy(DynamicTreeNode argProxy, AxisAlignedBox argBox,
      Vector displacement) {
    // The given proxy must not be null and must be a leaf.
    assert (argProxy != null);
    assert (argProxy.isLeaf);

    // If the given proxies box contains the given box, then return right away.
    if (argProxy.box.contains(argBox)) {
      return false;
    }

    // Remove the proxy from the tree.
    _removeLeaf(argProxy);

    // Extend the bounding box.
    argBox.lowerBound.x -= Settings.BOUNDING_BOX_EXTENSION;
    argBox.lowerBound.y -= Settings.BOUNDING_BOX_EXTENSION;
    argBox.upperBound.x += Settings.BOUNDING_BOX_EXTENSION;
    argBox.upperBound.y += Settings.BOUNDING_BOX_EXTENSION;

    // Predict bounding box displacement.
    _tempVector.setFrom(displacement);
    _tempVector.mulLocal(Settings.BOUNDING_BOX_MULTIPLIER);
    if (_tempVector.x < 0) {
      argBox.lowerBound.x += _tempVector.x;
    } else {
      argBox.upperBound.x += _tempVector.x;
    }

    if (_tempVector.y < 0) {
      argBox.lowerBound.y += _tempVector.y;
    } else {
      argBox.upperBound.y += _tempVector.y;
    }

    argProxy.box.setFrom(argBox);

    // Insert the argument proxy and return true.
    _insertLeaf(argProxy);
    return true;
  }

  /** Allocates a new node and increases the node count. */
  DynamicTreeNode _allocateNode() {
    // If node stack is empty, add nodes to it.
    if (_nodeStack.isEmpty()) {
      for (int i = 0; i < _DEFAULT_NODE_ADDITION; i++) {
        _nodeStack.addFirst(new DynamicTreeNode._construct());
      }
    }

    DynamicTreeNode node = _nodeStack.removeFirst();
    node.parent = null;
    node.childOne = null;
    node.childTwo = null;
    node.userData = null;
    node.key = _nodeCounter;
    _nodeCounter++;
    _nodeCount++;
    return node;
  }

  /**
   * Queries a bounding box for overlapping proxies. The callback class is
   * called for each proxy that overlaps the given bounding box.
   */
  void query(TreeCallback callback, AxisAlignedBox argBox) {
    _query(callback, argBox, _root, 1);
  }

  // Private recursive query function. Returns true if should proceed.
  bool _query(TreeCallback callback, AxisAlignedBox argBox, DynamicTreeNode
      node, int count) {
    // If given node is null, get out of here and continue recursing.
    if (node == null) {
      return true;
    }

    if (AxisAlignedBox.testOverlap(argBox, node.box)) {

      if (node.isLeaf) {
        bool proceed = callback.treeCallback(node);
        if (!proceed) {
          return false;
        }

      } else {
        if (count < MAX_STACK_SIZE) {
          count++;
          bool proceed = _query(callback, argBox, node.childOne, count);
          if (!proceed) {
            return false;
          }
        }

        if (count < MAX_STACK_SIZE) {
          count++;
          bool proceed = _query(callback, argBox, node.childTwo, count);
          if (!proceed) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /** Inserts a leaf into the tree. */
  void _insertLeaf(DynamicTreeNode node) {
    // Increment insertion count.
    _insertionCount++;

    // If nothing in the tree, make given node the root.
    if (_root == null) {
      _root = node;
      node.parent = null;
      return;
    }

    // Find the best sibling for the given node. Start looking at the root.
    center.setFrom(node.box.center);
    DynamicTreeNode sibling = _root;

    DynamicTreeNode childOne, childTwo;

    // Search through the tree until finding a suitable leaf to be the node's
    // sibling.
    if (!sibling.isLeaf) {
      do {
        childOne = sibling.childOne;
        childTwo = sibling.childTwo;

        // Find the absolute difference between the center of the bounding box for
        // the node we are inserting and the center's of the bounding boxes of the
        // two children.
        deltaOne.setFrom(childOne.box.center);
        deltaTwo.setFrom(childTwo.box.center);
        deltaOne.subLocal(center).absLocal();
        deltaTwo.subLocal(center).absLocal();

        num normOne = deltaOne.x + deltaOne.y;
        num normTwo = deltaTwo.x + deltaTwo.y;

        if (normOne < normTwo) {
          sibling = childOne;
        } else {
          sibling = childTwo;
        }
      } while (sibling.isLeaf == false);
    }

    // Create a new parent for the siblings. Make this node the child of
    // the current parent node.
    DynamicTreeNode node1 = sibling.parent;
    DynamicTreeNode node2 = _allocateNode();
    node2.parent = node1;
    node2.userData = null;
    node2.box.setFromCombination(node.box, sibling.box);

    // If the old parent wasn't the root node...
    if (node1 != null) {
      // If the sibling was the first child, make the new parent the first child
      // of the old parent. Otherwise, make it the second.
      if (sibling.parent.childOne === sibling) {
        node1.childOne = node2;
      } else {
        node1.childTwo = node2;
      }

      // Set the new parent's children.
      node2.childOne = sibling;
      node2.childTwo = node;
      sibling.parent = node2;
      node.parent = node2;

      // Build up the axis-aligned boxes in case we expanded them out.
      do {
        // If the old parent's box contains the new parent's box, leave.
        if (node1.box.contains(node2.box)) {
          break;
        }

        // Set the old parent's box to the combination of it's new
        // children's boxes.
        node1.box.setFromCombination(node1.childOne.box, node1.childTwo.box);
        node2 = node1;
        node1 = node1.parent;
      } while (node1 != null);
    } else {
      node2.childOne = sibling;
      node2.childTwo = node;
      sibling.parent = node2;
      node.parent = node2;
      _root = node2;
    }
  }

  /** Removes the given leaf from the tree. */
  void _removeLeaf(DynamicTreeNode argNode) {
    // If asked to remove the root, set the root to null. If that was also the
    // last leaf, then set lastLeaf to null as well.
    if (argNode === _root) {
      _root = null;
      if (_lastLeaf === argNode) {
        _lastLeaf = null;
      }
      return;
    }

    DynamicTreeNode node2 = argNode.parent;
    DynamicTreeNode node1 = node2.parent;
    DynamicTreeNode sibling;

    // Find the sibling of the node to remove.
    if (node2.childOne === argNode) {
      sibling = node2.childTwo;
    } else {
      sibling = node2.childOne;
    }

    // If the grandparent node of the node to remove isn't null, destroy the
    // parent node and connect the grandparent node directly to the sibling.
    if (node1 != null) {
      if (node1.childOne === node2) {
        node1.childOne = sibling;
      } else {
        node1.childTwo = sibling;
      }

      sibling.parent = node1;

      // Return the target's parent node to the node pool.
      _freeNode(node2);

      // Adjust the bounds of the boxes belong to the node-to-remove's
      // ancestors.
      while (node1 != null) {
        // Set the current node's box to a combination of it's children's boxes.
        // If this combination is contained within it's previous box, then exit
        // the loop. Otherwise, continue adjusting the bounds of the ancestor's
        // boxes.
        _tempBox.setFrom(node1.box);
        node1.box.setFromCombination(node1.childOne.box, node1.childTwo.box);
        if (_tempBox.contains(node1.box)) {
          break;
        }

        node1 = node1.parent;
      }
    } else {
      // The parent node was the root! So set the root to be the sibling.
      _root = sibling;
      sibling.parent = null;
      _freeNode(node2);
    }

    // If we just removed the last leaf, the root is the new last leaf.
    if (_lastLeaf === argNode) {
      _lastLeaf = _root;
    }
  }

  /** Computes the height of the overall tree. */
  int computeHeightFromRoot() {
    return _computeHeight(_root);
  }

  /** Computes the height of the given tree. */
  int _computeHeight(DynamicTreeNode node) {
    if (node == null) {
      return 0;
    }

    int heightOne = _computeHeight(node.childOne);
    int heightTwo = _computeHeight(node.childTwo);
    return 1 + Math.max(heightOne, heightTwo);
  }


  /**
   * Rebalances the tree for the given number of iterations. Does a post-order
   * traversal of the tree. If given enough iterations it will hit all nodes of
   * the tree. Starts at the last reinserted leaf.
   */
  void rebalance(int iterations) {
    if (_root == null) {
      return;
    }

    DynamicTreeNode current;
    for (int i = 0; i < iterations; i++) {
      current = _root;

      int bit = 0;
      while (!current.isLeaf) {
        int goLeft = (_path >> bit) & 1;
        if (goLeft == 0) {
          current = current.childOne;
        } else {
          current = current.childTwo;
        }

        bit = (bit + 1) & 31;
      }

      _path++;

      _removeLeaf(current);
      _insertLeaf(current);
    }
  }

  /** Returns a node to the node pool. */
  void _freeNode(DynamicTreeNode node) {
    assert(node != null);
    assert(_nodeCount > 0);
    _nodeStack.addFirst(node);
    _nodeCount--;
  }
}
