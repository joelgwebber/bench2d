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

//  GJK using Voronoi regions (Christer Ericson) and Barycentric coordinates.
class SimplexVertex {
  final Vector wA; // support point in shapeA
  final Vector wB; // support point in shapeB
  final Vector w; // wB - wA
  num a; // barycentric coordinate for closest point
  int indexA; // wA index
  int indexB; // wB index

  SimplexVertex() :
    wA = new Vector(),
    wB = new Vector(),
    w = new Vector(),
    a = 0,
    indexA = 0,
    indexB = 0 { }

  void setFrom(SimplexVertex sv) {
    wA.setFrom(sv.wA);
    wB.setFrom(sv.wB);
    w.setFrom(sv.w);
    a = sv.a;
    indexA = sv.indexA;
    indexB = sv.indexB;
  }

  String toString() {
    return "wA: " + wA.toString() + " wB: " + wB.toString() + " w: " +
        w.toString();
  }
}
