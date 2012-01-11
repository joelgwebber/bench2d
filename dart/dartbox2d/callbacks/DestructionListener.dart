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
 * Joints and fixtures are destroyed when their associated
 * body is destroyed. Implement this function type so that you
 * may nullify references to these joints and shapes. It is called when any
 * fixture is about to be destroyed due to the destruction of its parent body.
 */
typedef void FixtureDestructionListener(Fixture fixture);

typedef void JointDestructionListener(Joint joint);
