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
 * Draws using the given canvas context for debugging purposes.
 */
// TODO(gregbglw): Test all of these methods to make sure that they draw the
// correct things.
class CanvasDraw extends DebugDraw {
  /**
   * The canvas rendering context with which to draw.
   */
  CanvasRenderingContext2D ctx;

  CanvasDraw(IViewportTransform viewport, this.ctx) : super(viewport) { }

  /**
   * Draw a closed polygon provided in CCW order.  This implementation
   * uses [drawSegment] to draw each side of the polygon.
   */
  void drawPolygon(List<Vector> vertices, int vertexCount, Color3 color) {
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
   * Draws the given point with the given radius, in the given color.
   */
  void drawPoint(Vector argPoint, num argRadiusOnScreen, Color3 argColor) {
    _color = argColor;
    getWorldToScreenToOut(argPoint, argPoint);
    ctx.beginPath();
    ctx.arc(argPoint.x, argPoint.y, argRadiusOnScreen, 0, MathBox._2PI, true);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Draw a solid closed polygon provided in CCW order.
   */
  void drawSolidPolygon(List<Vector> vertices, int vertexCount,
      Color3 color) {
    // Set the color and convert to screen coordinates.
    _color = color;
    // TODO(gregbglw): Do a single ctx transform rather than convert all of
    // these vectors.
    for (int i = 0; i < vertexCount; i++) {
      getWorldToScreenToOut(vertices[i], vertices[i]);
    }
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);

    // Draw lines to all of the remaining points.
    for (int i = 1; i < vertexCount; i++) {
      ctx.lineTo(vertices[i].x, vertices[i].y);
    }

    // Draw a line back to the starting point.
    ctx.lineTo(vertices[0].x, vertices[0].y);

    // Fill in the drawn polygon.
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Draw a circle.
   */
  void drawCircle(Vector center, num radius, Color3 color) {
    _color = color;
    getWorldToScreenToOut(center, center);
    radius *= viewportTransform.scale;

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, MathBox._2PI, true);
    ctx.closePath();
    ctx.stroke();
  }

  /**
   * Draw a solid circle.
   */
  void drawSolidCircle(Vector center, num radius, Vector axis,
      Color3 color) {
    _color = color;
    getWorldToScreenToOut(center, center);
    radius *= viewportTransform.scale;

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, MathBox._2PI, true);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Draw a line segment.
   */
  void drawSegment(Vector p1, Vector p2, Color3 color) {
    _color = color;
    getWorldToScreenToOut(p1, p1);
    getWorldToScreenToOut(p2, p2);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.closePath();
    ctx.stroke();
  }

  /**
   * Draw a transform. Choose your own length scale.
   */
  void drawTransform(Transform xf) {
    throw new NotImplementedException();
  }

  /**
   * Draw a string.
   */
  void drawString(num x, num y, String s, Color3 color) {
    _color = color;
    ctx.strokeText(s, x, y);
  }

  /** Sets the rendering context stroke color based on the given color3. */
  void set _color(Color3 color) {
    int red = (color.x * 255).round().toInt();
    int green = (color.y * 255).round().toInt();
    int blue = (color.z * 255).round().toInt();

    // TODO(dominich): Replace with the following when setStrokeColor works correctly.
    //ctx.setStrokeColor(red, green, blue);
    //ctx.setFillColor(red, green, blue);

    final colorString = new StringBuffer("#");
    String redString = _toHex(red);
    String greenString = _toHex(green);
    String blueString = _toHex(blue);

    colorString.add(redString);
    colorString.add(greenString);
    colorString.add(blueString);

    ctx.setStrokeColor(colorString.toString());
    ctx.setFillColor(colorString.toString());
  }

  /**
   * Conversion routines to get hex numbers from base 10 numbers. From
   * en.wikipedia.org/wiki/Hexadecimal.
   * TODO(gregbglw): Replace with toRadixString when that function is
   * implemented.
   */
  String _toHex(int n) {
    //TODO(gregbglw): Remove this once my vm is working again.
    // Mysterious, non-reproducible bug.
    n = n.toInt();
    int r = (n % 16);
    String result;
    if (n - r == 0) {
      result = _toChar(r);
    } else {
      result = _toHex((n - r) ~/ 16);
      result.concat(_toChar(r));
    }

    return result;
  }

  //TODO(gregbglw): Override getScreenToWorld and getWorldToScreen and just do
  //context transformations. This should be a performance boost over converting
  //lots of vectors. Should just do this once and draw everything.

  /** Returns the hex digit corresponding to the given value. */
  String _toChar(int n) {
    final alpha = "0123456789ABCDEF";
    return alpha[n];
  }
}
