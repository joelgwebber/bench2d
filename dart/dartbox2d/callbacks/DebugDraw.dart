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
 * Implement this abstract class to allow JBox2d to
 * automatically draw your physics for debugging purposes.
 * Not intended to replace your own custom rendering
 * routines! Draws shapes by default.
 */
class DebugDraw {
  // TODO(gregbglw): Draw joints once have them implemented. Also draw other
  // neat stuff described below.
  static final int e_shapeBit = 0x0001; ///< draw shapes
  static final int e_jointBit = 0x0002; ///< draw joint connections
  static final int e_aabbBit = 0x0004; ///< draw core (TimeOfImpact) shapes
  static final int e_pairBit = 0x0008; ///< draw axis aligned boxes
  static final int e_centerOfMassBit =  0x0010; ///< draw center of mass 
  static final int e_dynamicTreeBit = 0x0020; ///< draw dynamic tree.

  int drawFlags;
  IViewportTransform viewportTransform;

  DebugDraw(IViewportTransform viewport) :
    drawFlags = e_shapeBit,
    viewportTransform = viewport { }

  void setFlags(int flags) {
    drawFlags = flags;
  }

  int getFlags() {
    return drawFlags;
  }

  void appendFlags(int flags) {
    drawFlags |= flags;
  }

  void clearFlags(int flags) {
    drawFlags &= ~flags;
  }

  /**
   * Draw a closed polygon provided in CCW order.  This implementation
   * uses [drawSegment] to draw each side of the polygon.
   */
  void drawPolygon(List<Vector> vertices, int vertexCount, Color3 color){
    if(vertexCount == 1){
      drawSegment(vertices[0], vertices[0], color);
      return;
    }

    for(int i=0; i<vertexCount-1; i+=1){
      drawSegment(vertices[i], vertices[i+1], color);
    }

    if(vertexCount > 2){
      drawSegment(vertices[vertexCount-1], vertices[0], color);
    }
  }

  /**
   * Draws the given point with the given radius and color.
   */
  // TODO: abstract http://b/issue?id=5015671
  void drawPoint(Vector argPoint, num argRadiusOnScreen, Color3 argColor) { }

  /**
   * Draw a solid closed polygon provided in CCW order.
   */
  // TODO: abstract http://b/issue?id=5015671
  void drawSolidPolygon(List<Vector> vertices, int vertexCount,
      Color3 color) { }

  /**
   * Draw a circle.
   */
  // TODO: abstract http://b/issue?id=5015671
  void drawCircle(Vector center, num radius, Color3 color) { }

  /**
   * Draw a solid circle.
   */
  // TODO: abstract http://b/issue?id=5015671
  void drawSolidCircle(Vector center, num radius, Vector axis,
      Color3 color) { }

  /**
   * Draw a line segment.
   */
  // TODO: abstract http://b/issue?id=5015671
  void drawSegment(Vector p1, Vector p2, Color3 color) { }

  /**
   * Draw a transform.  Choose your own length scale
   */
  // TODO: abstract http://b/issue?id=5015671
  void drawTransform(Transform xf) { }

  /**
   * Draw a string.
   */
  // TODO: abstract http://b/issue?id=5015671
  void drawString(num x, num y, String s, Color3 color) { }

  /**
   * Returns the viewport transform.
   */
  IViewportTransform getViewportTranform(){
    return viewportTransform;
  }

  /**
   * Sets the center of the viewport to the given x and y values and the
   * viewport scale to the given scale.
   */
  void setCamera(num x, num y, num scale){
    viewportTransform.setCamera(x,y,scale);
  }

  /**
   * Screen coordinates are specified in argScreen. These coordinates are
   * converted to World coordinates and placed in the argWorld return vector.
   */
  void getScreenToWorldToOut(Vector argScreen, Vector argWorld) {
    viewportTransform.getScreenToWorld(argScreen, argWorld);
  }

  /**
   * World coordinates are specified in argWorld. These coordinates are
   * converted to screen coordinates and placed in the argScreen return vector.
   */
  void getWorldToScreenToOut(Vector argWorld, Vector argScreen) {
    viewportTransform.getWorldToScreen(argWorld, argScreen);
  }
}
