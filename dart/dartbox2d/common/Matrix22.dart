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
 * A 2x2 matrix class.
 */
class Matrix22 {
  Vector col1;
  Vector col2;

  /**
   * Constructs a new Matrix. Defaults to both columns being default vectors.
   */
  Matrix22([Vector c1 = null, Vector c2 = null]) {
    if (c1 == null) {
      c1 = new Vector();
    }
    if (c2 == null) {
      c2 = new Vector();
    }
    col1 = c1;
    col2 = c2;
  }

  /**
   * Constructs a new Matrix22 representing an angle.
   */
  Matrix22.fromAngle(num angle) :
    col1 = new Vector(),
    col2 = new Vector() {
    setAngle(angle);
  }

  /**
   * Create a new Matrix equal to the given Matrix.
   */
  Matrix22.copy(Matrix22 other) :
    col1 = new Vector.copy(other.col1),
    col2 = new Vector.copy(other.col2) { }

  /**
   * Returns true if given object is a Matrix22 and its col1 and col2 are equal
   * to the col1 and col2 of this Matrix22.
   */
  bool operator == (other) {
    if (other != null && other is Matrix22) {
      return col1 == other.col1 && col2 == other.col2;
    } else {
      return false;
    }
  }

  /**
   * Set as a matrix representing a rotation.
   */
  void setAngle(num angle) {
    num cosin = Math.cos(angle);
    num sin = Math.sin(angle);
    col1.setCoords(cosin, sin);
    col2.setCoords(-sin, cosin);
  }

  /**
   * Set as the identity matrix.
   */
  void setIdentity() {
    col1.setCoords(1, 0);
    col2.setCoords(0, 1);
  }

  /**
   * Sets this matrix's columns equal to the given vectors, respectively.
   */
  void setFromColumns(Vector v1, Vector v2) {
    col1.setFrom(v1);
    col2.setFrom(v2);
  }

  /**
   * Multiply this matrix by a vector. Return the result through the given out
   * parameter.
   */
  void multiplyVectorToOut(Vector v, Vector out) {
    num tempy = col1.y * v.x + col2.y * v.y;
    out.x = col1.x * v.x + col2.x * v.y;
    out.y = tempy;
  }

  /**
   * Sets this matrix to be equal to the given matrix.
   */
  void setFrom(Matrix22 matrix) {
    col1.setFrom(matrix.col1);
    col2.setFrom(matrix.col2);
  }

  /**
   * Multiply the given vector by the transpose of the given matrix and store
   * the result in the given parameter out.
   */
  static void mulTransMatrixAndVectorToOut(Matrix22 matrix, Vector vector,
      Vector out) {
    num outx = vector.x * matrix.col1.x + vector.y * matrix.col1.y;
    out.y = vector.x * matrix.col2.x + vector.y * matrix.col2.y;
    out.x = outx;
  }

  /**
   * Multiply the given vector by the given matrix and store
   * the result in the given parameter out.
   */
  static void mulMatrixAndVectorToOut(Matrix22 matrix, Vector vector,
      Vector out) {
    num tempy = matrix.col1.y * vector.x + matrix.col2.y * vector.y;
    out.x = matrix.col1.x * vector.x + matrix.col2.x * vector.y;
    out.y = tempy;
  }

  /** Inverts this Matrix. */
  Matrix22 invertLocal() {
    num a = col1.x, b = col2.x, c = col1.y, d = col2.y;
    num det = a * d - b * c;
    if (det != 0) {
      det = 1.0 / det;
    }
    col1.x = det * d;
    col2.x = -det * b;
    col1.y = -det * c;
    col2.y = det * a;
    return this;
  }

  /**
   * Adds the given matrix to this matrix. Returns this matrix.
   */
  Matrix22 addLocal(Matrix22 other) {
    col1.x += other.col1.x;
    col1.y += other.col1.y;
    col2.x += other.col2.x;
    col2.y += other.col2.y;
    return this;
  }

  void solveToOut(Vector b, Vector out) {
    num a11 = col1.x, a12 = col2.x, a21 = col1.y, a22 = col2.y;
    num det = a11 * a22 - a12 * a21;
    if (det != 0.0){
      det = 1.0 / det;
    }
    final num tempy =  det * (a11 * b.y - a21 * b.x) ;
    out.x = det * (a22 * b.x - a12 * b.y);
    out.y = tempy;
  }

  /** Returns a String showing this matrix values. */
  String toString() {
    return col1.toString() + ", " + col2.toString();
  }
}
