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
 * This is the viewport transform used from drawing.
 * Use yFlip if you are drawing from the top-left corner.
 */
interface IViewportTransform {
  /**
   * return if the transform flips the y axis.
   */
  bool get yFlip();

  /**
   * yFlip: if we flip the y axis when transforming.
   */
  void set yFlip(bool yFlip);

  /**
   * This is the half-width and half-height.
   * This should be the actual half-width and 
   * half-height, not anything transformed or scaled.
   * Not a copy.
   */
  Vector get extents();

  /**
   * Returns the scaling factor used in converting from world sizes to rendering
   * sizes.
   */
  num get scale();

  /**
   * This sets the half-width and half-height.
   * This should be the actual half-width and 
   * half-height, not anything transformed or scaled.
   */
  void set extents(Vector argExtents);

  /**
   * center of the viewport.  Not a copy.
   */
  Vector get center();

  /**
   * sets the center of the viewport.
   */
  void set center(Vector argPos);

  /**
   * Sets the transform's center to the given x and y coordinates,
   * and using the given scale.
   */
  void setCamera(num x, num y, num scale);

  /**
   * takes the world coordinate (argWorld) puts the corresponding
   * screen coordinate in argScreen.  It should be safe to give the
   * same object as both parameters.
   */
  void getWorldToScreen(Vector argWorld, Vector argScreen);


  /**
   * takes the screen coordinates (argScreen) and puts the
   * corresponding world coordinates in argWorld. It should be safe
   * to give the same object as both parameters.
   */
  void getScreenToWorld(Vector argScreen, Vector argWorld);
}
