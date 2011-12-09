var WARMUP = 64;
var FRAMES = 256;

function warmup() {
  for (var i = 0; i < FRAMES; ++i) {
    step();
  }
}

function bench() {
  var times = [];
  for (var i = 0; i < FRAMES; ++i) {
    var begin = new Date().getTime();
    step();
    var end = new Date().getTime();
    times[i] = end - begin;
    print(times[i] + ", ");
  }

  var total = 0;
  for (var i = 0; i < FRAMES; ++i) {
    total += times[i];
  }
  print('Average: ' + (total / FRAMES));
}

warmup(FRAMES);
bench();

