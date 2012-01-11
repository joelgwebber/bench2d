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
 * A shape commonly known as the circle.
 */
class CircleShape extends Shape {
  /**
   * The current position of the center of this circle.
   */
  final Vector position;

  /** Used internally to avoid constructing while running. */
  final Vector pool1;
  final Vector pool2;
  final Vector pool3;

  /**
   * A constructor for internal use only. Instead use Body.createShape with a
   * CircleDef.
   */
  CircleShape() :
    super(ShapeType.CIRCLE, 0),
    position = new Vector(),
    pool1 = new Vector(),
    pool2 = new Vector(),
    pool3 = new Vector() {
  }

  /**
   * Constructs a new CircleShape equal to the given CircleShape.
   */
  CircleShape.copy(CircleShape other) :
    super(other.type, other.radius),
    position = new Vector.copy(other.position),
    pool1 = new Vector(),
    pool2 = new Vector(),
    pool3 = new Vector() { }


  /**
   * Returns true if the point is contained in the given shape when the given
   * rotation transform is applied. Implements superclass abstract method of
   * the same name.
   */
  bool testPoint(Transform transform, Vector point) {
    Vector center = pool1;
    transform.rotation.multiplyVectorToOut(position, center);
    center.addLocal(transform.position);

    Vector d = center.subLocal(point).negateLocal();
    return Vector.dot(d, d) <= radius * radius;
  }

  /**
   * Compute the axis aligned box for this Shape when the given transform is
   * applied. Stores the result in the given box.
   */
  void computeAxisAlignedBox(AxisAlignedBox argBox, Transform argTransform) {
    Vector p = pool1;
    Matrix22.mulMatrixAndVectorToOut(argTransform.rotation, position, p);
    p.addLocal(argTransform.position);

    argBox.lowerBound.setCoords(p.x - radius, p.y - radius);
    argBox.upperBound.setCoords(p.x + radius, p.y + radius);
  }

  /** Returns a clone of this circle. */
  Shape clone() {
    return new CircleShape.copy(this);
  }

  /**
   * Computes the mass properties of this Circle at the given density and stores
   * the result in the given MassData object.
   */
  void computeMass(MassData massData, num density) {
    massData.mass = density * Math.PI * radius * radius;
    massData.center.setFrom(position);

    // Store inertia above the local origin.
    massData.inertia = massData.mass * (.5 * radius * radius +
        Vector.dot(position, position));
  }
}
