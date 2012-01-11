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
 * This is an internal structure.
 */
class TimeStep {
  TimeStep() :
    dt = 0,
    inv_dt = 0,
    dtRatio = 0,
    velocityIterations = 0,
    positionIterations = 0,
    warmStarting = true { }

  /** time step */
  num dt;

  /** inverse time step (0 if dt == 0). */
  num inv_dt;

  /** dt * inv_dt0 */
  num dtRatio;

  int velocityIterations;

  int positionIterations;

  bool warmStarting;
}
