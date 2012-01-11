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
 * Distance joint definition. This requires defining an
 * anchor point on both bodies and the non-zero length of the
 * distance joint. The definition uses local anchor points
 * so that the initial configuration can violate the constraint
 * slightly. This helps when saving and loading a game.
 * Warning: Do not use a zero or short length.
 */
class DistanceJointDef extends JointDef {
  /** The local anchor point relative to body1's origin. */
  final Vector localAnchorA;

  /** The local anchor point relative to body2's origin. */
  final Vector localAnchorB;

  /** The equilibrium length between the anchor points. */
  num length;

  /**
   * The mass-spring-damper frequency in Hertz.
   */
  num frequencyHz;

  /**
   * The damping ratio. 0 = no damping, 1 = critical damping.
   */
  num dampingRatio;

  DistanceJointDef() :
    super(),
    localAnchorA = new Vector(0.0, 0.0),
    localAnchorB = new Vector(0.0, 0.0),
    length = 1.0,
    frequencyHz = 0.0,
    dampingRatio = 0.0 {
    type = JointType.DISTANCE;
  }

  /**
   * Initialize the bodies, anchors, and length using the world
   * anchors.
   * b1: First body
   * b2: Second body
   * anchor1: World anchor on first body
   * anchor2: World anchor on second body
   */
  void initialize(Body b1, Body b2, Vector anchor1, Vector anchor2) {
    bodyA = b1;
    bodyB = b2;
    localAnchorA.setFrom(bodyA.getLocalPoint(anchor1));
    localAnchorB.setFrom(bodyB.getLocalPoint(anchor2));
    Vector d = new Vector.copy(anchor2);
    d.subLocal(anchor1);
    length = d.length;
  }
}
