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
 * A contact edge connects bodies and contacts together in a contact graph. Each
 * body is a node in the graph and each contact is an edge. A contact edge is a
 * part of a doubly linked list that is maintained in each attached body. Each
 * contact has two contact nodes, one for each attached body.
 */
class ContactEdge {
  /** The other body attached to the edge. */
  Body other;

  /** The contact. */
  Contact contact;

  /** The previous contact edge in the body's contact list. */
  ContactEdge prev;

  /** The next contact edge in the body's contact list. */
  ContactEdge next;

  /**
   * Constructs a new ContactEdge with all fields set to null.
   */
  ContactEdge() :
    other = null,
    contact = null,
    prev = null,
    next = null {}
}
