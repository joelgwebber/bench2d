#include <cstdio>
#include <string>
#include <stdlib.h>

#include "ppapi/cpp/instance.h"
#include "ppapi/cpp/module.h"
#include "ppapi/cpp/var.h"

#include "Bench2d.h"

const char* const kBenchString = "bench";

class Bench2dInstance : public pp::Instance {
 public:
  explicit Bench2dInstance(PP_Instance instance) : pp::Instance(instance) {}
  virtual ~Bench2dInstance() {}

  virtual void HandleMessage(const pp::Var& var_message) {
    if (!var_message.is_string())
        return;

    std::string message = var_message.AsString();
    pp::Var var_reply;
    if (message == kBenchString) {
      result_t result = bench();
      char msg[256];
      sprintf(msg, "Benchmark complete.\n  ms/frame: %f 5th %%ile: %f 95th %%ile: %f\n", result.mean, result.pc_5th, result.pc_95th);
      var_reply = pp::Var(msg);
      PostMessage(var_reply);
    }
  }
};

class Bench2dModule : public pp::Module {
 public:
  Bench2dModule() : pp::Module() {}
  virtual ~Bench2dModule() {}

  virtual pp::Instance* CreateInstance(PP_Instance instance) {
    return new Bench2dInstance(instance);
  }
};

namespace pp {

Module* CreateModule() {
  return new Bench2dModule();
}

}  // namespace pp

