library bench2d;

import 'dart:math' as math;
import 'package:box2d/box2d.dart';

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
  static final int WARMUP = 64;
  static final int FRAMES = 256;
  static final int PYRAMID_SIZE = 40;
  static final num GRAVITY = -10;
  static final num TIME_STEP = 1/60;
  static final int VELOCITY_ITERATIONS = 3;
  static final int POSITION_ITERATIONS = 3;

  World world;

  Bench2d() {
    final gravity = new vec2(0, GRAVITY);
    bool doSleep = true;
    world = new World(gravity, doSleep, new DefaultWorldPool());
  }

  void initialize() {
    {
      BodyDef bd = new BodyDef();
      Body ground = world.createBody(bd);

      PolygonShape shape = new PolygonShape()
        ..setAsEdge(new vec2(-40.0, 0), new vec2(40.0, 0));

      final fixDef = new FixtureDef()
        ..shape = shape
        ..density = 0;

      ground.createFixture(fixDef);
    }

    {
      num a = .5;
      PolygonShape shape = new PolygonShape()
        ..setAsBox(a, a);

      final fixDef = new FixtureDef()
        ..shape = shape
        ..density = 5;

      vec2 x = new vec2(-7.0, 0.75);
      vec2 y = new vec2();
      vec2 deltaX = new vec2(0.5625, 1);
      vec2 deltaY = new vec2(1.125, 0.0);

      for (int i = 0; i < PYRAMID_SIZE; ++i){
        y.copyFrom(x);

        for (int j = i; j < PYRAMID_SIZE; ++j){
          BodyDef bd = new BodyDef()
            ..type = BodyType.DYNAMIC
            ..position.copyFrom(y);

          Body body = world.createBody(bd)
            ..createFixture(fixDef);

          y.add(deltaY);
        }

        x.add(deltaX);
      }
    }
  }

  void step() {
    world.step(TIME_STEP, VELOCITY_ITERATIONS, POSITION_ITERATIONS);
  }

  void warmup() {
    for (int i = 0; i < WARMUP; ++i) step();
  }

  float mean(List<int> values) {
    float total = 0;
    for (int i = 0; i < FRAMES; ++i) {
      total += values[i];
    }
    return total / FRAMES;
  }

  float stddev(List<int> values, float mean) {
    float variance = 0;
    for (int i = 0; i < values.length; ++i) {
      float diff = values[i] - mean;
      variance += diff * diff;
    }
    return math.sqrt(variance / FRAMES);
  }

  void bench() {
    final times = new List<int>(FRAMES);

    for (int i = 0; i < FRAMES; ++i) {
      final watch = new Stopwatch()..start();
      step();
      watch.stop();
      times[i] = watch.elapsedMilliseconds;
      print('$i: ${times[i]}');
    }

    float mean = mean(times);
    print('Benchmark complete.\nms/frame: ${mean} +/- ${stddev(times, mean)}');
  }
}

void main() {
  final bench2d = new Bench2d()
     ..initialize()
     ..warmup()
     ..bench();
}

