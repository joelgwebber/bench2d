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
 * Contains contact filtering data.
 */
class Filter {
  /**
   * Collision category bits.
   */
  int categoryBits;

  /**
   * Collision mask bits. These are the categories that this shape would accept
   * for collision.
   */
  int maskBits;

  /**
   * Collision groups allow a certain group of objects to never collide
   * (negative) or always collide (positive). A groupIndex value of 0 means no
   * collision group.
   */
  int groupIndex;

  /**
   * Constructs a new filter with everything set to 0.
   */
  Filter() : categoryBits = 0, maskBits = 0, groupIndex = 0 { }

  /**
   * Constructs a new Filter that is a copy of the other filter.
   */
  Filter.copy(Filter other) :
    categoryBits = other.categoryBits,
    maskBits = other.maskBits,
    groupIndex = other.groupIndex { }

  /**
   * Sets this filter equal to the given filter.
   */
  void setFrom(Filter other) {
    categoryBits = other.categoryBits;
    maskBits = other.maskBits;
    groupIndex = other.groupIndex;
  }
}
