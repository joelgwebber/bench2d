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
 * Definition for a [ConstantVolumeJoint], which connects a group
 * a bodies together so they maintain a constant volume within them.
 */
class ConstantVolumeJointDef extends JointDef {
  num frequencyHz;
  num dampingRatio;

  List<Body> bodies;
  List<DistanceJoint> joints;

  ConstantVolumeJointDef() :
    super(),
    bodies = new List<Body>(),
    joints = null,
    frequencyHz = 0.0,
    dampingRatio = 0.0 {
    type = JointType.CONSTANT_VOLUME;
    collideConnected = false;
  }

  /**
   * Adds a body to the group.
   */
  void addBody(Body argBody) {
    bodies.add(argBody);
    if (bodies.length == 1) {
      bodyA = argBody;
    } else if (bodies.length == 2) {
      bodyB = argBody;
    }
  }

  /**
   * Adds a body and the pre-made distance joint.  Should only
   * be used for deserialization.
   */
  void addBodyAndJoint(Body argBody, DistanceJoint argJoint) {
    addBody(argBody);
    if(joints == null){
      joints = new List<DistanceJoint>();
    }
    joints.add(argJoint);
  }
}
