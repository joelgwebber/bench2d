#include <stdio.h>

#include "Bench2d.h"

int main(int argc, char** argv) {
  result_t result = bench();
  printf("Benchmark complete.\n  ms/frame: %f +/- %f\n", result.mean, result.stddev);
  return 0;
}

