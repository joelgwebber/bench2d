#include <stdio.h>

#include "Bench2d.h"

int main(int argc, char** argv) {
  result_t result = bench();
  printf("Benchmark complete.\n  ms/frame: %f 5th %%ile: %f 95th %%ile: %f\n", result.mean, result.pc_5th, result.pc_95th);
  return 0;
}
