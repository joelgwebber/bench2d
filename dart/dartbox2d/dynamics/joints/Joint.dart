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
 * The base joint class. Joints are used to constrain two bodies together in
 * various fashions. Some joints also feature limits and motors.
 */
class Joint {
  int type;

  Joint _prev;
  Joint _next;

  JointEdge edgeA;
  JointEdge edgeB;

  Body bodyA;
  Body bodyB;

  bool islandFlag;

  bool collideConnected;

  Object userData;

  // Cache here per time step to reduce cache misses.
  final Vector localCenterA;
  final Vector localCenterB;

  num invMassA;
  num invIA;
  num invMassB;
  num invIB;

  Joint(JointDef def) :
    type = def.type,
    _prev = null,
    _next = null,
    bodyA = def.bodyA,
    bodyB = def.bodyB,
    collideConnected = def.collideConnected,
    islandFlag = false,
    userData = def.userData,

    localCenterA = new Vector(),
    localCenterB = new Vector(),
    edgeA = new JointEdge(),
    edgeB = new JointEdge() { }

  factory Joint.create(World argWorld, JointDef def) {
    switch(def.type){
      case JointType.MOUSE:
        throw new NotImplementedException();
        //  return new MouseJoint(def);
      case JointType.DISTANCE:
        return new DistanceJoint(def);
      case JointType.PRISMATIC:
        throw new NotImplementedException();
        //  return new PrismaticJoint(def);
      case JointType.REVOLUTE:
        return new RevoluteJoint(def);
      case JointType.WELD:
        throw new NotImplementedException();
        //return new WeldJoint(def);
      case JointType.FRICTION:
        throw new NotImplementedException();
        //return new FrictionJoint(def);
      case JointType.LINE:
        throw new NotImplementedException();
        //return new LineJoint(def);
      case JointType.GEAR:
        throw new NotImplementedException();
        //return new GearJoint(def);
      case JointType.PULLEY:
        throw new NotImplementedException();
        //return new PulleyJoint(def);
      case JointType.CONSTANT_VOLUME:
        return new ConstantVolumeJoint(argWorld, def);
    }
    return null;
  }

  static void destroy(Joint joint) {
    joint.destructor();
  }

  /**
   * Get the anchor point on bodyA in world coordinates.
   */
  // TODO: abstract http://b/issue?id=5015671
  void getAnchorA(Vector argOut) { }

  /**
   * Get the anchor point on bodyB in world coordinates.
   */
  // TODO: abstract http://b/issue?id=5015671
  void getAnchorB(Vector argOut) { }

  /**
   * Get the reaction force on body2 at the joint anchor in Newtons.
   */
  // TODO: abstract http://b/issue?id=5015671
  void getReactionForce(num inv_dt, Vector argOut) { }

  /**
   * Get the reaction torque on body2 in N*m.
   */
  // TODO: abstract http://b/issue?id=5015671
  num getReactionTorque(num inv_dt) { }

  /**
   * Short-cut function to determine if either body is inactive.
   */
  bool get active() {
    return bodyA.active && bodyB.active;
  }

  // TODO: abstract http://b/issue?id=5015671
  void initVelocityConstraints(TimeStep step) { }

  // TODO: abstract http://b/issue?id=5015671
  void solveVelocityConstraints(TimeStep step) { }

  /**
   * This returns true if the position errors are within tolerance.
   */
  // TODO: abstract http://b/issue?id=5015671
  bool solvePositionConstraints(num baumgarte) { }

  /**
   * Override to handle destruction of joint
   */
  // TODO: abstract http://b/issue?id=5015671
  void destructor() { }
}
