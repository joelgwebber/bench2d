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
 * Used to compute the current state of a contact manifold.
 */
class WorldManifold {
  /**
   * World vector pointing from A to B
   */
  final Vector normal;

  /**
   * World contact points (points of intersection)
   */
  final List<Vector> points;

  /**
   * Temporary Vectors that are constructed on construction. Used to prevent
   * object construction while stepping.
   */
  final Vector pool3;
  final Vector pool4;

  /**
   * Constructs a new WorldManifold.
   */
  WorldManifold() :
    normal = new Vector(),
    pool3 = new Vector(),
    pool4 = new Vector(),
    points = new List<Vector>(Settings.MAX_MANIFOLD_POINTS) {
    for (int i = 0; i < Settings.MAX_MANIFOLD_POINTS; i++) {
      points[i] = new Vector();
    }
  }

  void initialize(Manifold manifold, Transform xfA, num radiusA, Transform xfB,
      num radiusB) {
    switch (manifold.type) {
      case ManifoldType.CIRCLES:
        final Vector pointA = pool3;
        final Vector pointB = pool4;

        normal.x = 1;
        normal.y = 0;
        pointA.x = xfA.position.x + xfA.rotation.col1.x *
            manifold.localPoint.x + xfA.rotation.col2.x * manifold.localPoint.y;
        pointA.y = xfA.position.y + xfA.rotation.col1.y *
            manifold.localPoint.x + xfA.rotation.col2.y * manifold.localPoint.y;
        pointB.x = xfB.position.x + xfB.rotation.col1.x *
            manifold.points[0].localPoint.x + xfB.rotation.col2.x *
            manifold.points[0].localPoint.y;
        pointB.y = xfB.position.y + xfB.rotation.col1.y *
            manifold.points[0].localPoint.x + xfB.rotation.col2.y *
            manifold.points[0].localPoint.y;

        if (MathBox.distanceSquared(pointA, pointB) > Settings.EPSILON *
            Settings.EPSILON) {
          normal.x = pointB.x - pointA.x;
          normal.y = pointB.y - pointA.y;
          normal.normalize();
        }

        num cAx = normal.x * radiusA + pointA.x;
        num cAy = normal.y * radiusA + pointA.y;

        num cBx = -normal.x * radiusB + pointB.x;
        num cBy = -normal.y * radiusB + pointB.y;

        points[0].x = (cAx + cBx) *.5;
        points[0].y = (cAy + cBy) *.5;
        return;
      case ManifoldType.FACE_A:
        final Vector planePoint = pool3;

        normal.x = xfA.rotation.col1.x * manifold.localNormal.x +
            xfA.rotation.col2.x * manifold.localNormal.y;
        normal.y = xfA.rotation.col1.y * manifold.localNormal.x +
            xfA.rotation.col2.y * manifold.localNormal.y;
        planePoint.x = xfA.position.x + xfA.rotation.col1.x *
            manifold.localPoint.x + xfA.rotation.col2.x * manifold.localPoint.y;
        planePoint.y = xfA.position.y + xfA.rotation.col1.y *
            manifold.localPoint.x + xfA.rotation.col2.y * manifold.localPoint.y;

        final Vector clipPoint = pool4;

        for (int i = 0; i < manifold.pointCount; i++) {
          clipPoint.x = xfB.position.x + xfB.rotation.col1.x *
              manifold.points[i].localPoint.x + xfB.rotation.col2.x *
              manifold.points[i].localPoint.y;
          clipPoint.y = xfB.position.y + xfB.rotation.col1.y *
              manifold.points[i].localPoint.x + xfB.rotation.col2.y *
              manifold.points[i].localPoint.y;

          num scalar = radiusA - ((clipPoint.x - planePoint.x) *
              normal.x + (clipPoint.y - planePoint.y) * normal.y);

          num cAx = normal.x * scalar + clipPoint.x;
          num cAy = normal.y * scalar + clipPoint.y;

          num cBx = - normal.x * radiusB + clipPoint.x;
          num cBy = - normal.y * radiusB + clipPoint.y;

          points[i].x = (cAx + cBx)*.5;
          points[i].y = (cAy + cBy)*.5;
        }

        return;
      case ManifoldType.FACE_B :
        final Vector planePoint = pool3;

        final Matrix22 R = xfB.rotation;
        normal.x = R.col1.x * manifold.localNormal.x + R.col2.x *
            manifold.localNormal.y;
        normal.y = R.col1.y * manifold.localNormal.x + R.col2.y *
            manifold.localNormal.y;
        final Vector v = manifold.localPoint;
        planePoint.x = xfB.position.x + xfB.rotation.col1.x * v.x +
            xfB.rotation.col2.x * v.y;
        planePoint.y = xfB.position.y + xfB.rotation.col1.y * v.x +
            xfB.rotation.col2.y * v.y;

        final Vector clipPoint = pool4;

        for (int i = 0; i < manifold.pointCount; i++) {

          clipPoint.x = xfA.position.x + xfA.rotation.col1.x *
              manifold.points[i].localPoint.x + xfA.rotation.col2.x *
              manifold.points[i].localPoint.y;
          clipPoint.y = xfA.position.y + xfA.rotation.col1.y *
              manifold.points[i].localPoint.x + xfA.rotation.col2.y *
              manifold.points[i].localPoint.y;

          num scalar = radiusB - ((clipPoint.x - planePoint.x) * normal.x +
              (clipPoint.y - planePoint.y) * normal.y);

          num cBx =  normal.x * scalar + clipPoint.x;
          num cBy =  normal.y * scalar + clipPoint.y;

          num cAx = - normal.x * radiusA + clipPoint.x;
          num cAy = - normal.y * radiusA + clipPoint.y;

          points[i].x = (cAx + cBx) *.5;
          points[i].y = (cAy + cBy) *.5;
        }
        // Ensure normal points from A to B.
        normal.x = -normal.x;
        normal.y = -normal.y;
        break;
     }
  }
}
