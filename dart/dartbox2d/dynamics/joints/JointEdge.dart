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
 * A joint edge is used to connect bodies and joints together
 * in a joint graph where each body is a node and each joint
 * is an edge. A joint edge belongs to a doubly linked list
 * maintained in each attached body. Each joint has two joint
 * nodes, one for each attached body.
 */
class JointEdge {
  /**
   * Constructs a new joint edge with everything set to null.
   */
  JointEdge() { }

  /**
   * Provides quick access to the other body attached.
   */
  Body other;

  /**
   * The joint.
   */
  Joint joint;

  /**
   * The previous joint edge in the body's joint list.
   */
  JointEdge prev;

  /**
   * The next joint edge in the body's joint list.
   */
  JointEdge next;
}
