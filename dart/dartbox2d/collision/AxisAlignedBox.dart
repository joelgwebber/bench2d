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
 * An axis-aligned bounding box.
 */
class AxisAlignedBox {
  /** Bottom left vertex of bounding box. */
  Vector lowerBound;

  /** Top right vertex of bounding box. */
  Vector upperBound;

  /**
   * Constructs a new box with the given lower and upper bounds. If no bounds
   * are specified, constructs the box with both bounds at the origin.
   */
  AxisAlignedBox([this.lowerBound = null, this.upperBound = null]) {
    if (lowerBound == null) {
      lowerBound = new Vector();
    }
    if (upperBound == null) {
      upperBound = new Vector();
    }
  }

  /**
   * Sets this box to be a combination of the two given boxes.
   * The combination is determined by picking and choosing the lowest x and y
   * values from the lowerBounds to form a new lower bound and picking and
   * choosing the largest x and y values from the upperBounds to form a new
   * upperBound.
   */
  void setFromCombination(AxisAlignedBox boxOne, AxisAlignedBox boxTwo) {
    lowerBound.x = Math.min(boxOne.lowerBound.x, boxTwo.lowerBound.x);
    lowerBound.y = Math.min(boxOne.lowerBound.y, boxTwo.lowerBound.y);
    upperBound.x = Math.max(boxOne.upperBound.x, boxTwo.upperBound.x);
    upperBound.y = Math.max(boxOne.upperBound.y, boxTwo.upperBound.y);
  }

  /**
   * Sets the bounds to the given values.
   */
  AxisAlignedBox setBounds(Vector lower, Vector upper) {
    lowerBound.setFrom(lower);
    upperBound.setFrom(upper);
    return this;
  }

  /**
   * Returns true if the given box overlaps with this box.
   */
 static bool testOverlap(AxisAlignedBox a, AxisAlignedBox b) {
   if (b.lowerBound.x > a.upperBound.x || b.lowerBound.y > a.upperBound.y) {
     return false;
   }

   if (a.lowerBound.x > b.upperBound.x || a.lowerBound.y > b.upperBound.y) {
     return false;
   }

   return true;
 }

  /**
   * Returns true if the lower bound is strictly less than the upper bound and
   * both bounds are themselves valid (Vector.isValid() returns true).
   */
  bool isValid() {
    return lowerBound.isValid() && upperBound.isValid()
        && lowerBound.x < upperBound.x && lowerBound.y < upperBound.y;
  }

  /**
   * Returns the center of this box.
   */
  Vector get center() {
    Vector c = new Vector.copy(lowerBound);
    c.addLocal(upperBound);
    c.mulLocal(.5);
    return c;
  }

  /**
   * Returns true if this box contains the given box.
   */
  bool contains(AxisAlignedBox aabb) {
    return lowerBound.x > aabb.lowerBound.x &&
        lowerBound.y > aabb.lowerBound.y && upperBound.y < aabb.upperBound.y
        && upperBound.x < aabb.upperBound.x;
  }

  /**
   * Sets this box to be a copy of the given box.
   */
  void setFrom(AxisAlignedBox other) {
    lowerBound.setFrom(other.lowerBound);
    upperBound.setFrom(other.upperBound);
  }

  String toString() {
    return lowerBound.toString() + ", " + upperBound.toString();
  }
}
