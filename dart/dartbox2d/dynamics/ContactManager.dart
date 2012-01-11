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

/* Detects shapes collisions (contact). */
class ContactManager implements PairCallback {
  BroadPhase broadPhase;
  Contact contactList;
  int contactCount;
  ContactFilter contactFilter;
  ContactListener contactListener;

  final World pool;

  ContactManager(World argPool) :
    contactList = null,
    contactCount = 0,
    contactFilter = new ContactFilter(),
    contactListener = null,
    broadPhase = new BroadPhase(),
    pool = argPool { }

  /**
   * Broad-phase callback.
   */
  void addPair(Fixture fixtureA, Fixture fixtureB) {
    Body bodyA = fixtureA.body;
    Body bodyB = fixtureB.body;

    // Are the fixtures on the same body?
    if (bodyA === bodyB) {
      return;
    }

    // Does a contact already exist?
    ContactEdge edge = bodyB.contactList;
    while (edge != null) {
      if (edge.other == bodyA) {
        Fixture fA = edge.contact.fixtureA;
        Fixture fB = edge.contact.fixtureB;
        if (fA == fixtureA && fB == fixtureB) {
          // A contact already exists.
          return;
        }

        if (fA == fixtureB && fB == fixtureA) {
          // A contact already exists.
          return;
        }
      }

      edge = edge.next;
    }

    // Does a joint override collision? is at least one body dynamic?
    if (bodyB.shouldCollide(bodyA) == false) {
      return;
    }

    // Check user filtering.
    if (contactFilter != null && 
        contactFilter.shouldCollide(fixtureA, fixtureB) == false) {
      return;
    }

    // Call the factory.
    Contact c = pool.popContact(fixtureA, fixtureB);

    // Contact creation may swap fixtures.
    fixtureA = c.fixtureA;
    fixtureB = c.fixtureB;
    bodyA = fixtureA.body;
    bodyB = fixtureB.body;

    // Insert into the world.
    c.prev = null;
    c.next = contactList;
    if (contactList != null) {
      contactList.prev = c;
    }
    contactList = c;

    // Connect to island graph.

    // Connect to body A
    c.edge1.contact = c;
    c.edge1.other = bodyB;

    c.edge1.prev = null;
    c.edge1.next = bodyA.contactList;
    if (bodyA.contactList != null) {
      bodyA.contactList.prev = c.edge1;
    }
    bodyA.contactList = c.edge1;

    // Connect to body B
    c.edge2.contact = c;
    c.edge2.other = bodyA;

    c.edge2.prev = null;
    c.edge2.next = bodyB.contactList;
    if (bodyB.contactList != null) {
      bodyB.contactList.prev = c.edge2;
    }
    bodyB.contactList = c.edge2;

    ++contactCount;
  }

  void findNewContacts() {
    broadPhase.updatePairs(this);
  }

  void destroy(Contact c) {
    Fixture fixtureA = c.fixtureA;
    Fixture fixtureB = c.fixtureB;
    Body bodyA = fixtureA.body;
    Body bodyB = fixtureB.body;

    if (contactListener != null && c.touching) {
      contactListener.endContact(c);
    }

    // Remove from the world.
    if (c.prev != null) {
      c.prev.next = c.next;
    }

    if (c.next != null) {
      c.next.prev = c.prev;
    }

    if (c == contactList) {
      contactList = c.next;
    }

    // Remove from body 1
    if (c.edge1.prev != null) {
      c.edge1.prev.next = c.edge1.next;
    }

    if (c.edge1.next != null) {
      c.edge1.next.prev = c.edge1.prev;
    }

    if (c.edge1 == bodyA.contactList) {
      bodyA.contactList = c.edge1.next;
    }

    // Remove from body 2
    if (c.edge2.prev != null) {
      c.edge2.prev.next = c.edge2.next;
    }

    if (c.edge2.next != null) {
      c.edge2.next.prev = c.edge2.prev;
    }

    if (c.edge2 == bodyB.contactList) {
      bodyB.contactList = c.edge2.next;
    }

    // Call the factory.
    pool.pushContact(c);
    --contactCount;
  }

  /**
   * This is the top level collision call for the time step. Here
   * all the narrow phase collision is processed for the world
   * contact list.
   */
  void collide() {
    // Update awake contacts.
    Contact c = contactList;
    while (c != null) {
      Fixture fixtureA = c.fixtureA;
      Fixture fixtureB = c.fixtureB;
      Body bodyA = fixtureA.body;
      Body bodyB = fixtureB.body;


      if (bodyA.awake == false && bodyB.awake == false) {
        c = c.next;
        continue;
      }

      // is this contact flagged for filtering?
      if ((c.flags & Contact.FILTER_FLAG) == Contact.FILTER_FLAG) {
        // Should these bodies collide?
        if (bodyB.shouldCollide(bodyA) == false) {
          Contact cNuke = c;
          c = cNuke.next;
          destroy(cNuke);
          continue;
        }

        // Check user filtering.
        if (contactFilter != null &&
            contactFilter.shouldCollide(fixtureA, fixtureB) == false) {
          Contact cNuke = c;
          c = cNuke.next;
          destroy(cNuke);
          continue;
        }

        // Clear the filtering flag.
        c.flags &= ~Contact.FILTER_FLAG;
      }

      DynamicTreeNode proxyIdA = fixtureA.proxy;
      DynamicTreeNode proxyIdB = fixtureB.proxy;

      bool overlap = broadPhase.testOverlap(proxyIdA, proxyIdB);

      // Here we destroy contacts that cease to overlap in the broad-phase.
      if (overlap == false) {
        Contact cNuke = c;
        c = cNuke.next;
        destroy(cNuke);
        continue;
      }

      // The contact persists.
      c.update(contactListener);
      c = c.next;
    }
  }
}
