import 'dart:html';
import 'package:box2d/box2d_browser.dart';
import 'package:bench2d/bench2d_lib.dart';

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

class Bench2dWeb extends Bench2d {
  static const int CANVAS_WIDTH = 900;
  static const int CANVAS_HEIGHT = 600;
  static const double _VIEWPORT_SCALE = 10.0;

  CanvasElement canvas;
  CanvasRenderingContext2D ctx;
  ViewportTransform viewport;
  DebugDraw debugDraw;

  /**
   * Creates the canvas and readies the demo for animation. Must be called
   * before calling runAnimation.
   */
  void initializeAnimation() {
    // Setup the canvas.
    canvas = new CanvasElement()
      ..width = CANVAS_WIDTH
      ..height = CANVAS_HEIGHT;

    ctx = canvas.getContext("2d");
    document.body.append(canvas);

    // Create the viewport transform with the center at extents.
    final extents = new Vector2(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    viewport = new CanvasViewportTransform(extents, extents)
      ..scale = _VIEWPORT_SCALE;

    // Create our canvas drawing tool to give to the world.
    debugDraw = new CanvasDraw(viewport, ctx);

    // Have the world draw itself for debugging purposes.
    world.debugDraw = debugDraw;

    initialize();
  }

  void render(num delta) {
    super.step();

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    world.drawDebugData();
    window.animationFrame.then(render);
  }

  void runAnimation() {
    window.animationFrame.then(render);
  }
}

void main() {
  // Render version
  new Bench2dWeb()
    ..initializeAnimation()
    ..runAnimation();
}
