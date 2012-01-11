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
 * Provides object pooling for some objects used in the engine.
 * Objects retrieved from here should only be used temporarily.
 */
class DefaultWorldPool {
  Collision collision;
  TimeOfImpact timeOfImpact;
  Distance distance;

/* TODO(jgw): Can't use 'this' in initializers?
  DefaultWorldPool() :
    distance = new Distance._construct(),
    collision = new Collision._construct(this),
    timeOfImpact = new TimeOfImpact._construct(this) { }
*/

  DefaultWorldPool() {
    distance = new Distance._construct();
    collision = new Collision._construct(this);
    timeOfImpact = new TimeOfImpact._construct(this);
  }

  Queue<CircleContact> getCircleContactStack() {
    final queue = new Queue<CircleContact>();
    for (int i = 0; i < Settings.CONTACT_STACK_INIT_SIZE; i++) {
      queue.addFirst(new CircleContact(this));
    }
    return queue;
  }

  Queue<PolygonAndCircleContact> getPolyCircleContactStack() {
    final queue = new Queue<PolygonAndCircleContact>();
    for (int i = 0; i < Settings.CONTACT_STACK_INIT_SIZE; i++) {
      queue.addFirst(new PolygonAndCircleContact(this));
    }
    return queue;
  }

  Queue<PolygonContact> getPolyContactStack() {
    final queue = new Queue<PolygonContact>();
    for (int i = 0; i < Settings.CONTACT_STACK_INIT_SIZE; i++) {
      queue.addFirst(new PolygonContact(this));
    }
    return queue;
  }
}
