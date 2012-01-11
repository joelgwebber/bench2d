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
 * Global tuning constants based on MKS units and various integer
 * maximums(vertices per shape, pairs, etc.).
 */
class Settings {
  /** Size that pool stacks are initialized to. */
  static final int CONTACT_STACK_INIT_SIZE = 10;

  /** A "close to Zero" num epsilon value for use */
  static final num EPSILON = .0000001192;

  /**
   * Maximum number of contacts to be handled to solve a TimeOfImpact island.
   */
  static final int MAX_TIME_OF_IMPACT_CONTACTS = 32;

  /**
   * A body cannot sleep if its linear velocity is above this tolerance.
   */
  static final num LINEAR_SLEEP_TOLERANCE = 0.01;

  /**
   * The maximum linear position correction used when solving constraints.
   * This helps to prevent overshoot.
   */
  static final num MAX_LINEAR_CORRECTION = 0.2;

  /**
   * A body cannot sleep if its angular velocity is above this tolerance.
   */
  static final num ANGULAR_SLEEP_TOLERANCE = 2.0 / 180.0 * Math.PI;

  static final num TIME_TO_SLEEP = 0.5;

  static final int TREE_REBALANCE_STEPS = 4;

  static final int MAX_INTEGER = 2147483647;

  static final num SMALL_NUMBER = .000000000001;
  static final num BIG_NUMBER = 99999999999999;

  /**
   * A small length used as a collision and constant tolerance. Usually it
   * is chosen to be numerically significant, but visually insignificant.
   */
  static final num LINEAR_SLOP = 0.005;

  /**
   * The radius of the polygon/edge shape skin. This should not be modified.
   * Making this smaller means polygons will have and insufficient for
   * continuous collision. Making it larger may create artifacts for vertex
   * collision.
   */
  static final num POLYGON_RADIUS = 2.0 * LINEAR_SLOP;

  static final num VELOCITY_THRESHOLD = 1;

  /**
   * Fattens bounding boxes in the dynamic tree by this amount. Allows proxies
   * to move by small amounts without needing to adjust the tree. This value is
   * in meters.
   */
  static final num BOUNDING_BOX_EXTENSION = .1;

  /**
   * This is used to fatten AABBs in the dynamic tree. This is used to predict
   * the future position based on the current displacement.
   * This is a dimensionless multiplier.
   */
  static final num BOUNDING_BOX_MULTIPLIER = 2;

  /**
   * This scale factor controls how fast overlap is resolved. Ideally this
   * would be 1 so that overlap is removed in one time step. However using
   * values close to 1 often lead to overshoot.
   */
  static final num CONTACT_BAUMGARTE = 0.2;

  /**
   * The maximum linear velocity of a body. This limit is very large and is
   * used to prevent numerical problems. You shouldn't need to adjust this.
   */
  static final num MAX_TRANSLATION = 2.0;
  static final num MAX_TRANSLATION_SQUARED = MAX_TRANSLATION * MAX_TRANSLATION;

  /**
   * The maximum angular velocity of a body. This limit is very large and is
   * used to prevent numerical problems. You shouldn't need to adjust this.
   */
  static final num MAX_ROTATION = 0.5 * Math.PI;
  static final num MAX_ROTATION_SQUARED = MAX_ROTATION * MAX_ROTATION;

  /**
   * The maximum number of contact points between two convex shapes.
   */
  static final int MAX_MANIFOLD_POINTS = 2;

  /**
   * A small angle used as a collision and constraint tolerance. Usually it is
   * chosen to be numerically significant, but visually insignificant.
   */
  static final num ANGULAR_SLOP = (2.0 / 180.0 * Math.PI);

  /**
   * The maximum angular position correction used when solving constraints.
   * This helps to prevent overshoot.
   */
  static final num MAX_ANGULAR_CORRECTION = (8.0 / 180.0 * Math.PI);

  /**
   * The maximum number of vertices on a convex polygon.
   */
  static final int MAX_POLYGON_VERTICES = 8;

  /**
   * Friction mixing law.
   */
  static num mixFriction(num friction1, num friction2) {
    return Math.sqrt(friction1 * friction2);
  }

  /**
   * Restitution mixing law.
   */
  static num mixRestitution(num restitution1, num restitution2) {
    return restitution1 > restitution2 ? restitution1 : restitution2;
  }
}
