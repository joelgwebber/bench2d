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
 * Contact ids to facilitate warm starting. Basically just containers for
 * an individual Features object that contains interesting information.
 */
class ContactID {
  /** The features that intersect to form the contact point */
  final Features features;

  /**
   * Constructs a new ContactID. */
  ContactID() : features = new Features() { }

  /**
   * Constructs a ContactID that is a copy of the given ContactID.
   */
  ContactID.copy(ContactID other) :
    features = new Features.copy(other.features) { }

  /**
   * Returns true if this ContactID equals the given ContactID.
   */
  bool operator == (other) {
    return other.features == features;
  }

  /**
   * Sets this contactID to be equal to the given ContactID.
   */
  void setFrom(ContactID other) {
    features.setFrom(other.features);
  }

  /**
   * Returns true if this ContactID equals the given ContactID.
   */
  bool isEqual(ContactID other) {
    return other.features == features;
  }

  /**
   * Zeroes out the data.
   */
  void zero() {
    features.zero();
  }
}
