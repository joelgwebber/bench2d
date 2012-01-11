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
 * Transform for drawing using a canvas context. Y-flip is permenantly set
 * to true.
 */
class CanvasViewportTransform implements IViewportTransform {
  static final int DEFAULT_DRAWING_SCALE = 20;

  /**
   * Whether the y axis should be flipped such that y is greater as you get
   * lower on the screen.
   */
  bool get yFlip() {
    return true;
  }

  // Does nothing.
  void set yFlip(bool yFlip) { }

  /**
   * This is the half-width and half-height.
   * This should be the actual half-width and 
   * half-height, not anything transformed or scaled.
   * Not a copy.
   */
  Vector extents;

  /**
   * Center of the viewport.  Not a copy.
   */
  Vector center;

  /** Zoom on the world.  */
  num scale;

  /**
   * Constructs a new viewport transform with the default scale.
   */
  CanvasViewportTransform(Vector extents, Vector center) :
    extents = new Vector.copy(extents),
    center = new Vector.copy(center),
    scale = DEFAULT_DRAWING_SCALE { }

  /**
   * Sets the rendering context such that all drawing commands given in terms
   * of the world coordinate system will display correctly on the canvas screen.
   */
  void updateTransformation(CanvasRenderingContext2D ctx) {
    // Clear all previous transformation.
    ctx.setTransform(1,0,0,1,0,0);

    // Translate to the center of the canvas screen. This will be considered the
    // actual origin.
    ctx.translate(extents.x, extents.y);

    // Translate to account for the currently applied translation.
    ctx.translate(translation.x, translation.y);

    // Scale everything according to the current scale and mirror the y-axis.
    ctx.scale(scale, -scale);
  }

  /**
   * The current translation is the difference in canvas units between the
   * actual center of the canvas and the currently specified center. For
   * example, if the actual canvas center is (5, 5) but the current center is
   * (6, 6), the translation is (1, 1).
   */
  Vector get translation() {
    Vector result = new Vector.copy(extents);
    result.subLocal(center);
    return result;
  }

  void set translation(Vector translation) {
    center.setFrom(extents);
    center.subLocal(translation);
  }

  /**
   * Sets the transform's center to the given x and y coordinates,
   * and using the given scale.
   */
  void setCamera(num x, num y, num s) {
    center.setCoords(x, y);
    this.scale = s;
  }

  /**
   * Takes the world coordinate (argWorld) puts the corresponding
   * screen coordinate in argScreen.  It should be safe to give the
   * same object as both parameters.
   */
  void getWorldToScreen(Vector argWorld, Vector argScreen) {
    // Correct for canvas considering the upper-left corner, rather than the
    // center, to be the origin.
    num gridCorrectedX = (argWorld.x * scale) + extents.x;
    num gridCorrectedY = extents.y - (argWorld.y * scale);

    argScreen.setCoords(gridCorrectedX + translation.x, gridCorrectedY +
        -translation.y);
  }

  /**
   * Takes the screen coordinates (argScreen) and puts the
   * corresponding world coordinates in argWorld. It should be safe
   * to give the same object as both parameters.
   */
  void getScreenToWorld(Vector argScreen, Vector argWorld) {
    num translationCorrectedX = argScreen.x - translation.x;
    num translationCorrectedY = argScreen.y + translation.y;

    num gridCorrectedX = (translationCorrectedX - extents.x) / scale;
    num gridCorrectedY = ((translationCorrectedY - extents.y) * -1) / scale;
    argWorld.setCoords(gridCorrectedX, gridCorrectedY);
  }
}
