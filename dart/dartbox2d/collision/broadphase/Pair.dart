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
 * A pair of dynamic tree nodes that is comparable.
 */
class Pair implements Comparable {
  DynamicTreeNode proxyA;
  DynamicTreeNode proxyB;

  /**
   * Constructs a new pair.
   */
  Pair() : proxyA = null, proxyB = null { }

  /**
   * Compares this pair to the other pair. Returns a negative number if this
   * pair is less, 0 if the pairs are equal, and a positive number if this pair
   * is greater. Compared first on which proxyA is less and, in the case of a
   * tie, on which proxyB is less.
   */
  int compareTo(Pair pair2) {
    assert(proxyA != null && pair2.proxyA != null);
    if (this.proxyA.key < pair2.proxyA.key) {
      return -1;
    }
    if (this.proxyA.key == pair2.proxyA.key) {
      if (proxyB.key < pair2.proxyB.key) {
        return -1;
      } else {
        if (proxyB.key == pair2.proxyB.key) {
          return 0;
        } else {
          return 1;
        }
      }
    }

    return 1;
  }
}
