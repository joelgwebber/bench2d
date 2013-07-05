#ifndef __BENCH2D__
#define __BENCH2D__

// Turn this on to include the y-position of the top box in the output.
#define DEBUG 0

#define WARMUP 64
#define FRAMES 256

typedef struct {
  float mean;
  float pc_5th;
  float pc_95th;
} result_t;

result_t bench();

#endif
