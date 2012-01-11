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
 * A revolute joint constrains two bodies to share a common point while they
 * are free to rotate about the point. The relative rotation about the shared
 * point is the joint angle. You can limit the relative rotation with
 * a joint limit that specifies a lower and upper angle. You can use a motor
 * to drive the relative rotation about the shared point. A maximum motor torque
 * is provided so that infinite forces are not generated.
 */
class RevoluteJoint extends Joint {
  final Vector localAnchor1;
  final Vector localAnchor2;

  final Vector3 impulse;

  num _motorImpulse;

  // Effective mass for point-to-point constraint.
  final Matrix33 mass;

  // Effective mass for motor/limit angular constraint.
  num motorMass;

  bool _enableMotor;

  num _maxMotorTorque;

  num _motorSpeed;

  bool _enableLimit;

  num referenceAngle;

  /** Limits on the relative rotation of the joint. */
  num lowerAngle;
  num upperAngle;

  int limitState;

  RevoluteJoint(RevoluteJointDef def) :
    super(def),
    localAnchor1 = new Vector(),
    localAnchor2 = new Vector(),
    impulse = new Vector3(),
    _motorImpulse = 0,
    mass = new Matrix33() {
    localAnchor1.setFrom(def.localAnchorA);
    localAnchor2.setFrom(def.localAnchorB);
    referenceAngle = def.referenceAngle;

    _motorImpulse = 0;

    lowerAngle = def.lowerAngle;
    upperAngle = def.upperAngle;
    _maxMotorTorque = def.maxMotorTorque;
    _motorSpeed = def.motorSpeed;
    _enableLimit = def.enableLimit;
    _enableMotor = def.enableMotor;
  }

  void initVelocityConstraints(TimeStep step) {
    final Body b1 = bodyA;
    final Body b2 = bodyB;

    if (_enableMotor || _enableLimit) {
      // You cannot create a rotation limit between bodies that
      // both have fixed rotation.
      assert (b1.invInertia > 0.0 || b2.invInertia > 0.0);
    }

    final Vector r1 = new Vector();
    final Vector r2 = new Vector();

    // Compute the effective mass matrix.
    r1.setFrom(localAnchor1).subLocal(b1.localCenter);
    r2.setFrom(localAnchor2).subLocal(b2.localCenter);
    Matrix22.mulMatrixAndVectorToOut(b1.originTransform.rotation, r1, r1);
    Matrix22.mulMatrixAndVectorToOut(b2.originTransform.rotation, r2, r2);

    num m1 = b1.invMass, m2 = b2.invMass;
    num i1 = b1.invInertia, i2 = b2.invInertia;

    mass.col1.x = m1 + m2 + r1.y * r1.y * i1 + r2.y * r2.y * i2;
    mass.col2.x = -r1.y * r1.x * i1 - r2.y * r2.x * i2;
    mass.col3.x = -r1.y * i1 - r2.y * i2;
    mass.col1.y = mass.col2.x;
    mass.col2.y = m1 + m2 + r1.x * r1.x * i1 + r2.x * r2.x * i2;
    mass.col3.y = r1.x * i1 + r2.x * i2;
    mass.col1.z = mass.col3.x;
    mass.col2.z = mass.col3.y;
    mass.col3.z = i1 + i2;

    motorMass = i1 + i2;
    if (motorMass > 0.0) {
      motorMass = 1.0 / motorMass;
    }

    if (_enableMotor == false) {
      _motorImpulse = 0.0;
    }

    if (_enableLimit) {
      num jointAngle = b2.sweep.angle - b1.sweep.angle - referenceAngle;
      if ((upperAngle - lowerAngle).abs() < 2.0 * Settings.ANGULAR_SLOP) {
        limitState = LimitState.EQUAL;
      }
      else if (jointAngle <= lowerAngle) {
        if (limitState != LimitState.AT_LOWER) {
          impulse.z = 0.0;
        }
        limitState = LimitState.AT_LOWER;
      }
      else if (jointAngle >= upperAngle) {
        if (limitState != LimitState.AT_UPPER) {
          impulse.z = 0.0;
        }
        limitState = LimitState.AT_UPPER;
      }
      else {
        limitState = LimitState.INACTIVE;
        impulse.z = 0.0;
      }
    }
    else {
      limitState = LimitState.INACTIVE;
    }

    if (step.warmStarting) {
      // Scale impulses to support a variable time step.
      impulse.mulLocal(step.dtRatio);
      _motorImpulse *= step.dtRatio;

      Vector temp = new Vector();
      Vector P = new Vector();
      P.setCoords(impulse.x, impulse.y);

      temp.setFrom(P).mulLocal(m1);
      b1.linearVelocity.subLocal(temp);
      b1.angularVelocity -= i1 * (Vector.crossVectors(r1, P) + _motorImpulse +
          impulse.z);

      temp.setFrom(P).mulLocal(m2);
      b2.linearVelocity.addLocal(temp);
      b2.angularVelocity += i2 * (Vector.crossVectors(r2, P) + _motorImpulse +
          impulse.z);

    } else {
      impulse.setZero();
      _motorImpulse = 0.0;
    }
  }

  void solveVelocityConstraints(final TimeStep step) {
    final Body b1 = bodyA;
    final Body b2 = bodyB;

    final Vector v1 = b1.linearVelocity;
    num w1 = b1.angularVelocity;
    final Vector v2 = b2.linearVelocity;
    num w2 = b2.angularVelocity;

    num m1 = b1.invMass, m2 = b2.invMass;
    num i1 = b1.invInertia, i2 = b2.invInertia;

    // Solve motor constraint.
    if (_enableMotor && limitState != LimitState.EQUAL) {
      num Cdot = w2 - w1 - _motorSpeed;
      num imp = motorMass * (-Cdot);
      num oldImpulse = _motorImpulse;
      num maxImpulse = step.dt * _maxMotorTorque;
      _motorImpulse = MathBox.clamp(_motorImpulse + imp, -maxImpulse,
          maxImpulse);
      imp = _motorImpulse - oldImpulse;

      w1 -= i1 * imp;
      w2 += i2 * imp;
    }

    final Vector temp = new Vector();
    final Vector r1 = new Vector();
    final Vector r2 = new Vector();

    // Solve limit constraint.
    if (_enableLimit && limitState != LimitState.INACTIVE) {

      r1.setFrom(localAnchor1).subLocal(b1.localCenter);
      r2.setFrom(localAnchor2).subLocal(b2.localCenter);
      Matrix22.mulMatrixAndVectorToOut(b1.originTransform.rotation, r1, r1);
      Matrix22.mulMatrixAndVectorToOut(b2.originTransform.rotation, r2, r2);

      final Vector Cdot1 = new Vector();
      final Vector3 Cdot = new Vector3();

      // Solve point-to-point constraint
      Vector.crossNumAndVectorToOut(w1, r1, temp);
      Vector.crossNumAndVectorToOut(w2, r2, Cdot1);
      Cdot1.addLocal(v2).subLocal(v1).subLocal(temp);
      num Cdot2 = w2 - w1;
      Cdot.setCoords(Cdot1.x, Cdot1.y, Cdot2);

      Vector3 imp = new Vector3();
      mass.solve33ToOut(Cdot.negateLocal(), imp);

      if (limitState == LimitState.EQUAL) {
        impulse.addLocal(imp);
      }
      else if (limitState == LimitState.AT_LOWER) {
        num newImpulse = impulse.z + imp.z;
        if (newImpulse < 0.0) {
          mass.solve22ToOut(Cdot1.negateLocal(), temp);
          imp.x = temp.x;
          imp.y = temp.y;
          imp.z = -impulse.z;
          impulse.x += temp.x;
          impulse.y += temp.y;
          impulse.z = 0.0;
        }
      }
      else if (limitState == LimitState.AT_UPPER) {
        num newImpulse = impulse.z + imp.z;
        if (newImpulse > 0.0) {
          mass.solve22ToOut(Cdot1.negateLocal(), temp);
          imp.x = temp.x;
          imp.y = temp.y;
          imp.z = -impulse.z;
          impulse.x += temp.x;
          impulse.y += temp.y;
          impulse.z = 0.0;
        }
      }
      final Vector P = new Vector();

      P.setCoords(imp.x, imp.y);

      temp.setFrom(P).mulLocal(m1);
      v1.subLocal(temp);
      w1 -= i1 * (Vector.crossVectors(r1, P) + imp.z);

      temp.setFrom(P).mulLocal(m2);
      v2.addLocal(temp);
      w2 += i2 * (Vector.crossVectors(r2, P) + imp.z);

    } else {
      r1.setFrom(localAnchor1).subLocal(b1.localCenter);
      r2.setFrom(localAnchor2).subLocal(b2.localCenter);
      Matrix22.mulMatrixAndVectorToOut(b1.originTransform.rotation, r1, r1);
      Matrix22.mulMatrixAndVectorToOut(b2.originTransform.rotation, r2, r2);

      // Solve point-to-point constraint
      Vector Cdot = new Vector();
      Vector imp = new Vector();

      Vector.crossNumAndVectorToOut(w1, r1, temp);
      Vector.crossNumAndVectorToOut(w2, r2, Cdot);
      Cdot.addLocal(v2).subLocal(v1).subLocal(temp);
      mass.solve22ToOut(Cdot.negateLocal(), imp); // just leave negated

      impulse.x += imp.x;
      impulse.y += imp.y;

      temp.setFrom(imp).mulLocal(m1);
      v1.subLocal(temp);
      w1 -= i1 * Vector.crossVectors(r1, imp);

      temp.setFrom(imp).mulLocal(m2);
      v2.addLocal(temp);
      w2 += i2 * Vector.crossVectors(r2, imp);
    }

    b1.angularVelocity = w1;
    b2.angularVelocity = w2;
  }

  bool solvePositionConstraints(num baumgarte) {
    final Body b1 = bodyA;
    final Body b2 = bodyB;

    num angularError = 0.0;
    num positionError = 0.0;

    // Solve angular limit constraint.
    if (_enableLimit && limitState != LimitState.INACTIVE) {
      num angle = b2.sweep.angle - b1.sweep.angle - referenceAngle;
      num limitImpulse = 0.0;

      if (limitState == LimitState.EQUAL) {
        // Prevent large angular corrections
        num C = MathBox.clamp(angle - lowerAngle,
            -Settings.MAX_ANGULAR_CORRECTION, Settings.MAX_ANGULAR_CORRECTION);
        limitImpulse = -motorMass * C;
        angularError = C.abs();
      }
      else if (limitState == LimitState.AT_LOWER) {
        num C = angle - lowerAngle;
        angularError = -C;

        // Prevent large angular corrections and allow some slop.
        C = MathBox.clamp(C + Settings.ANGULAR_SLOP,
            -Settings.MAX_ANGULAR_CORRECTION, 0.0);
        limitImpulse = -motorMass * C;
      }
      else if (limitState == LimitState.AT_UPPER) {
        num C = angle - upperAngle;
        angularError = C;

        // Prevent large angular corrections and allow some slop.
        C = MathBox.clamp(C - Settings.ANGULAR_SLOP, 0.0,
            Settings.MAX_ANGULAR_CORRECTION);
        limitImpulse = -motorMass * C;
      }

      b1.sweep.angle -= b1.invInertia * limitImpulse;
      b2.sweep.angle += b2.invInertia * limitImpulse;

      b1.synchronizeTransform();
      b2.synchronizeTransform();
    }

    // Solve point-to-point constraint.
    {
      Vector imp = new Vector();

      Vector r1 = new Vector();
      Vector r2 = new Vector();
      Vector C = new Vector();

      r1.setFrom(localAnchor1).subLocal(b1.localCenter);
      r2.setFrom(localAnchor2).subLocal(b2.localCenter);
      Matrix22.mulMatrixAndVectorToOut(b1.originTransform.rotation, r1, r1);
      Matrix22.mulMatrixAndVectorToOut(b2.originTransform.rotation, r2, r2);

      C.setFrom(b2.sweep.center).addLocal(r2);
      C.subLocal(b1.sweep.center).subLocal(r1);
      positionError = C.length;

      num invMass1 = b1.invMass, invMass2 = b2.invMass;
      num invI1 = b1.invInertia, invI2 = b2.invInertia;

      // Handle large detachment.
      final num k_allowedStretch = 10.0 * Settings.LINEAR_SLOP;
      if (C.lengthSquared > k_allowedStretch * k_allowedStretch) {
        Vector u = new Vector();

        // Use a particle solution (no rotation).
        num m = invMass1 + invMass2;
        if (m > 0.0) {
          m = 1.0 / m;
        }
        imp.setFrom(C).negateLocal().mulLocal(m);
        final num k_beta = 0.5;
        // using u as temp variable
        u.setFrom(imp).mulLocal(k_beta * invMass1);
        b1.sweep.center.subLocal(u);
        u.setFrom(imp).mulLocal(k_beta * invMass2);
        b2.sweep.center.addLocal(u);

        C.setFrom(b2.sweep.center).addLocal(r2);
        C.subLocal(b1.sweep.center).subLocal(r1);
      }

      Matrix22 K1 = new Matrix22();
      K1.col1.x = invMass1 + invMass2;
      K1.col2.x = 0.0;
      K1.col1.y = 0.0;
      K1.col2.y = invMass1 + invMass2;

      Matrix22 K2 = new Matrix22();
      K2.col1.x = invI1 * r1.y * r1.y;
      K2.col2.x = -invI1 * r1.x * r1.y;
      K2.col1.y = -invI1 * r1.x * r1.y;
      K2.col2.y = invI1 * r1.x * r1.x;

      Matrix22 K3 = new Matrix22();
      K3.col1.x = invI2 * r2.y * r2.y;
      K3.col2.x = -invI2 * r2.x * r2.y;
      K3.col1.y = -invI2 * r2.x * r2.y;
      K3.col2.y = invI2 * r2.x * r2.x;

      K1.addLocal(K2).addLocal(K3);
      K1.solveToOut(C.negateLocal(), imp); // just leave c negated

      // using C as temp variable
      C.setFrom(imp).mulLocal(b1.invMass);
      b1.sweep.center.subLocal(C);
      b1.sweep.angle -= b1.invInertia * Vector.crossVectors(r1, imp);

      C.setFrom(imp).mulLocal(b2.invMass);
      b2.sweep.center.addLocal(C);
      b2.sweep.angle += b2.invInertia * Vector.crossVectors(r2, imp);

      b1.synchronizeTransform();
      b2.synchronizeTransform();
    }

    return positionError <= Settings.LINEAR_SLOP && angularError <=
        Settings.ANGULAR_SLOP;
  }

  void getAnchorA(Vector argOut) {
    bodyA.getWorldPointToOut(localAnchor1, argOut);
  }

  void getAnchorB(Vector argOut) {
    bodyB.getWorldPointToOut(localAnchor2, argOut);
  }

  void getReactionForce(num inv_dt, Vector argOut) {
    argOut.setCoords(impulse.x, impulse.y).mulLocal(inv_dt);
  }

  num getReactionTorque(num inv_dt) {
    return inv_dt * impulse.z;
  }

  num get jointAngle() {
    final Body b1 = bodyA;
    final Body b2 = bodyB;
    return b2.sweep.angle - b1.sweep.angle - referenceAngle;
  }

  num get jointSpeed() {
    final Body b1 = bodyA;
    final Body b2 = bodyB;
    return b2.angularVelocity - b1.angularVelocity;
  }

  bool get motorEnabled() {
    return _enableMotor;
  }

  void set motorEnabled(bool flag) {
    bodyA.awake = true;
    bodyB.awake = true;
    _enableMotor = flag;
  }

  num get motorTorque() {
    return _motorImpulse;
  }

  void set motorSpeed(num speed) {
    bodyA.awake = true;
    bodyB.awake = true;
    _motorSpeed = speed;
  }

  num get motorSpeed() {
    return _motorSpeed;
  }

  num get maxMotorTorque() {
    return _maxMotorTorque;
  }

  void set maxMotorTorque(num torque) {
    bodyA.awake = true;
    bodyB.awake = true;
    _maxMotorTorque = torque;
  }

  bool get limitEnabled() {
    return _enableLimit;
  }

  void set limitEnabled(bool flag) {
    bodyA.awake = true;
    bodyB.awake = true;
    _enableLimit = flag;
  }

  void setLimits(final num lower, final num upper) {
    assert (lower <= upper);
    bodyA.awake = true;
    bodyB.awake = true;
    lowerAngle = lower;
    upperAngle = upper;
  }
}

