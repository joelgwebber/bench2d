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
 * Joint definitions are used to construct joints.
 */
class JointDef {
  JointDef() :
    type = JointType.UNKNOWN,
    userData = null,
    bodyA = null,
    bodyB = null,
    collideConnected = false { }

  /**
   * The joint type is set automatically for concrete joint types.
   */
  int type;

  /**
   * Use this to attach application specific data to your joints.
   */
  Object userData;

  /**
   * The first attached body.
   */
  Body bodyA;

  /**
   * The second attached body.
   */
  Body bodyB;

  /**
   * Set this flag to true if the attached bodies should collide.
   */
  bool collideConnected;
}
