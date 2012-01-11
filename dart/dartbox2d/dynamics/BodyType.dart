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
 * A body type enum. There are three types of bodies.
 *
 * Static: Have zero mass, zero velocity and can be moved manually.
 *
 * Kinematic: Have zero mass, a non-zero velocity set by user, and are moved by
 *   the physics solver.
 *
 * Dynamic: Have positive mass, non-zero velocity determined by forces, and is
 *   moved by the physics solver.
 */
class BodyType {
  BodyType() { }

  static final int STATIC = 0;
  static final int KINEMATIC = 1;
  static final int DYNAMIC = 2;
}
