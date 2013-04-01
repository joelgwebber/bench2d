var WARMUP = 64;
var FRAMES = 256;

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

function stddev(values, mean) {
  var variance = 0;
  for (var i = 0; i < values.length; ++i) {
    var diff = values[i] - mean;
    variance += diff * diff;
  }
  return Math.sqrt(variance / FRAMES);
}

function bench() {
  var times = [];
  for (var i = 0; i < FRAMES; ++i) {
    var begin = new Date().getTime();
    step();
    times[i] = new Date().getTime() - begin;
  }

  var avg = mean(times);
  print("Benchmark complete.\nms/frame: " + avg + " +/- " + stddev(times, avg));
}

init();
warmup();
bench();

