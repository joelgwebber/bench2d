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

//TODO(gregbglw): Pull what is shared from here and in touch/Math.dart into a
// common util.
class MathBox {
  static final num _2PI = Math.PI * 2;

  MathBox() { }

  /**
   * Return the distance between the two given vectors, but squared.
   */
  static num distanceSquared(Vector v1, Vector v2) {
    num dx = (v1.x - v2.x);
    num dy = (v1.y - v2.y);
    return dx * dx + dy * dy;
  }

  /**
   * Return the distance between the two given vectors.
   */
  static num distance(Vector v1, Vector v2) {
    return Math.sqrt(distanceSquared(v1, v2));
  }

  /** Returns the closest value to 'a' that is in between 'low' and 'high' */
  static num clamp(num a, num low, num high) {
    return Math.max(low, Math.min(a, high));
  }

  /**
   * Given a value within the range specified by fromMin and fromMax, returns a
   * value with the same relative position in the range specified from toMin and
   * toMax. For example, given a val of 2 in the "from range" of 0-4, and a
   * "to range" of 10-20, would return 15.
   */
  static num translateAndScale(num val, num fromMin, num fromMax, num toMin,
      num toMax) {
    final num mult = (val - fromMin) / (fromMax - fromMin);
    final num res = toMin + mult * (toMax - toMin);
    return res;
  }
}
