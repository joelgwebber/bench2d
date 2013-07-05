var WARMUP = 64;
var FRAMES = 1024;

function warmup() {
  for (var i = 0; i < WARMUP; ++i) {
    step();
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

function bench() {
  var times = [];
  for (var i = 0; i < FRAMES; ++i) {
    var begin = new Date().getTime();
    step();
    times[i] = new Date().getTime() - begin;
  }

  times.sort();
  var avg = mean(times);
  print("Benchmark complete.\nms/frame: " + avg + " 5th %ile: " + percentile(times, 5) + " 95th %ile: " + percentile(times, 95));
}

init();
warmup();
bench();
