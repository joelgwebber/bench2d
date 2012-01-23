#library('Bench2d');
#import('dart:dom');
#import('dartbox2d/box2d.dart');

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

class Bench2d {
  static final int CANVAS_WIDTH = 900;
  static final int CANVAS_HEIGHT = 600;

  static final int WARMUP = 64;
  static final int FRAMES = 256;
  static final int PYRAMID_SIZE = 40;

  static final num _VIEWPORT_SCALE = 10;

  static final num GRAVITY = -10;

  static final num TIME_STEP = 1/60;
  static final int VELOCITY_ITERATIONS = 3;
  static final int POSITION_ITERATIONS = 3;

  HTMLCanvasElement canvas;
  CanvasRenderingContext2D ctx;
  IViewportTransform viewport;
  DebugDraw debugDraw;

  World world;

  bool _doDebugDraw;

  Bench2d([_doDebugDraw = false]) {
    final gravity = new Vector(0, GRAVITY);
    bool doSleep = true;
    world = new World(gravity, doSleep, new DefaultWorldPool());
  }

  /**
   * Creates the canvas and readies the demo for animation. Must be called
   * before calling runAnimation.
   */
  void initializeAnimation() {
    // Setup the canvas.
    canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");

    // Create the viewport transform with the center at extents.
    final extents = new Vector(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    viewport = new CanvasViewportTransform(extents, extents);
    viewport.scale = _VIEWPORT_SCALE;

    if (_doDebugDraw) {
      // Create our canvas drawing tool to give to the world.
      debugDraw = new CanvasDraw(viewport, ctx);

      // Have the world draw itself for debugging purposes.
      world.debugDraw = debugDraw;
    }
  }

  void initialize() {
    {
      BodyDef bd = new BodyDef();
      Body ground = world.createBody(bd);

      PolygonShape shape = new PolygonShape();
      shape.setAsEdge(new Vector(-40.0, 0), new Vector(40.0, 0));

      final fixDef = new FixtureDef();
      fixDef.shape = shape;
      fixDef.density = 0;

      ground.createFixture(fixDef);
    }

    {
      num a = .5;
      PolygonShape shape = new PolygonShape();
      shape.setAsBox(a, a);

      final fixDef = new FixtureDef();
      fixDef.shape = shape;
      fixDef.density = 5;

      Vector x = new Vector(-7.0, 0.75);
      Vector y = new Vector();
      Vector deltaX = new Vector(0.5625, 1);
      Vector deltaY = new Vector(1.125, 0.0);

      for (int i = 0; i < PYRAMID_SIZE; ++i){
        y.setFrom(x);

        for (int j = i; j < PYRAMID_SIZE; ++j){
          BodyDef bd = new BodyDef();
          bd.type = BodyType.DYNAMIC;
          bd.position.setFrom(y);
          Body body = world.createBody(bd);
          body.createFixture(fixDef);
          y.addLocal(deltaY);
        }

        x.addLocal(deltaX);
      }
    }
  }

  void step() {
    world.step(TIME_STEP, VELOCITY_ITERATIONS, POSITION_ITERATIONS);
  }

  void render() {
    step();

    if (_doDebugDraw) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      world.drawDebugData();
    }
    window.webkitRequestAnimationFrame((num time) {
        render();
    }, canvas);
  }

  void runAnimation() {
    window.webkitRequestAnimationFrame((num time) {
        render();
    }, canvas);
  }

  void warmup() {
    for (int i = 0; i < WARMUP; ++i) step();
  }

  void bench() {
    Bench2d bench2d = new Bench2d();

    final times = new List<int>(FRAMES);
    for (int i = 0; i < FRAMES; ++i) {
      final watch = new Stopwatch();
      watch.start();
      bench2d.step();
      watch.stop();
      times[i] = watch.elapsed() / watch.frequency();
      print(times[i]);
    }

    int total = 0;
    for (int i = 0; i < FRAMES; ++i) total += times[i];
    print('Average: ${total / FRAMES}');
  }
}

void main() {
  final bench2d = new Bench2d();
  bench2d.initialize();
  bench2d.warmup();
  bench2d.bench();
}

