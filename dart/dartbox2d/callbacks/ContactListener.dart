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
 * Implement this interface to get contact information. You can use these
 * results for things like sounds and game logic. You can also get contact
 * results by traversing the contact lists after the time step. However, you
 * might miss some contacts because continuous physics leads to sub-stepping.
 * Additionally you may receive multiple callbacks for the same contact in a
 * single time step.
 * You should strive to make your callbacks efficient because there may be
 * many callbacks per time step.
 *
 * warning: You cannot create/destroy Box2D entities inside these callbacks.
 *
 */
interface ContactListener {
  /**
   * Called when two fixtures begin to touch.
   */
  void beginContact(Contact contact);

  /**
   * Called when two fixtures cease to touch.
   */
  void endContact(Contact contact);

  /**
   * This is called after a contact is updated. This allows you to inspect a
   * contact before it goes to the solver. If you are careful, you can modify 
   * the contact manifold (e.g. disable contact).
   * A copy of the old manifold is provided so that you can detect changes.
   * Note: this is called only for awake bodies.
   * Note: this is called even when the number of contact points is zero.
   * Note: this is not called for sensors.
   * Note: if you set the number of contact points to zero, you will not
   * get an EndContact callback. However, you may get a BeginContact callback
   * the next step.
   * Note: the oldManifold parameter is pooled, so it will be the same object
   * for every callback for each thread.
   */
  void preSolve(Contact contact, Manifold oldManifold);

  /**
   * This lets you inspect a contact after the solver is finished. This is
   * useful for inspecting impulses.
   * Note: the contact manifold does not include time of impact impulses,
   * which can be arbitrarily large if the sub-step is small. Hence the impulse
   * is provided explicitly in a separate data structure.
   * Note: this is only called for contacts that are touching, solid, and awake.
   */
   void postSolve(Contact contact, ContactImpulse impulse);
}
