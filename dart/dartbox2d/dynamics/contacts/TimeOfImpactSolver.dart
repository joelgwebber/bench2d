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
 * This is a pure position solver for a single movable body in contact with
 * multiple non-moving bodies.
 */
class TimeOfImpactSolver {
  List<TimeOfImpactConstraint> constraints;
  int count;
  Body toiBody;

  /** Pooling. */
  final TimeOfImpactSolverManifold psm;
  final Vector rA;
  final Vector rB;
  final Vector P;
  final Vector temp;

  TimeOfImpactSolver() :
    count = 0,
    toiBody = null,
    constraints = new List<TimeOfImpactConstraint>(4),

    // Initialize pool variables.
    psm = new TimeOfImpactSolverManifold(),
    rA = new Vector(),
    rB = new Vector(),
    P = new Vector(),
    temp = new Vector() {
    for (int i = 0; i<constraints.length; i++){
      constraints[i] = new TimeOfImpactConstraint();
    }
  }

  void initialize(List<Contact> contacts, int argCount, Body argToiBody) {
    count = argCount;
    toiBody = argToiBody;

    if(count >= constraints.length){
      List<TimeOfImpactConstraint> old = constraints;
      int newLen = Math.max(count, old.length*2);
      constraints = new List<TimeOfImpactConstraint>(newLen);
      constraints.setRange(0, old.length, old);
      for(int i=old.length; i<constraints.length; i++){
        constraints[i] = new TimeOfImpactConstraint();
      }
    }

    for (int i=0; i<count; i++) {
      Contact contact = contacts[i];

      Fixture fixtureA = contact.fixtureA;
      Fixture fixtureB = contact.fixtureB;
      Shape shapeA = fixtureA.shape;
      Shape shapeB = fixtureB.shape;
      num radiusA = shapeA.radius;
      num radiusB = shapeB.radius;
      Body bodyA = fixtureA.body;
      Body bodyB = fixtureB.body;
      Manifold manifold = contact.manifold;

      assert(manifold.pointCount > 0);

      TimeOfImpactConstraint constraint = constraints[i];
      constraint.bodyA = bodyA;
      constraint.bodyB = bodyB;
      constraint.localNormal.setFrom(manifold.localNormal);
      constraint.localPoint.setFrom(manifold.localPoint);
      constraint.type = manifold.type;
      constraint.pointCount = manifold.pointCount;
      constraint.radius = radiusA + radiusB;

      for (int j = 0; j < constraint.pointCount; ++j){
        ManifoldPoint cp = manifold.points[j];
        constraint.localPoints[j] = cp.localPoint;
      }
    }
  }

  /**
   * Perform one solver iteration. Returns true if converged.
   */
  bool solve(num baumgarte){
    num minSeparation = 0;

    for (int i = 0; i < count; ++i){
      TimeOfImpactConstraint c = constraints[i];
      Body bodyA = c.bodyA;
      Body bodyB = c.bodyB;

      num massA = bodyA.mass;
      num massB = bodyB.mass;

      // Only the TimeOfImpact body should move.
      if (bodyA == toiBody){
        massB = 0.0;
      } else{
        massA = 0.0;
      }

      num invMassA = massA * bodyA.invMass;
      num invIA = massA * bodyA.invInertia;
      num invMassB = massB * bodyB.invMass;
      num invIB = massB * bodyB.invInertia;

      // Solve normal constraints
      for (int j = 0; j < c.pointCount; ++j){
        psm.initialize(c, j);
        Vector normal = psm.normal;

        Vector point = psm.point;
        num separation = psm.separation;

        rA.setFrom(point).subLocal(bodyA.sweep.center);
        rB.setFrom(point).subLocal(bodyB.sweep.center);

        // Track max constraint error.
        minSeparation = Math.min(minSeparation, separation);

        // Prevent large corrections and allow slop.
        num C = MathBox.clamp(baumgarte * (separation +
            Settings.LINEAR_SLOP), -Settings.MAX_LINEAR_CORRECTION, 0.0);

        // Compute the effective mass.
        num rnA = Vector.crossVectors(rA, normal);
        num rnB = Vector.crossVectors(rB, normal);
        num K = invMassA + invMassB + invIA * rnA * rnA + invIB * rnB * rnB;

        // Compute normal impulse
        num impulse = K > 0.0 ? - C / K : 0.0;

        P.setFrom(normal).mulLocal(impulse);

        temp.setFrom(P).mulLocal(invMassA);
        bodyA.sweep.center.subLocal(temp);
        bodyA.sweep.angle -= invIA * Vector.crossVectors(rA, P);
        bodyA.synchronizeTransform();

        temp.setFrom(P).mulLocal(invMassB);
        bodyB.sweep.center.addLocal(temp);
        bodyB.sweep.angle += invIB * Vector.crossVectors(rB, P);
        bodyB.synchronizeTransform();
      }
    }

    // We can't expect minSpeparation >= -_LINEAR_SLOP because we don't
    // push the separation above -_LINEAR_SLOP.
    return minSeparation >= -1.5 * Settings.LINEAR_SLOP;
  }
}

class TimeOfImpactSolverManifold {
  final Vector normal;
  final Vector point;
  num separation;

  /** Pooling */
  final Vector pointA;
  final Vector pointB;
  final Vector temp;
  final Vector planePoint;
  final Vector clipPoint;

  /** constructor that initiliazes everything. */
  TimeOfImpactSolverManifold() :
    normal = new Vector(),
    point = new Vector(),
    separation = 0,
    pointA = new Vector(),
    pointB = new Vector(),
    temp = new Vector(),
    planePoint = new Vector(),
    clipPoint = new Vector() { }

  void initialize(TimeOfImpactConstraint cc, int index) {
    assert(cc.pointCount > 0);

    switch (cc.type) {
      case ManifoldType.CIRCLES:
        pointA.setFrom(cc.bodyA.getWorldPoint(cc.localPoint));
        pointB.setFrom(cc.bodyB.getWorldPoint(cc.localPoints[0]));
        if (MathBox.distanceSquared(pointA, pointB) > Settings.EPSILON
            * Settings.EPSILON) {
          normal.setFrom(pointB).subLocal(pointA);
          normal.normalize();
        } else {
          normal.setCoords(1, 0);
        }

        point.setFrom(pointA).addLocal(pointB).mulLocal(.5);
        temp.setFrom(pointB).subLocal(pointA);
        separation = Vector.dot(temp, normal) - cc.radius;
        break;

      case ManifoldType.FACE_A:
        normal.setFrom(cc.bodyA.getWorldVector(cc.localNormal));
        planePoint.setFrom(cc.bodyA.getWorldPoint(cc.localPoint));

        clipPoint.setFrom(cc.bodyB.getWorldPoint(cc.localPoints[index]));
        temp.setFrom(clipPoint).subLocal(planePoint);
        separation = Vector.dot(temp, normal) - cc.radius;
        point.setFrom(clipPoint);
        break;

      case ManifoldType.FACE_B:
        normal.setFrom(cc.bodyB.getWorldVector(cc.localNormal));
        planePoint.setFrom(cc.bodyB.getWorldPoint(cc.localPoint));

        clipPoint.setFrom(cc.bodyA.getWorldPoint(cc.localPoints[index]));
        temp.setFrom(clipPoint).subLocal(planePoint);
        separation = Vector.dot(temp, normal) - cc.radius;
        point.setFrom(clipPoint);

        // Ensure normal points from A to B
        normal.negateLocal();
        break;
    }
  }
}
