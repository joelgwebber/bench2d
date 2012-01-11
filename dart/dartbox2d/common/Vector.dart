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

/** A 2-dimensional vector class. */
//TODO(gregbglw): Consider if/how should reconcile this with touch/vector.
class Vector {
  // Each vector is defined as the vector originating from (0,0) to these x and
  // y coordinates.
  num x;
  num y;

  Vector([this.x = 0, this.y = 0]) { }

  /**
   * Constructs a new vector with the same coordinates as the given vector.
   */
  Vector.copy(Vector other) : x = other.x, y = other.y { }

  /**
   * Returns true if given object is a Vector with the same x and y values as
   * this vector. Returns false otherwise.
   */
  bool operator == (other) {
    if (other == null) {
      return false;
    } else {
      return x == other.x && y == other.y;
    }
  }

  /**
   * Update the current vector by adding v.
   */
  Vector addLocal(Vector v) {
    x += v.x;
    y += v.y;
    return this;
  }

  /**
   * Subtracts the given vector from this vector.
   */
  Vector subLocal(Vector other) {
    x -= other.x;
    y -= other.y;
    return this;
  }

  Vector setCoords(num xCoord, num yCoord) {
    x = xCoord;
    y = yCoord;
    return this;
  }

  static num crossVectors(Vector v1, Vector v2) {
    return (v1.x * v2.y - v1.y * v2.x);
  }

  /**
   * Return the dot product of the two given vectors.
   */
  static num dot(Vector one, Vector two) {
    return one.x * two.x + one.y * two.y;
  }

  /**
   * Has the effect of swapping the x and y coordinates of the vector,
   * multiplying both by the given number, and then flipping the sign of the new
   * x coordinate. Returns the result through the out parameter.
   */
  static void crossNumAndVectorToOut(num s, Vector a, Vector out) {
    num tempY = s * a.x;
    out.x = -s * a.y;
    out.y = tempY;
  }

  /**
   * Has the effect of swapping the x and y coordinates of the vector,
   * multiplying both by the given number, and then flipping the sign of the new
   * y coordinate. Returns the result through the out parameter.
   */
  static void crossVectorAndNumToOut(Vector a, num s, Vector out) {
    num tempy = -s * a.x;
    out.x = s * a.y;
    out.y = tempy;
  }

  /**
   * Sets this vector to be a copy of the given vector.
   */
  Vector setFrom(Vector v) {
    setCoords(v.x, v.y);
    return this;
  }

  /**
   * Multiplies this vector by the given number.
   */
  Vector mulLocal(num d) {
    x *= d;
    y *= d;
    return this;
  }

  Vector setZero() {
    setCoords(0, 0);
    return this;
  }

  num get length() {
    return Math.sqrt(x * x + y * y);
  }

  /**
   * Take the minimum of each coordinate from the two given vectors and store
   * the result in the given out vector.
   */
  static void minToOut(Vector a, Vector b, Vector out) {
    out.x = a.x < b.x ? a.x : b.x;
    out.y = a.y < b.y ? a.y : b.y;
  }

  /**
   * Take the maximum of each coordinate from the two given vectors and store
   * the result in the given out vector.
   */
  static void maxToOut(Vector a, Vector b, Vector out) {
    out.x = a.x > b.x ? a.x : b.x;
    out.y = a.y > b.y ? a.y : b.y;
  }

  /**
   * Returns the length of this vector, squared.
   */
  num get lengthSquared() {
    return x * x + y * y;
  }

  /**
   * Set the x and y coordinates of this vector to absolute values.
   */
  void absLocal() {
    x = x.abs();
    y = y.abs();
  }

  /**
   * Normalizes this vector and returns the length before normalization.
   */
  num normalize() {
    num len = length;
    if (len < Settings.EPSILON) {
      return 0;
    }

    num invLength = 1.0 / len;
    x *= invLength;
    y *= invLength;
    return len;
  }

  /**
   * Returns the distance between the point defined by this vector and the given
   * vector.
   */
  num distanceBetween(Vector v) {
    num xDelta = this.x - v.x;
    num yDelta = this.y - v.y;
    return Math.sqrt(xDelta * xDelta + yDelta * yDelta);
  }

  /**
   * Returns a vector that is the result of rotating the original vector by
   * angle degrees counter-clockwise.
   */
  Vector rotate(num angle) {
    Matrix22 mtx = new Matrix22();
    mtx.setAngle(angle);
    Vector temp = new Vector();
    mtx.multiplyVectorToOut(this, temp);
    return temp;
  }

  /**
   * Flips this vector such that the +/- of each x and y are reversed.
   */
  Vector negateLocal() {
    x = -x;
    y = -y;
    return this;
  }

  /**
   * Returns if the values of coordinates within the MAX_INTEGER.
   */
  bool isValid() {
    return !x.isInfinite() && !x.isNaN() && !y.isInfinite() && !y.isNaN();
  }

  /**
   * Returns a String representation of the given vector.
   */
  String toString() {
    return "(" + x + ", " + y + ")";
  }
}
