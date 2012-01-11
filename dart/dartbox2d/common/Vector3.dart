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

/** A three dimensional vector. */
class Vector3 {
  // Each vector is defined as the vector originating from (0,0) to the point
  // defined by these values.
  num x;
  num y;
  num z;

  Vector3([this.x = 0, this.y = 0, this.z = 0]) { }

  Vector3.copy(Vector3 argCopy) {
    x = argCopy.x;
    y = argCopy.y;
    z = argCopy.z;
  }

  bool operator == (other) {
    if (other != null && other is Vector3) {
      return x == other.x && y == other.y && z == other.z;
    } else {
      return false;
    }
  }

  /** Sets this vector equal to the given vector. */
  Vector3 setFrom(Vector3 argVec) {
    x = argVec.x;
    y = argVec.y;
    z = argVec.z;
    return this;
  }

  /** Sets the vectors coordinate values to those given. */
  Vector3 setCoords(num argX, num argY, num argZ) {
    x = argX;
    y = argY;
    z = argZ;
    return this;
  }

  Vector3 addLocal(Vector3 argVec) {
    x += argVec.x;
    y += argVec.y;
    z += argVec.z;
    return this;
  }

  Vector3 add(Vector3 argVec) {
    return new Vector3(x + argVec.x, y + argVec.y, z + argVec.z);
  }

  Vector3 subLocal(Vector3 argVec) {
    x -= argVec.x;
    y -= argVec.y;
    z -= argVec.z;
    return this;
  }

  Vector3 sub(Vector3 argVec) {
    return new Vector3(x - argVec.x, y - argVec.y, z - argVec.z);
  }

  Vector3 mulLocal(num argScalar) {
    x *= argScalar;
    y *= argScalar;
    z *= argScalar;
    return this;
  }

  Vector3 mul(num argScalar) {
    return new Vector3(x * argScalar, y * argScalar, z * argScalar);
  }

  Vector3 negateLocal() {
    x = -x;
    y = -y;
    z = -z;
    return this;
  }

  void setZero() {
    x = 0;
    y = 0;
    z = 0;
  }

  String toString() {
    return "(" + x + "," + y + "," + z + ")";
  }

  static num dot(Vector3 a, Vector3 b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  static Vector3 cross(Vector3 a, Vector3 b) {
    return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z,
        a.x * b.y - a.y * b.x);
  }

  static void crossToOut(Vector3 a, Vector3 b, Vector3 out) {
    final num tempy = a.z * b.x - a.x * b.z;
    final num tempz = a.x * b.y - a.y * b.x;
    out.x = a.y * b.z - a.z * b.y;
    out.y = tempy;
    out.z = tempz;
  }
}
