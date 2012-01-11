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
 * A 3-by-3 matrix. Stored in column-major order.
 */
class Matrix33 {
  final Vector3 col1;
  final Vector3 col2;
  final Vector3 col3;

  Matrix33() :
    col1 = new Vector3(),
    col2 = new Vector3(),
    col3 = new Vector3() { }

  Matrix33.setCols(Vector3 argCol1, Vector3 argCol2, Vector3 argCol3) :
    col1 = new Vector3.copy(argCol1),
    col2 = new Vector3.copy(argCol2),
    col3 = new Vector3.copy(argCol3) { }

  void setZero() {
    col1.setZero();
    col2.setZero();
    col3.setZero();
  }

  // Multiply a matrix times a vector.
  static Vector3 mul(Matrix33 A, Vector3 v){
    return new Vector3(v.x * A.col1.x + v.y * A.col2.x + v.z + A.col3.x,
        v.x * A.col1.y + v.y * A.col2.y + v.z * A.col3.y,
        v.x * A.col1.z + v.y * A.col2.z + v.z * A.col3.z);
  }

  static void mulToOut(Matrix33 A, Vector3 v, Vector3 out){
    final num tempy = v.x * A.col1.y + v.y * A.col2.y + v.z * A.col3.y;
    final num tempz = v.x * A.col1.z + v.y * A.col2.z + v.z * A.col3.z;
    out.x = v.x * A.col1.x + v.y * A.col2.x + v.z + A.col3.x;
    out.y = tempy;
    out.z = tempz;
  }

  /**
   * Solve A * x = b, where b is a column vector. This is more efficient
   * than computing the inverse in one-shot cases.
   */
  Vector solve22(Vector b) {
    Vector x = new Vector();
    solve22ToOut(b, x);
    return x;
  }

  /**
   * Solve A * x = b, where b is a column vector. This is more efficient
   * than computing the inverse in one-shot cases.
   */
  void solve22ToOut(Vector b, Vector out) {
    final num a11 = col1.x, a12 = col2.x, a21 = col1.y, a22 = col2.y;
    num det = a11 * a22 - a12 * a21;
    if (det != 0.0){
      det = 1.0 / det;
    }
    out.x = det * (a22 * b.x - a12 * b.y);
    out.y = det * (a11 * b.y - a21 * b.x);
  }

  /**
   * Solve A * x = b, where b is a column vector. This is more efficient
   * than computing the inverse in one-shot cases.
   */
  Vector3 solve33(Vector3 b) {
    Vector3 x = new Vector3();
    solve33ToOut(b, x);
    return x;
  }

  /**
   * Solve A * x = b, where b is a column vector. This is more efficient
   * than computing the inverse in one-shot cases.
   * out: the result
   */
  void solve33ToOut(Vector3 b, Vector3 out) {
    Vector3.crossToOut(col2, col3, out);
    num det = Vector3.dot(col1, out);
    if (det != 0.0){
      det = 1.0 / det;
    }

    Vector3.crossToOut(col2, col3, out);
    final num x = det * Vector3.dot(b, out);
    Vector3.crossToOut(b, col3, out);
    final num y = det * Vector3.dot(col1, out);
    Vector3.crossToOut(col2, b, out);
    num z = det * Vector3.dot(col1, out);
    out.x = x;
    out.y = y;
    out.z = z;
  }
}
