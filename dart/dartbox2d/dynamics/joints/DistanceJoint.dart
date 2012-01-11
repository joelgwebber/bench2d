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
 * A distance joint constrains two points on two bodies
 * to remain at a fixed distance from each other. You can view
 * this as a massless, rigid rod.
 */
class DistanceJoint extends Joint {
  final Vector localAnchor1;
  final Vector localAnchor2;
  final Vector u;
  num impulse;

  /** Effective mass for the constraint. */
  num mass;
  num length;
  num frequencyHz;
  num dampingRatio;
  num gamma;
  num bias;

  DistanceJoint(DistanceJointDef def) :
    super(def),
    localAnchor1 = new Vector.copy(def.localAnchorA),
    localAnchor2 = new Vector.copy(def.localAnchorB),
    length = def.length,
    impulse = 0.0,
    u = new Vector(),
    frequencyHz = def.frequencyHz,
    dampingRatio = def.dampingRatio,
    gamma = 0.0,
    bias = 0.0 { }

  void getAnchorA(Vector argOut) {
    bodyA.getWorldPointToOut(localAnchor1, argOut);
  }

  void getAnchorB(Vector argOut) {
    bodyB.getWorldPointToOut(localAnchor2, argOut);
  }

  void getReactionForce(num inv_dt, Vector argOut) {
    argOut.x = impulse * u.x * inv_dt;
    argOut.y = impulse * u.y * inv_dt;
  }

  num getReactionTorque(num inv_dt) {
    return 0.0;
  }

  void initVelocityConstraints(TimeStep step) {
    final Body b1 = bodyA;
    final Body b2 = bodyB;

    Vector r1 = new Vector();
    Vector r2 = new Vector();

    // Compute the effective mass matrix.
    r1.setFrom(localAnchor1).subLocal(b1.localCenter);
    r2.setFrom(localAnchor2).subLocal(b2.localCenter);
    Matrix22.mulMatrixAndVectorToOut(b1.originTransform.rotation, r1, r1);
    Matrix22.mulMatrixAndVectorToOut(b2.originTransform.rotation, r2, r2);

    u.x = b2.sweep.center.x + r2.x - b1.sweep.center.x - r1.x;
    u.y = b2.sweep.center.y + r2.y - b1.sweep.center.y - r1.y;

    // Handle singularity.
    num len = u.length;
    if (len > Settings.LINEAR_SLOP) {
      u.x *= 1.0 / len;
      u.y *= 1.0 / len;
    } else {
      u.setCoords(0.0, 0.0);
    }

    num cr1u = Vector.crossVectors(r1, u);
    num cr2u = Vector.crossVectors(r2, u);

    num invMass = b1.invMass + b1.invInertia * cr1u * cr1u + b2.invMass
        + b2.invInertia * cr2u * cr2u;
    assert (invMass > Settings.EPSILON);
    mass = 1.0 / invMass;

    if (frequencyHz > 0.0) {
      num C = len - length;

      // Frequency
      num omega = MathBox._2PI * frequencyHz;

      // Damping coefficient
      num d = 2.0 * mass * dampingRatio * omega;

      // Spring stiffness
      num k = mass * omega * omega;

      // magic formulas
      gamma = step.dt * (d + step.dt * k);
      gamma = gamma != 0.0 ? 1.0 / gamma : 0.0;
      bias = C * step.dt * k * gamma;

      mass = invMass + gamma;
      mass = mass != 0.0 ? 1.0 / mass : 0.0;
    }

    if (step.warmStarting) {
      // Scale the impulse to support a variable time step.
      impulse *= step.dtRatio;

      Vector P = new Vector();
      P.setFrom(u).mulLocal(impulse);

      b1.linearVelocity.x -= b1.invMass * P.x;
      b1.linearVelocity.y -= b1.invMass * P.y;
      b1.angularVelocity -= b1.invInertia * Vector.crossVectors(r1, P);

      b2.linearVelocity.x += b2.invMass * P.x;
      b2.linearVelocity.y += b2.invMass * P.y;
      b2.angularVelocity += b2.invInertia * Vector.crossVectors(r2, P);
    } else {
      impulse = 0.0;
    }
  }

  void solveVelocityConstraints(TimeStep step) {
    final Body b1 = bodyA;
    final Body b2 = bodyB;

    final r1 = new Vector();
    final r2 = new Vector();

    r1.setFrom(localAnchor1).subLocal(b1.localCenter);
    r2.setFrom(localAnchor2).subLocal(b2.localCenter);
    Matrix22.mulMatrixAndVectorToOut(b1.originTransform.rotation, r1, r1);
    Matrix22.mulMatrixAndVectorToOut(b2.originTransform.rotation, r2, r2);

    final v1 = new Vector();
    final v2 = new Vector();

    Vector.crossNumAndVectorToOut(b1.angularVelocity, r1, v1);
    Vector.crossNumAndVectorToOut(b2.angularVelocity, r2, v2);
    v1.addLocal(b1.linearVelocity);
    v2.addLocal(b2.linearVelocity);

    num Cdot = Vector.dot(u, v2.subLocal(v1));

    num imp = -mass * (Cdot + bias + gamma * impulse);
    impulse += imp;

    num Px = imp * u.x;
    num Py = imp * u.y;
    b1.linearVelocity.x -= b1.invMass * Px;
    b1.linearVelocity.y -= b1.invMass * Py;
    b1.angularVelocity -= b1.invInertia * (r1.x * Py - r1.y * Px);
    b2.linearVelocity.x += b2.invMass * Px;
    b2.linearVelocity.y += b2.invMass * Py;
    b2.angularVelocity += b2.invInertia * (r2.x * Py - r2.y * Px);
  }

  bool solvePositionConstraints(num baumgarte) {
    if (frequencyHz > 0.0) {
      return true;
    }

    final b1 = bodyA;
    final b2 = bodyB;

    final r1 = new Vector();
    final r2 = new Vector();
    final d = new Vector();

    r1.setFrom(localAnchor1).subLocal(b1.localCenter);
    r2.setFrom(localAnchor2).subLocal(b2.localCenter);
    Matrix22.mulMatrixAndVectorToOut(b1.originTransform.rotation, r1, r1);
    Matrix22.mulMatrixAndVectorToOut(b2.originTransform.rotation, r2, r2);

    d.x = b2.sweep.center.x + r2.x - b1.sweep.center.x - r1.x;
    d.y = b2.sweep.center.y + r2.y - b1.sweep.center.y - r1.y;

    num len = d.normalize();
    num C = len - length;
    C = MathBox.clamp(C, -Settings.MAX_LINEAR_CORRECTION,
        Settings.MAX_LINEAR_CORRECTION);

    num imp = -mass * C;
    u.setFrom(d);
    num Px = imp * u.x;
    num Py = imp * u.y;

    b1.sweep.center.x -= b1.invMass * Px;
    b1.sweep.center.y -= b1.invMass * Py;
    b1.sweep.angle -= b1.invInertia * (r1.x * Py - r1.y * Px);

    b2.sweep.center.x += b2.invMass * Px;
    b2.sweep.center.y += b2.invMass * Py;
    b2.sweep.angle += b2.invInertia * (r2.x * Py - r2.y * Px);

    b1.synchronizeTransform();
    b2.synchronizeTransform();

    return C.abs() < Settings.LINEAR_SLOP;
  }
}
