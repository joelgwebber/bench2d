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
 * A transform is a translation and a rotation. It represents the position and
 * orientation of rigid frames.
 */
class Transform {
  /** The translation caused by a transform. */
  final Vector position;

  /** A matrix representing a rotation. */
  final Matrix22 rotation;

  /**
   * Constructs a new transform with a vector at the origin and no rotation.
   */
  Transform() :
    position = new Vector(),
    rotation = new Matrix22() { }

  /**
   * Constructs a new transform equal to the given transform.
   */
  Transform.copy(Transform other) :
    position = new Vector.copy(other.position),
    rotation = new Matrix22.copy(other.rotation) { }

  bool operator == (other) {
    if (other == null) {
      return false;
    } else {
      return position == other.position && rotation == other.rotation;
    }
  }

  /**
   * Sets this transform with the given position and rotation.
   */
  void setFromPositionAndRotation(Vector argPosition,
      Matrix22 argRotation) {
    position.setFrom(argPosition);
    rotation.setFrom(argRotation);
  }

  /**
   * Sets this transform equal to the given transform.
   */
  void setFrom(Transform other) {
    position.setFrom(other.position);
    rotation.setFrom(other.rotation);
  }

  /**
   * Multiply the given transform and given vector and return a new Vector with
   * the result.
   */
  static Vector mul(Transform T, Vector v) {
    return new Vector(T.position.x + T.rotation.col1.x * v.x +
        T.rotation.col2.x * v.y, T.position.y + T.rotation.col1.y * v.x +
        T.rotation.col2.y * v.y);
  }

  /**
   * Multiplies the given transform and the given vector and places the result
   * in the given out parameter.
   */
  static void mulToOut(Transform transform, Vector vector, Vector out) {
    assert(out != null);
    num tempY = transform.position.y + transform.rotation.col1.y *
        vector.x + transform.rotation.col2.y * vector.y;
    out.x = transform.position.x + transform.rotation.col1.x * vector.x +
        transform.rotation.col2.x * vector.y;
    out.y = tempY;
  }

  static void mulTransToOut(Transform T, Vector v, Vector out) {
    num v1x = v.x - T.position.x;
    num v1y = v.y - T.position.y;
    Vector b = T.rotation.col1;
    Vector b1 = T.rotation.col2;
    num tempy = v1x * b1.x + v1y * b1.y;
    out.x = v1x * b.x + v1y * b.y;
    out.y = tempy;
  }
}
