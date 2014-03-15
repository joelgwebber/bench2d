library bench2d;

import 'package:box2d/box2d.dart';
import 'package:vector_math/vector_math.dart';

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
  static const int WARMUP = 64;
  static const int FRAMES = 256;
  static const int PYRAMID_SIZE = 40;
  static const double GRAVITY = -10.0;
  static const num TIME_STEP = 1/60;
  static const int VELOCITY_ITERATIONS = 3;
  static const int POSITION_ITERATIONS = 3;

  final World world;

  Bench2d()
  : this.world = new World(new Vector2(0.0, GRAVITY), true, new DefaultWorldPool());

  void initialize() {
    {
      var bd = new BodyDef();
      Body ground = world.createBody(bd);

      PolygonShape shape = new PolygonShape()
        ..setAsEdge(new Vector2(-40.0, 0.0), new Vector2(40.0, 0.0));

      var fixDef = new FixtureDef()
        ..shape = shape
        ..density = 0.0;

      ground.createFixture(fixDef);
    }

    {
      num a = .5;
      PolygonShape shape = new PolygonShape()
        ..setAsBox(a, a);

      final fixDef = new FixtureDef()
        ..shape = shape
        ..density = 5.0;

      var x = new Vector2(-7.0, 0.75);
      var y = new Vector2.zero();
      var deltaX = new Vector2(0.5625, 1.0);
      var deltaY = new Vector2(1.125, 0.0);

      for (int i = 0; i < PYRAMID_SIZE; ++i){
        y.setFrom(x);

        for (int j = i; j < PYRAMID_SIZE; ++j){
          BodyDef bd = new BodyDef()
            ..type = BodyType.DYNAMIC
            ..position.setFrom(y);

          Body body = world.createBody(bd)
            ..createFixture(fixDef);

          y +=  deltaY; // .addLocal(deltaY);
        }

        x += deltaX; // .addLocal(deltaX);
      }
    }
  }

  void step() {
    world.step(TIME_STEP, VELOCITY_ITERATIONS, POSITION_ITERATIONS);
  }

  void warmup() {
    for (int i = 0; i < WARMUP; ++i) step();
  }

  double mean(List<int> values) {
    double total = 0.0;
    for (int i = 0; i < FRAMES; ++i) {
      total += values[i];
    }
    return total / FRAMES;
  }

  // Simple nearest-rank %ile (on sorted array). We should have enough samples to make this reasonable.
  num percentile(List<int> values, num pc) {
    int rank = ((pc * values.length) / 100).floor();
    return values[rank];
  }

  void bench() {
    var times = new List<int>(FRAMES);

    for (int i = 0; i < FRAMES; ++i) {
      var watch = new Stopwatch()..start();
      step();
      watch.stop();
      times[i] = watch.elapsedMilliseconds;
    }

    times.sort();
    double mean_times = mean(times);
    print('Benchmark complete.\nms/frame: ${mean_times} 5th %ile: ${percentile(times, 5)} 95th %ile: ${percentile(times, 95)}');
  }
}

void main() {
  var bench2d = new Bench2d()
     ..initialize()
     ..warmup()
     ..bench();
}
