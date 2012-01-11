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
 * A manifold for two touching convex shapes. Box2D has support for many kinds
 * of contact, such as clip pont versus plain with radius and point versus point
 * with radius (as with circles).
 */
class Manifold {
  /** The points of contact. */
  final List<ManifoldPoint> points;

  /**
   * The meaning of the localNormal depends on the type of this manifold. The
   * different meanings (or lack thereof) are outlined below.
   * Circles: not used.
   * faceA: The normal on polygonA.
   * faceB: The normal on polygonB.
   */
  final Vector localNormal;

  /**
   * The meaning of the localPoint depends on the type of this manifold. The
   * different meanings (or lack thereof) are outlined below.
   * Circles: The local center of circleA.
   * faceA: The center of faceA.
   * faceB: The center of faceB.
   */
  final Vector localPoint;

  /** The type of manifold. See [ManifoldType]. */
  int type;

  /** The number of manifold points. */
  int pointCount;

  /**
   * Creates a manifold with 0 points. It's point array should be full of
   * already instantiated ManifoldPoints.
   */
  Manifold() :
    points = new List<ManifoldPoint>(Settings.MAX_MANIFOLD_POINTS),
    localNormal = new Vector(),
    localPoint = new Vector(),
    pointCount = 0 {

    for (int i = 0; i < Settings.MAX_MANIFOLD_POINTS; i++) {
      points[i] = new ManifoldPoint();
    }
  }

  /**
   * Creates a new manifold that is a copy of the given manifold.
   */
  Manifold.copy(Manifold other) :
    points = new List<ManifoldPoint>(Settings.MAX_MANIFOLD_POINTS),
    localNormal = new Vector.copy(other.localNormal),
    localPoint = new Vector.copy(other.localPoint),
    pointCount = other.pointCount,
    type = other.type {
    for (int i = 0; i < Settings.MAX_MANIFOLD_POINTS; i++) {
      points[i] = new ManifoldPoint.copy(other.points[i]);
    }
  }

  /**
   * Sets this manifold to be a copy of the given manifold.
   */
  void setFrom(Manifold other) {
    for (int i = 0; i < other.pointCount; i++) {
      points[i].setFrom(other.points[i]);
    }

    type = other.type;
    localNormal.setFrom(other.localNormal);
    localPoint.setFrom(other.localPoint);
    pointCount = other.pointCount;
  }
}
