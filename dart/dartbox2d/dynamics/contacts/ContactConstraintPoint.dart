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

class ContactConstraintPoint {
  final Vector localPoint;
  //TODO(gregbglw): Find out what rA and rB mean and change the names.
  final Vector rA;
  final Vector rB;

  num normalImpulse;
  num tangentImpulse;
  num normalMass;
  num tangentMass;
  num velocityBias;

  /** Constructs a new ContactConstraintPoint. */
  ContactConstraintPoint()
    : localPoint = new Vector(),
    rA = new Vector(),
    rB = new Vector(),
    normalImpulse = 0,
    tangentImpulse = 0,
    normalMass = 0,
    tangentMass = 0,
    velocityBias = 0 {}

  /** Sets this point equal to the given point. */
  void setFrom(ContactConstraintPoint cp) {
    localPoint.setFrom(cp.localPoint);
    rA.setFrom(cp.rA);
    rB.setFrom(cp.rB);
    normalImpulse = cp.normalImpulse;
    tangentImpulse = cp.tangentImpulse;
    normalMass = cp.normalMass;
    tangentMass = cp.tangentMass;
    velocityBias = cp.velocityBias;
  }

  String toString() {
    return "normal impulse: " + normalImpulse + ", tangentImpulse: " +
        tangentImpulse + ", normalMass: " + normalMass + ", tangentMass: " +
        tangentMass + ", velocityBias: " + velocityBias + ", localPoint " +
        localPoint + ", rA: " + rA + ", rB: " + rB;
  }
}
