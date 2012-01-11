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

class ContactConstraint {
  List<ContactConstraintPoint> points;

  final Vector localNormal;
  final Vector localPoint;
  final Vector normal;

  final Matrix22 normalMass;
  //TODO(gregbglw): What does K mean? Find out and change the name.
  final Matrix22 K;

  Body bodyA;
  Body bodyB;

  int type;

  num radius;
  num friction;
  num restitution;
  int pointCount;

  Manifold manifold;

  ContactConstraint() :
    points = new List<ContactConstraintPoint>(Settings.MAX_MANIFOLD_POINTS),
    pointCount = 0,
    manifold = null,
    localNormal = new Vector(),
    localPoint = new Vector(),
    normal = new Vector(),
    normalMass = new Matrix22(),
    K = new Matrix22() {
    for (int i = 0; i < Settings.MAX_MANIFOLD_POINTS; i++) {
        points[i] = new ContactConstraintPoint();
    }
  }

  void setFrom(ContactConstraint cp) {
    pointCount = cp.pointCount;
    localNormal.setFrom(cp.localNormal);
    localPoint.setFrom(cp.localPoint);
    normal.setFrom(cp.normal);
    normalMass.setFrom(cp.normalMass);
    K.setFrom(cp.K);
    bodyA = cp.bodyA;
    bodyB = cp.bodyB;
    type = cp.type;
    radius = cp.radius;
    friction = cp.friction;
    restitution = cp.restitution;
    manifold = cp.manifold;
    for(int i=0; i<cp.pointCount; i++) {
      points[i].setFrom(cp.points[i]);
    }
  }

  String toString() {
    String result = 'localNormal: "$localNormal", localPoint: "$localPoint" ' +
        'normal: "$normal", radius: "$radius" friction: "$friction" ' +
        'restitution: "$restitution", pointCount: "$pointCount"';
    return result;
  }
}
