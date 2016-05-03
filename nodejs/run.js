'use strict';
import box2djs from './run_box2d';
import box2dnative from './run_box2d-native';
//import './run_box2dweb.js';

var WARMUP = 64;
var FRAMES = 1024;

function warmup(box2d) {
  for (var i = 0; i < WARMUP; ++i) {
    box2d.step();
  }
}

function mean(values) {
  var total = 0;
  for (var i = 0; i < FRAMES; ++i) {
    total += values[i];
  }
  return total / FRAMES;
}

// Simple nearest-rank %ile (on sorted array). We should have enough samples to make this reasonable.
function percentile(values, pc) {
  var rank = Math.floor((pc * values.length) / 100);
  return values[rank];
}

function bench(name, box2d) {
  var times = [];
  for (var i = 0; i < FRAMES; ++i) {
    var begin = new Date().getTime();
    box2d.step();
    times[i] = new Date().getTime() - begin;
  }

  times.sort();
  var avg = mean(times);
  console.log(name + " Benchmark complete.\nms/frame: " + avg + " 5th %ile: " + percentile(times, 5) + " 95th %ile: " + percentile(times, 95));
}

[{ box2d: box2djs, name: 'box2d.js' }, { box2d: box2dnative, name: 'box2d-native' }].forEach((box2d) => {
  box2d.box2d.init();
  warmup(box2d.box2d);
  bench(box2d.name, box2d.box2d);
});
