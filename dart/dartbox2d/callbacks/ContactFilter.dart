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
 * Implement a subtype of this class and pass it as the argument to
 * world.setContactFilter to provide collision filtering.
 * In other words, you can implement this class if you want finer control over
 * contact creation.
 */
class ContactFilter {
  ContactFilter() { }

  /**
   * Return true if contact calculations should be performed between these two
   * shapes.
   */
  bool shouldCollide(Fixture fixtureA, Fixture fixtureB){
    Filter filterA = fixtureA.filter;
    Filter filterB = fixtureB.filter;

    if (filterA.groupIndex == filterB.groupIndex && filterA.groupIndex != 0){
      return filterA.groupIndex > 0;
    }

    bool collide = (filterA.maskBits & filterB.categoryBits) != 0 &&
        (filterA.categoryBits & filterB.maskBits) != 0;
    return collide;
  }
}

