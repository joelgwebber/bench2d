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
 * This class defines contact between two shapes.
 */
class Contact {
  /** Used when crawling contact graph when forming islands. */
  static final int ISLAND_FLAG = 0x0001;
  static final int TOUCHING_FLAG = 0x0002;
  static final int ENABLED_FLAG = 0x0004;
  static final int FILTER_FLAG = 0x0008;
  static final int BULLET_HIT_FLAG = 0x0010;

  /** The flags for this Contact. */
  int flags;

  /** World pool and list pointers. */
  //TODO(gregbglw): Write benchmark comparing this linked list style with just
  // using a list.
  Contact prev;
  Contact next;

  /** Nodes for connecting bodies. */
  ContactEdge edge1;
  ContactEdge edge2;

  Fixture fixtureA;
  Fixture fixtureB;

  Manifold manifold;

  num toiCount;

  DefaultWorldPool pool;

  /** Pool manifold for internal use. */
  final Manifold _oldManifold;

  Contact(DefaultWorldPool pool) :
    manifold = new Manifold(),
    fixtureA = null,
    fixtureB = null,
    edge1 = new ContactEdge(),
    edge2 = new ContactEdge(),
    pool = pool,
    _oldManifold = new Manifold() { }

  /**
   * Initialization for pooling.
   */
  void init(Fixture fixA, Fixture fixB) {
    flags = 0;
    fixtureA = fixA;
    fixtureB = fixB;

    manifold.pointCount = 0;

    prev = null;
    next = null;

    edge1.contact = null;
    edge1.prev = null;
    edge1.next = null;
    edge1.other = null;

    edge2.contact = null;
    edge2.prev = null;
    edge2.next = null;
    edge2.other = null;

    toiCount = 0;
  }

  /**
   * Intializes the given world manifold.
   */
  void getWorldManifold(WorldManifold worldManifold) {
    final Body bodyA = fixtureA.body;
    final Body bodyB = fixtureB.body;
    final Shape shapeA = fixtureA.shape;
    final Shape shapeB = fixtureB.shape;

    worldManifold.initialize(manifold, bodyA.originTransform,
        shapeA.radius, bodyB.originTransform, shapeB.radius);
  }

  /**
   * Is this contact touching
   */
  bool get touching() {
    return (flags & TOUCHING_FLAG) == TOUCHING_FLAG;
  }

  /**
   * Enable/disable this contact. This can be used inside the pre-solve
   * contact listener. The contact is only disabled for the current time step
   * (or sub-step in continuous collisions).
   */
  void set enabled(bool flag) {
    if (flag) {
      flags |= ENABLED_FLAG;
    } else {
      flags &= ~ENABLED_FLAG;
    }
  }

  bool get enabled () {
    return (flags & ENABLED_FLAG) == ENABLED_FLAG;
  }

  /** Abstract method. */
  // TODO(gregbglw) make this abstract once working in both dartc and dartium.
  // bug 5015671
  void evaluate(Manifold argManifold, Transform xfA, Transform xfB) {
  }

  /**
   * Flag this contact for filtering. Filtering will occur the next time step.
   */
  void flagForFiltering() {
    flags |= FILTER_FLAG;
  }

  void update(ContactListener listener) {
    _oldManifold.setFrom(manifold);

    // Re-enable this contact.
    flags |= ENABLED_FLAG;

    bool touching = false;
    bool wasTouching = (flags & TOUCHING_FLAG) == TOUCHING_FLAG;

    bool sensorA = fixtureA.isSensor;
    bool sensorB = fixtureB.isSensor;
    bool sensor = sensorA || sensorB;

    Body bodyA = fixtureA.body;
    Body bodyB = fixtureB.body;
    Transform xfA = bodyA.originTransform;
    Transform xfB = bodyB.originTransform;

    if (sensor) {
      Shape shapeA = fixtureA.shape;
      Shape shapeB = fixtureB.shape;
      touching = pool.collision.testOverlap(shapeA, shapeB, xfA, xfB);

      // Sensors don't generate manifolds.
      manifold.pointCount = 0;
    } else {
      evaluate(manifold, xfA, xfB);
      touching = manifold.pointCount > 0;

      // Match old contact ids to new contact ids and copy the
      // stored impulses to warm start the solver.
      for (int i = 0; i < manifold.pointCount; ++i) {
        ManifoldPoint mp2 = manifold.points[i];
        mp2.normalImpulse = 0.0;
        mp2.tangentImpulse = 0.0;
        ContactID id2 = mp2.id;

        for (int j = 0; j < _oldManifold.pointCount; ++j) {
          ManifoldPoint mp1 = _oldManifold.points[j];

          if (mp1.id.isEqual(id2)) {
            mp2.normalImpulse = mp1.normalImpulse;
            mp2.tangentImpulse = mp1.tangentImpulse;
            break;
          }
        }
      }

      if (touching != wasTouching) {
        bodyA.awake = true;
        bodyB.awake = true;
      }
    }

    if (touching) {
      flags |= TOUCHING_FLAG;
    } else {
      flags &= ~TOUCHING_FLAG;
    }

    if (listener == null) {
      return;
    }

    if (wasTouching == false && touching == true) {
      listener.beginContact(this);
    }

    if (wasTouching == true && touching == false) {
      listener.endContact(this);
    }

    if (sensor == false && touching) {
      listener.preSolve(this, _oldManifold);
    }
  }
}
